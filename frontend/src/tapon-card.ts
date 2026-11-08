import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Bottle, CardConfig, HistoryEntry, InventoryReport, Rack, SEARCH_COLOR, Snapshot, Wish, openedText, capacityOf, matches, shelvesOf, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, EMPTY_SVG, bottleSvg } from "./bottle";
import "./bottle-dialog";
import "./add-dialog";
import "./racks-dialog";
import "./history-dialog";
import "./pair-dialog";
import "./wishlist-dialog";
import "./inventory-dialog";
import "./check-dialog";

type Dialog =
  | { kind: "add"; rackId: string | null; row: number | null; col: number | null;
      mode?: "cellar" | "wish"; prefill?: Partial<Wish> | null; wishId?: string | null }
  | { kind: "wishlist" }
  | { kind: "check" }
  | { kind: "inventory"; report: InventoryReport }
  | { kind: "bottle"; bottleId: string }
  | { kind: "racks" }
  | { kind: "history" }
  | { kind: "pair" }
  | null;

@customElement("tapon-card")
export class TaponCard extends LitElement {
  @property({ attribute: false }) hass: any;
  @state() private _config: CardConfig = { type: "custom:tapon-card" };
  @state() private _data: Snapshot | null = null;
  @state() private _error = "";
  @state() private _typeFilter = "";
  @state() private _query = "";
  @state() private _dialog: Dialog = null;
  @state() private _moving: Bottle | null = null;
  @state() private _toast = "";
  private _unsub?: () => void;
  private _subscribing = false;
  private _toastTimer?: number;

  setConfig(config: CardConfig) {
    this._config = { ...config };
  }

  static getStubConfig() {
    return { type: "custom:tapon-card" };
  }

  getCardSize() {
    return 8;
  }

