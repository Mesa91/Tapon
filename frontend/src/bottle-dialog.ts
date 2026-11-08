import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Bottle, Snapshot, WINE_FIELDS, locationText, maturity, openedText, serviceText, windowText, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { renderWineForm } from "./add-dialog";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";
import { ratingText, renderStars } from "./rating";

interface Label {
  code: string;
  png_base64: string;
  label_format: "qr" | "qr30" | "full";
  width_mm: number;
  height_mm: number;
}

@customElement("tb-bottle-dialog")
export class BottleDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @property({ attribute: false }) bottle!: Bottle;
  @state() private _label: Label | null = null;
  @state() private _editing = false;
  @state() private _values: Record<string, any> = {};
  @state() private _sameWine = true;
  @state() private _otherReason = false;
  @state() private _busy = false;
  @state() private _rating = false;
  @state() private _stars: number | null = null;
  @state() private _tasting = "";
  @state() private _reserving = false;
  @state() private _resFor = "";
  @state() private _resUntil = "";

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("data") && this._label && this.data.settings.label_format !== this._label.label_format) {
      this._label = null;
      this._loadLabel();
    }
    if (changed.has("bottle")) {
      const previous = changed.get("bottle") as Bottle | undefined;
      if (previous?.id !== this.bottle.id) {
        this._label = null;
        this._editing = false;
        this._rating = false;
        this._reserving = false;
        this._loadLabel();
      }
    }
  }

  private async _loadLabel() {
    const id = this.bottle.id;
    try {
      const label = await this.card.hass.callWS({ type: "tapon/get_label", bottle_id: id });
      if (this.bottle.id === id) this._label = label;
    } catch {
      /* the label is a nicety; the dialog works without it */
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private _sameWineCount() {
    const key = (b: Bottle) => `${(b.name || "").trim().toLowerCase()}|${(b.producer || "").trim().toLowerCase()}|${b.vintage || ""}`;
    return this.data.bottles.filter((b) => key(b) === key(this.bottle)).length;
  }

  private async _remove(reason: string, rated = false) {
    this._busy = true;
    try {
      const msg: Record<string, unknown> = { type: "tapon/remove_bottle", bottle_id: this.bottle.id, reason };
      if (rated) {
        if (this._stars) msg.rating = this._stars;
        if (this._tasting.trim()) msg.tasting_notes = this._tasting.trim();
      }
      const res = await this.card.ws(msg);
      if (res?.wishlisted) {
        this.card.toast(`${wineTitle(this.bottle)} era l'ultima: l'ho messa nella lista dei desideri da ricomprare ♡`);
        this._close();
        return;
      }
      this.card.toast(rated && this._stars
        ? `${wineTitle(this.bottle)}: bevuta, voto ${this._stars}/5. Salute!`
        : `${wineTitle(this.bottle)}: ${this.data.reasons[reason]?.toLowerCase() || "tolta"}. La trovi nello storico.`);
      this._close();
    } finally {
      this._busy = false;
    }
  }

  private async _saveReserve(clear = false) {
    this._busy = true;
    try {
      await this.card.ws({
        type: "tapon/reserve_bottle", bottle_id: this.bottle.id,
        reserved_for: clear ? "" : this._resFor.trim() || "Riservata", reserved_until: clear ? null : this._resUntil || null,
      });
      this.card.toast(clear ? "Riserva tolta" : "Bottiglia riservata: non verrà proposta negli abbinamenti");
      this._reserving = false;
    } finally {
      this._busy = false;
    }
  }

  private async _saveEdit() {
    this._busy = true;
    try {
      const res = await this.card.ws({
        type: "tapon/update_bottle",
        bottle_id: this.bottle.id,
        changes: this._values,
        same_wine: this._sameWine,
      });
      this.card.toast(res.updated > 1 ? `Aggiornate ${res.updated} bottiglie` : "Bottiglia aggiornata");
      this._editing = false;
      this._label = null;
      this._loadLabel();
    } finally {
      this._busy = false;
    }
  }

  private async _printOnPrinter() {
    const res = await this.card.ws({ type: "tapon/request_label", bottle_id: this.bottle.id });
    this.card.toast(res.printed ? "Etichetta stampata" : this.data.printer
      ? "Stampa non riuscita: guarda le notifiche di Home Assistant"
      : "Richiesta inviata. Per stampare da solo, scegli la stampante nelle opzioni di Tapon.");
  }

  private _printInBrowser() {
    if (!this._label) return;
    const win = window.open("", "_blank", "width=480,height=360");
    if (!win) {
      this.card.toast("Il browser ha bloccato la finestra di stampa");
      return;
    }
    const { width_mm: w, height_mm: h } = this._label;
    win.document.write(`<!doctype html><html><head><title>Etichetta ${this._label.code}</title>
      <style>@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0}img{width:${w}mm;height:${h}mm;display:block}</style></head>
      <body><img src="data:image/png;base64,${this._label.png_base64}"
      onload="setTimeout(function(){window.print();window.close();},150)"></body></html>`);
    win.document.close();
  }

  render() {
    const b = this.bottle;
    const t = this.data.types[b.type];
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="hero">
            <div class="hero-bottle">${bottleSvg(b.type, b.alert)}</div>
            <div class="hero-text">
              <div class="eyebrow">${t?.label || ""}${b.region ? ` · ${b.region}` : ""}</div>
              <div class="dialog-title">${b.name || "Vino"}</div>
              ${b.producer ? html`<div class="producer">${b.producer}</div>` : nothing}
              <div class="vintage">${b.vintage || "s.a."}</div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._rating ? this._renderRate() : this._editing ? this._renderEdit() : this._renderView(b, t)}
          </div>
          ${this._rating ? this._renderRateFoot() : this._editing ? this._renderEditFoot() : this._renderViewFoot()}
        </div>
      </div>
    `;
  }

  private _renderView(b: Bottle, t?: { label: string; color: string }) {
    const win = windowText(b);
    return html`
      <div class="badges">
        ${b.opened_at ? html`<span class="badge opened ${b.opened_state || ""}">🍾 ${openedText(b)}</span>` : nothing}
        ${b.alert === "closing" ? html`<span class="badge warn">Da bere presto</span>` : nothing}
        ${b.alert === "past" ? html`<span class="badge bad">Oltre la finestra</span>` : nothing}
        ${b.opened_at ? nothing : html`<span class="where">📍 ${locationText(b, this.data.racks)}</span>`}
        ${!this._reserving
          ? html`<button class="btn small res-btn" @click=${() => {
              this._resFor = b.reserved_for || "";
              this._resUntil = b.reserved_until || "";
              this._reserving = true;
            }}>${b.reserved_for ? "🔒 Modifica riserva" : "🔒 Riserva"}</button>`
          : nothing}
      </div>
      ${b.reserved_for && !this._reserving
        ? html`<div class="reserved">🔒 <b>Riservata</b>: ${b.reserved_for}${b.reserved_until
            ? html` · ${new Date(b.reserved_until + "T12:00").toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}` : nothing}
            <div class="note">Non viene proposta negli abbinamenti${b.reserved_until ? "; quel giorno ti arriva un promemoria" : ""}.</div></div>`
        : nothing}
      ${this._reserving
        ? html`<div class="reserve-form">
            <div class="form">
              <label class="field">Per cosa
                <input type="text" maxlength="200" placeholder="Es. anniversario, annata di nascita…" .value=${this._resFor}
                  @input=${(e: Event) => (this._resFor = (e.target as HTMLInputElement).value)} /></label>
              <label class="field">Quando (facoltativo)
                <input type="date" .value=${this._resUntil}
                  @input=${(e: Event) => (this._resUntil = (e.target as HTMLInputElement).value)} /></label>
            </div>
            <div class="row" style="justify-content:flex-end;margin-top:10px">
              ${b.reserved_for ? html`<button class="btn small" ?disabled=${this._busy} @click=${() => this._saveReserve(true)}>Togli riserva</button>` : nothing}
              <button class="btn small" @click=${() => (this._reserving = false)}>Annulla</button>
              <button class="btn small primary" ?disabled=${this._busy} @click=${() => this._saveReserve()}>Salva</button>
            </div>
          </div>`
        : nothing}
      ${b.past_count || b.past_notes
        ? html`<div class="past">
            <span class="past-head">Già bevuto${b.past_count ? html` ${b.past_count === 1 ? "una volta" : `${b.past_count} volte`}` : nothing}</span>
            ${b.past_rating ? html`${renderStars(b.past_rating)} <b>${ratingText(b.past_rating)}</b>` : nothing}
            ${b.past_notes ? html`<div class="past-notes">«${b.past_notes}»</div>` : nothing}
          </div>`
        : nothing}
      <dl class="facts">
        ${WINE_FIELDS.filter((f) => !["name", "producer", "vintage", "drink_from", "drink_until", "drink_peak", "serve_temp", "decant", "glass"].includes(f.key as string)).map((f) => {
          const v = b[f.key];
          if (v == null || v === "") return nothing;
          return html`<dt>${f.label}</dt><dd>${f.key === "price" ? `${Number(v).toFixed(2)} €` : v}</dd>`;
        })}
        ${win ? html`<dt>Finestra di beva</dt><dd>${win}</dd>` : nothing}
      </dl>
      ${this._renderService(b)}
      ${this._renderMaturity(b)}
      <div class="label-box">
        ${this._label
          ? html`<img class="label ${this._label.label_format}" alt="Etichetta QR" src="data:image/png;base64,${this._label.png_base64}" />`
          : html`<div class="note">Preparo l'etichetta…</div>`}
        <div class="note">Inquadra il QR con l'app Home Assistant quando prendi la bottiglia: verrà tolta dalla cantina.</div>
        <div class="row">
          <button class="btn small" @click=${this._printOnPrinter}>🖨️ Stampante etichette</button>
          <button class="btn small" ?disabled=${!this._label} @click=${this._printInBrowser}>Stampa dal browser</button>
        </div>
      </div>
      ${this._otherReason
        ? html`<div class="reasons">
            ${Object.entries(this.data.reasons).filter(([k]) => k !== "drank").map(
              ([key, label]) => html`<button class="btn small ${key === "deleted" ? "danger" : ""}" ?disabled=${this._busy}
                @click=${() => this._remove(key)}>${label}</button>`,
            )}
          </div>`
        : nothing}
    `;
  }

  private _renderViewFoot() {
    return html`<div class="dialog-foot">
      <button class="btn" @click=${() => this.dispatchEvent(new CustomEvent("move", { detail: { bottle: this.bottle } }))}>↔ Sposta</button>
      <button class="btn" @click=${() => {
        this._values = Object.fromEntries(["type", ...WINE_FIELDS.map((f) => f.key)].map((k) => [k, (this.bottle as any)[k] ?? ""]));
        this._sameWine = true;
        this._editing = true;
      }}>✏️ Modifica</button>
      <button class="btn" @click=${() => (this._otherReason = !this._otherReason)}>Altro…</button>
      ${this.bottle.opened_at
        ? nothing
        : html`<button class="btn" ?disabled=${this._busy} title="Aperta ma non finita: ti ricordo di finirla"
            @click=${this._open}>🍾 Aperta</button>`}
      <button class="btn primary" ?disabled=${this._busy} @click=${() => {
        this._stars = null;
        this._tasting = "";
        this._rating = true;
      }}>🍷 ${this.bottle.opened_at ? "Finita" : "Bevuta"}</button>
    </div>`;
  }

  private _renderMaturity(b: Bottle) {
    const m = maturity(b);
    const estimate = this.data.ai && !b.drink_peak
      ? html`<button class="btn small" ?disabled=${this._busy} @click=${this._estimatePeak}>✨ Stima il picco</button>` : nothing;
    if (!m) return this.data.ai ? html`<div class="maturity empty">${estimate}</div>` : nothing;
    return html`<div class="maturity ph-${m.phase}">
      <div class="m-head"><span class="m-label">${m.label}</span>${estimate}</div>
      <div class="m-bar" style=${m.peakPos != null ? `background:linear-gradient(90deg,#5c6bc0 0%,#7cb342 ${Math.max(0, m.peakPos - 22)}%,#e3b341 ${Math.max(0, m.peakPos - 4)}%,#e3b341 ${Math.min(100, m.peakPos + 4)}%,#ef6c00 ${Math.min(100, m.peakPos + 22)}%,#8d2b2b 100%)` : ""}>
        ${m.peakPos != null ? html`<span class="m-peak" style="left:${m.peakPos}%" title="Picco ${m.peak}"></span>` : nothing}
        <span class="m-today" style="left:${m.today}%" title="Oggi"></span>
      </div>
      <div class="m-scale"><span>${m.start}</span>
        ${m.peak && m.peakPos != null && m.peakPos > 14 && m.peakPos < 86
          ? html`<span class="m-peak-label" style="left:${m.peakPos}%">picco ${m.peak}</span>` : nothing}
        <span>${m.end}</span></div>
    </div>`;
  }

  private _estimatePeak = () =>
    this._aiComplete(["drink_peak", "drink_from", "drink_until"], "drink_peak",
      (c) => `Al suo meglio nel ${c.drink_peak}`, "Gemini non ha saputo stimare il picco di questo vino");

  private _estimateService = () =>
    this._aiComplete(["serve_temp", "decant", "glass"], "serve_temp",
      () => "Aggiunti i consigli di servizio", "Gemini non ha saputo dire come servirlo");

  /** Ask Gemini for the missing fields of this wine and save them on every bottle of it. */
  private async _aiComplete(keys: string[], required: string, ok: (c: Record<string, any>) => string, fail: string) {
    this._busy = true;
    try {
      const b = this.bottle;
      const res = await this.card.ws({ type: "tapon/ai_fill", wine: {
        name: b.name, producer: b.producer, vintage: b.vintage, type: b.type, region: b.region, grape: b.grape } });
      const w = res.wine || {};
      const changes: Record<string, any> = {};
      for (const k of keys) if (w[k] && !(b as any)[k]) changes[k] = w[k];
      if ("drink_peak" in changes) {
        const lo = Number(changes.drink_from ?? b.drink_from) || 0;
        const hi = Number(changes.drink_until ?? b.drink_until) || 9999;
        changes.drink_peak = Math.min(hi, Math.max(lo, Number(changes.drink_peak)));
      }
      if (!changes[required]) {
        this.card.toast(fail);
        return;
      }
      await this.card.ws({ type: "tapon/update_bottle", bottle_id: b.id, changes, same_wine: true });
      this.card.toast(ok(changes));
    } catch {
      /* shown by the card */
    } finally {
      this._busy = false;
    }
  }

  private _renderService(b: Bottle) {
    const parts = serviceText(b);
    if (!parts.length && !this.data.ai) return nothing;
    return html`<div class="service">
      ${parts.length
        ? parts.map((p) => html`<span class="svc">${p}</span>`)
        : html`<button class="btn small" ?disabled=${this._busy} @click=${this._estimateService}>✨ Come servirlo</button>`}
    </div>`;
  }

  private async _open() {
    this._busy = true;
    try {
      const res = await this.card.ws({ type: "tapon/open_bottle", bottle_id: this.bottle.id });
      this.card.toast(`Segnata come aperta: ti ricordo di finirla entro ${res.limit} giorni`);
      this._close();
    } finally {
      this._busy = false;
    }
  }

  private _renderRate() {
    return html`<div class="rate">
      ${this.bottle.reserved_for ? html`<div class="note">🔒 Era riservata: «${this.bottle.reserved_for}»</div>` : nothing}
      <div class="rate-q">Com'era?</div>
      ${renderStars(this._stars, (v) => (this._stars = v), true)}
      <div class="rate-hint">${["Tocca le stelle per votarla", "Deludente", "Così così", "Buono", "Molto buono", "Eccezionale"][this._stars || 0]}</div>
      <textarea class="tasting" rows="3" maxlength="1000"
        placeholder="Note di degustazione (facoltative): profumi, con cosa l'avete bevuta, se ricomprarla…"
        .value=${this._tasting} @input=${(e: Event) => (this._tasting = (e.target as HTMLTextAreaElement).value)}></textarea>
      <div class="note">Il voto resta nello storico e aiuta gli abbinamenti a proporti i vini che ti sono piaciuti di più.</div>
    </div>`;
  }

  private _renderRateFoot() {
    const empty = !this._stars && !this._tasting.trim();
    return html`<div class="dialog-foot">
      <button class="btn" ?disabled=${this._busy} @click=${() => (this._rating = false)}>Annulla</button>
      <button class="btn primary" ?disabled=${this._busy} @click=${() => this._remove("drank", true)}>
        ${empty ? "Togli senza voto" : "🍷 Salva e togli"}
      </button>
    </div>`;
  }

  private _renderEdit() {
    const count = this._sameWineCount();
    return html`
      ${renderWineForm(this.data, this._values, (k, v) => (this._values = { ...this._values, [k]: v }))}
      ${count > 1
        ? html`<label class="check"><input type="checkbox" .checked=${this._sameWine}
            @change=${(e: Event) => (this._sameWine = (e.target as HTMLInputElement).checked)} />
            Applica a tutte le ${count} bottiglie di questo vino</label>`
        : nothing}
    `;
  }

  private _renderEditFoot() {
    return html`<div class="dialog-foot">
      <button class="btn" @click=${() => (this._editing = false)}>Annulla</button>
      <button class="btn primary" ?disabled=${this._busy} @click=${this._saveEdit}>Salva</button>
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      .maturity {
        margin: 6px 0 14px;
      }
      .maturity.empty {
        display: flex;
        justify-content: flex-end;
      }
      .m-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .m-label {
        font-weight: 600;
        font-size: 0.92em;
      }
      .maturity.ph-peak .m-label {
        color: #e3b341;
      }
      .maturity.ph-declining .m-label,
      .maturity.ph-past .m-label {
        color: #ef9a6a;
      }
      .maturity.ph-young .m-label {
        color: #90caf9;
      }
      .m-bar {
        position: relative;
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #5c6bc0 0%, #7cb342 30%, #e3b341 55%, #e3b341 62%, #ef6c00 85%, #8d2b2b 100%);
        opacity: 0.85;
      }
      .m-peak {
        position: absolute;
        top: -3px;
        width: 2px;
        height: 14px;
        margin-left: -1px;
        background: rgba(255, 255, 255, 0.7);
      }
      .m-today {
        position: absolute;
        top: 50%;
        width: 14px;
        height: 14px;
        margin: -7px 0 0 -7px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid #1c1a1a;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6), 0 2px 6px rgba(0, 0, 0, 0.6);
      }
      .m-peak-label {
        position: absolute;
        transform: translateX(-50%);
      }
      .m-scale {
        position: relative;
        display: flex;
        justify-content: space-between;
        font-size: 0.75em;
        color: var(--secondary-text-color);
        margin-top: 6px;
        font-variant-numeric: tabular-nums;
      }
      .service {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 4px 0 12px;
      }
      .svc {
        padding: 5px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--tb-line, var(--divider-color));
        font-size: 0.88em;
      }
      .badge.opened {
        background: rgba(129, 199, 132, 0.2);
        color: #a5d6a7;
      }
      .badge.opened.today {
        background: rgba(227, 179, 65, 0.22);
        color: #e3b341;
      }
      .badge.opened.late {
        background: rgba(229, 57, 53, 0.22);
        color: #ef7a77;
      }
      .res-btn {
        margin-left: auto;
      }
      .reserved {
        margin: 2px 0 14px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--tb-line, var(--divider-color));
      }
      .reserve-form {
        margin: 2px 0 14px;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
      }
      .reserve-form .row {
        display: flex;
        gap: 6px;
      }
      .past {
        margin: 2px 0 14px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(227, 179, 65, 0.08);
        border: 1px solid rgba(227, 179, 65, 0.22);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        font-size: 0.92em;
      }
      .past-head {
        color: var(--secondary-text-color);
      }
      .past-notes {
        width: 100%;
        font-style: italic;
        color: var(--secondary-text-color);
      }
      .rate {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        text-align: center;
        padding: 4px 0;
      }
      .rate-q {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 1.35em;
      }
      .rate-hint {
        min-height: 1.2em;
        color: #e3b341;
        font-size: 0.9em;
      }
      .tasting {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
        resize: vertical;
      }
      .hero {
        display: flex;
        gap: 18px;
        align-items: flex-end;
        padding: 26px 24px 18px;
        background:
          radial-gradient(90% 120% at 15% 100%, rgba(155, 44, 63, 0.25), transparent 60%),
          radial-gradient(60% 80% at 100% 0%, rgba(216, 180, 106, 0.08), transparent 60%);
        border-bottom: 1px solid var(--tb-line);
        position: relative;
      }
      .hero .close {
        position: absolute;
        top: 16px;
        right: 16px;
      }
      .hero-bottle {
        width: 62px;
        flex: none;
        filter: drop-shadow(0 12px 14px rgba(0, 0, 0, 0.6));
      }
      .hero-bottle svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .hero-text {
        min-width: 0;
        padding-bottom: 6px;
      }
      .producer {
        color: var(--tb-ink-2);
        margin-top: 4px;
      }
      .vintage {
        font-family: var(--tb-serif);
        font-size: 2.1em;
        color: var(--tb-gold);
        line-height: 1;
        margin-top: 10px;
      }
      .badges {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 10px;
      }
      .badge {
        border-radius: 10px;
        padding: 2px 9px;
        font-size: 0.8em;
        color: #111;
        font-weight: 600;
      }
      .badge.warn {
        background: #ffa000;
      }
      .badge.bad {
        background: #e53935;
        color: #fff;
      }
      .where {
        font-size: 0.85em;
        color: var(--tb-ink-2);
      }
      .facts {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 4px 12px;
        margin: 0 0 12px;
        font-size: 0.92em;
      }
      dt {
        color: var(--tb-ink-2);
        font-size: 0.85em;
        letter-spacing: 0.04em;
      }
      dd {
        margin: 0;
        white-space: pre-wrap;
      }
      .label-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--tb-line);
        background: rgba(255, 255, 255, 0.025);
        text-align: center;
      }
      .label.qr,
      .label.qr30 {
        max-width: 140px;
        padding: 6px;
      }
      .label {
        width: 100%;
        max-width: 300px;
        background: #fff;
        border-radius: 4px;
        image-rendering: pixelated;
      }
      .row,
      .reasons {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .reasons {
        margin-top: 12px;
      }
      .check {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-top: 12px;
        font-size: 0.9em;
      }
    `,
  ];
}