  getGridOptions() {
    return { columns: "full", min_columns: 6 };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hass) this._subscribe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this._unsub && !this._subscribing) this._subscribe();
  }

  private async _subscribe() {
    if (this._unsub || this._subscribing || !this.hass?.connection) return;
    this._subscribing = true;
    try {
      this._unsub = await this.hass.connection.subscribeMessage(
        (data: Snapshot) => {
          this._data = data;
          this._error = "";
        },
        { type: "tapon/subscribe" },
      );
    } catch (err: any) {
      this._error =
        err?.code === "unknown_command"
          ? "L'integrazione Tapon non è installata: aggiungila da Impostazioni → Dispositivi e servizi."
          : `Impossibile caricare la cantina: ${err?.message || err}`;
    } finally {
      this._subscribing = false;
    }
  }

  async ws(msg: Record<string, unknown>): Promise<any> {
    try {
      return await this.hass.callWS(msg);
    } catch (err: any) {
      this.toast(err?.message || "Operazione non riuscita");
      throw err;
    }
  }

  toast(text: string) {
    this._toast = text;
    clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => (this._toast = ""), 3500);
  }

  // ── interactions ─────────────────────────────────────────────────────────

  private _onCell(rack: Rack, row: number, col: number, bottle?: Bottle) {
    if (this._data?.inventory) {
      // During an inventory check a tap means "this one is here", like a scan.
      if (bottle) this.ws({ type: "tapon/take_code", code: `tapon-${bottle.code}` });
      return;
    }
    if (this._moving) {
      const moving = this._moving;
      this._moving = null;
      if (bottle?.id === moving.id) return;
      this.ws({ type: "tapon/move_bottle", bottle_id: moving.id, rack_id: rack.id, row, col }).then(() =>
        this.toast(bottle ? "Bottiglie scambiate di posto" : "Bottiglia spostata"),
      );
      return;
    }
    this._dialog = bottle
      ? { kind: "bottle", bottleId: bottle.id }
      : { kind: "add", rackId: rack.id, row, col };
  }

  private _startMove = (e: CustomEvent) => {
    this._moving = e.detail.bottle;
    this._dialog = null;
  };

  // ── render ───────────────────────────────────────────────────────────────

  render() {
    const d = this._data;
    return html`
      <ha-card>
        ${BOTTLE_DEFS}
        ${this._error ? html`<div class="empty">${this._error}</div>` : !d ? html`<div class="empty">Carico la cantina…</div>` : this._renderBody(d)}
        ${this._toast ? html`<div class="toast">${this._toast}</div>` : nothing}
      </ha-card>
      ${d ? this._renderDialog(d) : nothing}
    `;
  }

  private _renderBody(d: Snapshot) {
    const total = d.bottles.length;
    const capacity = d.racks.reduce((s, r) => s + capacityOf(r), 0);
    const closing = d.bottles.filter((b) => b.alert === "closing").length;
    const past = d.bottles.filter((b) => b.alert === "past").length;
    const unplaced = d.bottles.filter((b) => !b.rack_id && !b.opened_at);
    const opened = d.bottles.filter((b) => b.opened_at).sort((a, b) => (b.opened_days ?? 0) - (a.opened_days ?? 0));
    const counts = Object.fromEntries(Object.keys(d.types).map((t) => [t, d.bottles.filter((b) => b.type === t).length]));
    // Never more columns than racks: one rack should use the whole width.
    const wanted = Math.round(Number(this._config.columns)) || 0;
    const columns = wanted ? Math.max(1, Math.min(6, wanted, d.racks.length || 1)) : 0;

    return html`
      <div class="header">
        <div class="title">
          <span class="logo">🍷</span>
          <div>
            <div class="name">${this._config.title || "Tapon"}</div>
            <div class="sub">${total} bottiglie · ${capacity - d.racks.reduce((s, r) => s + this._inRack(d, r).length, 0)} posti liberi${this._renderValue(d)}</div>
          </div>
        </div>
        ${this._renderClimate(d)}
        <div class="actions">
          <button class="btn primary" @click=${() => (this._dialog = { kind: "add", rackId: null, row: null, col: null })}>
            ＋ Aggiungi
          </button>
          <button class="btn" title="Che vino apro con questo piatto?" @click=${() => (this._dialog = { kind: "pair" })}>🍽 Abbina</button>
          <button class="btn" title="In enoteca: ce l'ho già?" @click=${() => (this._dialog = { kind: "check" })}>📷 Ce l'ho?</button>
          <button class="btn" title="Lista dei desideri" @click=${() => (this._dialog = { kind: "wishlist" })}>
            ♡ Desideri${d.wishlist?.length ? html` <span class="count">${d.wishlist.length}</span>` : nothing}
          </button>
          <button class="btn" title="Storico" @click=${() => (this._dialog = { kind: "history" })}>🕓 Storico</button>
          <button class="btn" title="Scaffali e impostazioni" @click=${() => (this._dialog = { kind: "racks" })}>⚙︎</button>
        </div>
      </div>

      ${closing || past
        ? html`<div class="banner">
            ${closing ? html`<span>🍷 <b>${closing}</b> da bere presto</span>` : nothing}
            ${past ? html`<span>⚠️ <b>${past}</b> oltre la finestra di beva</span>` : nothing}
            <span class="hint">cartellino dorato: da bere presto · rosso: oltre la finestra</span>
          </div>`
        : nothing}

      ${d.inventory ? this._renderInventoryBanner(d, d.inventory) : nothing}

      ${this._moving
        ? html`<div class="banner moving">
            Tocca la nuova posizione per <b>${wineTitle(this._moving)}</b>
            <button class="btn small" @click=${() => (this._moving = null)}>Annulla</button>
          </div>`
        : nothing}

      <div class="filters">
        <button class="chip ${this._typeFilter ? "" : "active"}" @click=${() => (this._typeFilter = "")}>Tutti ${total}</button>
        ${Object.entries(d.types).map(
          ([key, t]) => html`<button
            class="chip ${this._typeFilter === key ? "active" : ""}"
            @click=${() => (this._typeFilter = this._typeFilter === key ? "" : key)}
          ><span class="dot" style="background:${t.color}"></span>${t.label} ${counts[key] || 0}</button>`,
        )}
        <input class="search" type="search" placeholder="Cerca vino, produttore, annata…"
          .value=${this._query} @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)} />
        ${this._renderLightButton(d)}
      </div>

      ${d.highlight?.groups.length ? this._renderLitBanner(d) : nothing}

      <div class="racks ${columns ? "fixed" : ""}" style=${columns ? `--tb-columns:${columns}` : ""}>
        ${d.racks.map((rack) => this._renderRack(d, rack))}
      </div>

      ${opened.length
        ? html`<div class="unplaced">
            <div class="section-title">🍾 Aperte (${opened.length})</div>
            <div class="list">
              ${opened.map((b) => html`<button class="list-item opened ${b.opened_state || ""}"
                  @click=${() => (this._dialog = { kind: "bottle", bottleId: b.id })}>
                  <span class="dot" style="background:${d.types[b.type]?.color}"></span>${wineTitle(b)}
                  <span class="od">${openedText(b)}</span>
                </button>`)}
            </div>
          </div>`
        : nothing}
      ${unplaced.length
        ? html`<div class="unplaced">
            <div class="section-title">Da sistemare (${unplaced.length})</div>
            <div class="list">
              ${unplaced.map((b) => html`<button class="list-item ${this._dims(b) ? "dim" : ""}"
                  @click=${() => (this._dialog = { kind: "bottle", bottleId: b.id })}>
                  <span class="dot" style="background:${d.types[b.type]?.color}"></span>${wineTitle(b)}
                </button>`)}
            </div>
          </div>`
        : nothing}
      ${!d.racks.length ? html`<div class="empty">Nessuno scaffale: creane uno da ⚙︎.</div>` : nothing}
    `;
  }

  private _renderLightButton(d: Snapshot) {
    if (!this._query.trim() && !this._typeFilter) return nothing;
    const found = d.bottles.filter((b) => !this._dims(b));
    if (!found.length || d.inventory) return nothing;
    const label = [this._typeFilter ? d.types[this._typeFilter]?.label : "", this._query.trim()].filter(Boolean).join(" · ");
    return html`<button class="btn small light-btn" title="Evidenzia sullo scaffale finché non ne prendi una"
      @click=${async () => {
        await this.ws({ type: "tapon/highlight", source: "search", query: label,
          groups: [{ label, color: SEARCH_COLOR, bottle_ids: found.map((b) => b.id) }] });
        this._query = "";
        this._typeFilter = "";
      }}>💡 Illumina ${found.length}</button>`;
  }

  private _renderLitBanner(d: Snapshot) {
    const hl = d.highlight!;
    return html`<div class="banner lit">
      <span>💡</span>
      <div class="legend">
        ${hl.groups.map((g) => html`<span class="lg"><span class="lgdot" style="--hl:${g.color}"></span>${g.label || "Selezione"}
          <span class="muted">${g.bottle_ids.length}</span></span>`)}
      </div>
      <span class="hint">restano accese finché non ne prendi una</span>
      <button class="btn small" @click=${() => this.ws({ type: "tapon/highlight_clear" })}>Spegni</button>
    </div>`;
  }

  private _renderInventoryBanner(d: Snapshot, inv: InventoryReport) {
    const rack = d.racks.find((r) => r.id === inv.rack_id);
    const last = inv.last;
    const icon: Record<string, string> = { ok: "✓", again: "↺ già contata", misplaced: "⚠ fuori posto",
      found_taken: "↩ risultava già tolta", unknown: "? codice sconosciuto" };
    return html`<div class="banner inventory">
      <div class="inv-text">
        <b>📋 Inventario${rack ? ` · ${rack.name}` : ""}</b>
        <span class="inv-count">${inv.seen}/${inv.total} trovate</span>
        ${last ? html`<span class="hint">Ultima: ${last.name ? `${last.name}${last.vintage ? ` ${last.vintage}` : ""} ` : ""}${icon[last.result] || ""}</span>`
          : html`<span class="hint">Scansiona i QR, o tocca le bottiglie che vedi</span>`}
      </div>
      <div class="inv-progress"><span style="width:${inv.total ? Math.round((inv.seen / inv.total) * 100) : 0}%"></span></div>
      <div class="inv-actions">
        <button class="btn small" @click=${() => this.ws({ type: "tapon/inventory_stop" }).then(() => this.toast("Inventario annullato"))}>Annulla</button>
        <button class="btn small primary" @click=${async () => {
          const res = await this.ws({ type: "tapon/inventory_stop" });
          this._dialog = { kind: "inventory", report: res.inventory };
        }}>Fine: vedi risultato</button>
      </div>
    </div>`;
  }

  private _renderValue(d: Snapshot) {
    const v = d.value;
    if (!v || !v.priced) return nothing;
    const euro = v.total.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    const missing = v.bottles - v.priced;
    return html` · <span class="value" title=${missing
      ? `Valore delle ${v.priced} bottiglie con prezzo (${missing} senza prezzo)`
      : "Valore della cantina"}>${euro}${missing ? "*" : ""}</span>`;
  }

  private _renderClimate(d: Snapshot) {
    const c = d.climate;
    if (!c || (!c.temperature_entity && !c.humidity_entity)) return nothing;
    const chip = (entity: string | null, icon: string, unit: string, lo: number, hi: number, label: string) => {
      if (!entity) return nothing;
      const st = this.hass?.states?.[entity];
      const value = st ? Number(st.state) : NaN;
      const ok = !isNaN(value);
      const status = !ok ? "na" : value < lo ? "low" : value > hi ? "high" : "ok";
      const shown = ok ? value.toLocaleString("it-IT", { maximumFractionDigits: 1 }) : "—";
      const hint = status === "ok" ? `${label} ideale (${lo}–${hi} ${unit})`
        : status === "na" ? `${label} non disponibile`
        : `${label} troppo ${status === "low" ? "bassa" : "alta"}: ideale ${lo}–${hi} ${unit}`;
      return html`<button class="climate ${status}" title=${hint}
        @click=${() => this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }))}>
        <span class="ci">${icon}</span><b>${shown}</b><span class="cu">${unit}</span>
      </button>`;
    };
    return html`<div class="climates">
      ${chip(c.temperature_entity, "🌡", "°C", c.temperature_min, c.temperature_max, "Temperatura")}
      ${chip(c.humidity_entity, "💧", "%", c.humidity_min, c.humidity_max, "Umidità")}
    </div>`;
  }

  private _invClass(d: Snapshot, b: Bottle) {
    const inv = d.inventory;
    if (!inv || (inv.rack_id && b.rack_id !== inv.rack_id)) return "";
    return inv.missing.includes(b.id) ? "unseen" : "seen";
  }

  private _inRack(d: Snapshot, rack: Rack) {
    return d.bottles.filter((b) => b.rack_id === rack.id && b.row != null && b.col != null);
  }

  private _dims(b: Bottle) {
    return (this._typeFilter && b.type !== this._typeFilter) || !matches(b, this._query);
  }

  private _renderRack(d: Snapshot, rack: Rack) {
    const inRack = this._inRack(d, rack);
    const at = new Map(inRack.map((b) => [`${b.row}:${b.col}`, b]));
    const shelves = shelvesOf(rack);
    const lit = new Map<string, string>();
    for (const g of d.highlight?.groups || []) for (const id of g.bottle_ids) if (!lit.has(id)) lit.set(id, g.color);
    return html`
      <div class="rack ${lit.size ? "lighting" : ""}">
        <div class="rack-head"><span>${rack.name}</span><span class="muted">${inRack.length}/${capacityOf(rack)}</span></div>
        <div class="shelves">
          ${shelves.map((n, r) => html`<div class="shelf">
            <div class="grid" style="grid-template-columns: repeat(${n}, minmax(0, 34px))">
              ${Array.from({ length: n }, (_, c) => {
                const b = at.get(`${r}:${c}`);
                return html`<button
                  class="cell ${b ? "full" : "free"} ${b && this._dims(b) ? "dim" : ""} ${b && this._moving?.id === b.id ? "moving" : ""} ${b?.reserved_for ? "reserved" : ""} ${b ? this._invClass(d, b) : ""} ${b && lit.has(b.id) ? "lit" : ""}"
                  style=${b && lit.has(b.id) ? `--hl:${lit.get(b.id)}` : ""}
                  title=${b ? `${wineTitle(b)}${b.producer ? ` · ${b.producer}` : ""}${b.reserved_for ? ` · 🔒 ${b.reserved_for}` : ""}` : `Mensola ${r + 1}, posto ${c + 1}: libero`}
                  @click=${() => this._onCell(rack, r, c, b)}
                >${b ? bottleSvg(b.type, b.alert) : EMPTY_SVG}</button>`;
              })}
            </div>
            <div class="board"></div>
          </div>`)}
        </div>
      </div>
    `;
  }

  private _renderDialog(d: Snapshot) {
    const dlg = this._dialog;
    if (!dlg) return nothing;
    const close = () => (this._dialog = null);
    switch (dlg.kind) {
      case "add":
        return html`<tb-add-dialog .card=${this} .data=${d} .rackId=${dlg.rackId} .row=${dlg.row} .col=${dlg.col}
          .mode=${dlg.mode || "cellar"} .prefill=${dlg.prefill || null} .wishId=${dlg.wishId || null} @close=${close}></tb-add-dialog>`;
      case "wishlist":
        return html`<tb-wishlist-dialog .card=${this} .data=${d} @close=${close}
          @add-wish=${() => (this._dialog = { kind: "add", rackId: null, row: null, col: null, mode: "wish" })}
          @buy=${(e: CustomEvent) => (this._dialog = { kind: "add", rackId: null, row: null, col: null, mode: "cellar",
            prefill: e.detail.wish, wishId: e.detail.wish.id })}></tb-wishlist-dialog>`;
      case "check":
        return html`<tb-check-dialog .card=${this} .data=${d} @close=${close}
          @buy=${(e: CustomEvent) => (this._dialog = { kind: "add", rackId: null, row: null, col: null, mode: "cellar",
            prefill: e.detail.wine })}></tb-check-dialog>`;
      case "inventory":
        return html`<tb-inventory-dialog .card=${this} .data=${d} .report=${dlg.report} @close=${close}
          @open-bottle=${(e: CustomEvent) => (this._dialog = { kind: "bottle", bottleId: e.detail.bottleId })}></tb-inventory-dialog>`;
      case "bottle": {
        const bottle = d.bottles.find((b) => b.id === dlg.bottleId);
        if (!bottle) return nothing;
        return html`<tb-bottle-dialog .card=${this} .data=${d} .bottle=${bottle} @close=${close} @move=${this._startMove}></tb-bottle-dialog>`;
      }
      case "racks":
        return html`<tb-racks-dialog .card=${this} .data=${d} @close=${close}></tb-racks-dialog>`;
      case "pair":
        return html`<tb-pair-dialog .card=${this} .data=${d} @close=${close}
          @open-bottle=${(e: CustomEvent) => (this._dialog = { kind: "bottle", bottleId: e.detail.bottleId })}></tb-pair-dialog>`;
      case "history":
        return html`<tb-history-dialog .card=${this} .data=${d} @close=${close}></tb-history-dialog>`;
    }
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        min-width: 0;
        max-width: 100%;
      }
      ha-card {
        overflow: hidden;
        position: relative;
        container-type: inline-size;
        container-name: tb;
        max-width: 100%;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 16px 16px 8px;
        flex-wrap: wrap;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .logo {
        font-size: 1.8em;
      }
      .name {
        font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif;
        font-size: 1.55em;
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .value {
        color: #e3b341;
        font-variant-numeric: tabular-nums;
      }
      .sub,
      .muted {
        color: var(--secondary-text-color);
        font-size: 0.85em;
      }
      .climates {
        display: flex;
        gap: 6px;
        margin-left: auto;
        margin-right: 6px;
      }
      .climate {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid var(--tb-line);
        background: rgba(255, 255, 255, 0.04);
        color: var(--tb-ink, var(--primary-text-color));
        font: inherit;
        cursor: pointer;
      }
      .climate b {
        font-size: 1.05em;
        font-variant-numeric: tabular-nums;
      }
      .climate .cu,
      .climate .ci {
        font-size: 0.8em;
        color: var(--tb-ink-2);
      }
      .climate.low,
      .climate.high {
        border-color: rgba(255, 160, 0, 0.6);
        background: rgba(255, 160, 0, 0.12);
      }
      .climate.na {
        opacity: 0.5;
      }
      @container tb (max-width: 599px) {
        .climates {
          margin-left: 0;
          order: 3;
          width: 100%;
        }
      }
      .actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .banner {
        margin: 4px 16px 8px;
        padding: 8px 12px;
        border-radius: 10px;
        background: rgba(255, 152, 0, 0.12);
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        align-items: center;
        font-size: 0.9em;
      }
      .banner.moving {
        background: rgba(33, 150, 243, 0.15);
        justify-content: space-between;
      }
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.85em;
      }
      .filters {
        display: flex;
        gap: 6px;
        padding: 4px 16px 10px;
        flex-wrap: wrap;
        align-items: center;
      }
      .search {
        flex: 1 1 180px;
        min-width: 150px;
        padding: 7px 10px;
        border-radius: 18px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
      }
      .racks {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
        gap: 14px;
        padding: 4px 16px 16px;
      }
      /* Colonne decise dalla larghezza reale della scheda (non dello schermo):
         al massimo --tb-columns, ma vanno a capo quando ogni rastrelliera
         scenderebbe sotto i 240px (es. barra laterale di HA aperta). */
      .racks.fixed {
        grid-template-columns: repeat(
          auto-fit,
          minmax(max(min(240px, 100%), calc((100% - (var(--tb-columns) - 1) * 14px) / var(--tb-columns))), 1fr)
        );
      }
      .rack {
        min-width: 0;
        border-radius: 18px;
        padding: 14px 14px 18px;
        background:
          radial-gradient(120% 60% at 50% 0%, rgba(255, 255, 255, 0.06), transparent 60%),
          linear-gradient(180deg, #1d1a1a, #121011);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 10px 30px rgba(0, 0, 0, 0.35);
      }
      .rack-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        color: #f1e9df;
        font-weight: 600;
        letter-spacing: 0.02em;
        padding: 0 2px 14px;
      }
      .rack-head .muted {
        color: #9b928a;
        font-variant-numeric: tabular-nums;
      }
      .shelves {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .shelf {
        position: relative;
      }
      .board {
        height: 5px;
        margin: 2px -6px 0;
        border-radius: 2px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04) 60%, rgba(0, 0, 0, 0.4));
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.35);
      }
      .grid {
        display: grid;
        gap: 7px;
        justify-content: center;
      }
      .cell {
        aspect-ratio: 24 / 64;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        position: relative;
        transition: transform 0.18s ease, opacity 0.2s, filter 0.2s;
      }
      .cell svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
      }
      .cell.full {
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.5));
      }
      .cell.full:hover {
        transform: translateY(-5px);
        filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.6));
      }
      .cell.free:hover svg path {
        fill: rgba(255, 255, 255, 0.08);
        stroke: rgba(255, 255, 255, 0.45);
      }
      .cell .tag {
        transform-box: fill-box;
        transform-origin: 0 0;
        animation: tb-sway 4s ease-in-out infinite;
      }
      @keyframes tb-sway {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-4deg); }
      }
      .light-btn {
        flex: none;
      }
      .banner.lit {
        background: rgba(255, 226, 176, 0.08);
        border: 1px solid rgba(255, 226, 176, 0.18);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        flex: 1;
      }
      .lg {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .lgdot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--hl);
        box-shadow: 0 0 8px 2px var(--hl);
      }
      .rack.lighting .cell.full:not(.lit) {
        opacity: 0.35;
      }
      .cell.lit {
        z-index: 1;
        filter: drop-shadow(0 0 5px var(--hl)) drop-shadow(0 0 12px var(--hl));
        animation: tb-glow 2.2s ease-in-out infinite;
      }
      .cell.lit::before {
        content: "";
        position: absolute;
        left: -40%;
        right: -40%;
        bottom: -10px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(closest-side, var(--hl), transparent);
        opacity: 0.85;
        pointer-events: none;
      }
      @keyframes tb-glow {
        50% {
          filter: drop-shadow(0 0 3px var(--hl)) drop-shadow(0 0 7px var(--hl));
        }
      }
      .cell.reserved::after {
        content: "🔒";
        position: absolute;
        top: -2px;
        right: -4px;
        font-size: 9px;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.8));
      }
      .cell.unseen {
        opacity: 0.28;
        filter: grayscale(0.6);
      }
      .cell.seen::before {
        content: "✓";
        position: absolute;
        left: 50%;
        bottom: -3px;
        transform: translateX(-50%);
        z-index: 1;
        font-size: 10px;
        font-weight: 700;
        line-height: 14px;
        width: 14px;
        border-radius: 50%;
        text-align: center;
        background: #2e7d32;
        color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      }
      .count {
        display: inline-block;
        min-width: 18px;
        padding: 0 5px;
        border-radius: 999px;
        background: rgba(227, 179, 65, 0.2);
        color: #e3b341;
        font-size: 0.8em;
        line-height: 18px;
        text-align: center;
      }
      .banner.inventory {
        background: rgba(46, 125, 50, 0.16);
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      .inv-text {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        align-items: baseline;
      }
      .inv-count {
        font-variant-numeric: tabular-nums;
      }
      .inv-progress {
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .inv-progress span {
        display: block;
        height: 100%;
        background: #4caf50;
        transition: width 0.3s ease;
      }
      .inv-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .cell.dim {
        opacity: 0.15;
        filter: grayscale(0.7);
      }
      .cell.moving {
        outline: 2px solid #2196f3;
        outline-offset: 2px;
        border-radius: 4px;
      }
      .unplaced {
        padding: 0 16px 16px;
      }
      .section-title {
        font-weight: 600;
        margin-bottom: 6px;
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .list-item {
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--divider-color);
        background: none;
        color: inherit;
        border-radius: 16px;
        padding: 5px 10px;
        cursor: pointer;
        font: inherit;
      }
      .list-item .od {
        font-size: 0.8em;
        color: var(--secondary-text-color);
      }
      .list-item.opened.today {
        border-color: rgba(227, 179, 65, 0.6);
      }
      .list-item.opened.today .od {
        color: #e3b341;
      }
      .list-item.opened.late {
        border-color: rgba(229, 57, 53, 0.6);
      }
      .list-item.opened.late .od {
        color: #ef7a77;
      }
      .list-item.dim {
        opacity: 0.3;
      }
      .empty {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }
      .toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        max-width: min(520px, 90vw);
        text-align: center;
        transform: translateX(-50%);
        background: rgba(20, 16, 17, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        color: #f2ebe3;
        padding: 10px 18px;
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        font-size: 0.9em;
        z-index: 2;
      }
    `,
  ];
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "tapon-card",
  name: "Tapon",
  description: "La tua cantina: scaffali, bottiglie, QR e finestre di beva",
  preview: false,
});

export type { HistoryEntry };
