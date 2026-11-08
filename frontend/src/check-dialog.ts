import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SEARCH_COLOR, Snapshot, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";
import { ratingText, renderStars } from "./rating";
import { shrink } from "./add-dialog";

interface Found {
  match: "same" | "vintage" | "similar";
  name: string;
  producer: string;
  vintage: number | null;
  type: string;
}
interface CheckResult {
  wine: Record<string, any>;
  cellar: (Found & { bottles: number; bottle_ids: string[]; locations: string[]; reserved: number })[];
  drunk: (Found & { times: number; rating: number | null; notes: string; last: string })[];
  wished: (Found & { wish_id: string; source: string })[];
}

@customElement("tb-check-dialog")
export class CheckDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @state() private _text = "";
  @state() private _busy = "";
  @state() private _photo = "";
  @state() private _result: CheckResult | null = null;

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _onPhoto(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    this._photo = await shrink(file);
    this._check({ image: this._photo }, "Leggo l'etichetta…");
  }

  private _onText(e: Event) {
    e.preventDefault();
    const text = this._text.trim();
    if (!text) return;
    const year = text.match(/\b(19|20)\d\d\b/);
    const name = text.replace(/\b(19|20)\d\d\b/, "").replace(/\s+/g, " ").trim();
    this._photo = "";
    this._check({ wine: { name, ...(year ? { vintage: Number(year[0]) } : {}) } }, "Cerco…");
  }

  private async _check(payload: Record<string, unknown>, busy: string) {
    this._busy = busy;
    this._result = null;
    try {
      this._result = await this.card.ws({ type: "tapon/check_wine", ...payload });
    } catch {
      /* the card shows the error */
    } finally {
      this._busy = "";
    }
  }

  private async _wish() {
    const w = this._result!.wine;
    await this.card.ws({ type: "tapon/wishlist_add", wine: w, where: "", wish_notes: "" });
    this.card.toast(`${wineTitle(w as any)} aggiunto ai desideri`);
    this._result = { ...this._result!, wished: [{ ...(w as any), match: "same", wish_id: "", source: "manual" }] };
  }

  private async _light() {
    const ids = this._result!.cellar.flatMap((c) => c.bottle_ids);
    await this.card.ws({ type: "tapon/highlight", source: "search", query: wineTitle(this._result!.wine as any),
      groups: [{ label: wineTitle(this._result!.wine as any), color: SEARCH_COLOR, bottle_ids: ids }] });
    this._close();
  }

  render() {
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">In enoteca o al ristorante</div><div class="dialog-title">Ce l'ho già?</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="ask">
              <label class="shot ${this._photo ? "has" : ""} ${!this.data.ai ? "off" : ""}"
                title=${this.data.ai ? "Fotografa l'etichetta" : "Serve la chiave Gemini nelle opzioni"}>
                ${this._photo ? html`<img src=${this._photo} alt="Etichetta" />` : html`<span>📷</span>`}
                <span class="shot-label">${this._photo ? "Un'altra" : "Fotografa l'etichetta"}</span>
                <input type="file" accept="image/*" capture="environment" ?disabled=${!this.data.ai || !!this._busy}
                  @change=${this._onPhoto} />
              </label>
              <form class="by-name" @submit=${this._onText}>
                <span class="note">oppure scrivi nome e annata</span>
                <div class="row">
                  <input class="dish" type="text" placeholder="Es. Barolo Cannubi 2016" .value=${this._text}
                    @input=${(e: Event) => (this._text = (e.target as HTMLInputElement).value)} />
                  <button class="btn primary" type="submit" ?disabled=${!!this._busy || !this._text.trim()}>Cerca</button>
                </div>
              </form>
            </div>
            ${this._busy ? html`<div class="note waiting">${this._busy}</div>` : nothing}
            ${this._result ? this._renderResult(this._result) : nothing}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `;
  }

  private _renderResult(r: CheckResult) {
    const w = r.wine;
    const same = r.cellar.filter((c) => c.match === "same");
    const sameCount = same.reduce((a, c) => a + c.bottles, 0);
    const drunkSame = r.drunk.find((d) => d.match === "same") || r.drunk.find((d) => d.match === "vintage");
    let verdict: [string, string];
    if (sameCount) verdict = ["yes", `Sì, ce l'hai: ${sameCount === 1 ? "1 bottiglia" : `${sameCount} bottiglie`}`];
    else if (r.cellar.some((c) => c.match === "vintage")) verdict = ["almost", "Hai lo stesso vino, ma di un'altra annata"];
    else if (r.cellar.length) verdict = ["almost", "Non proprio questo, ma qualcosa di simile"];
    else if (drunkSame) verdict = ["no", "Non in cantina, ma l'hai già bevuto"];
    else verdict = ["no", "No, non ce l'hai"];
    const wished = r.wished.some((x) => x.match === "same");
    return html`
      <div class="seen">
        <span class="mini">${bottleSvg(w.type || "red")}</span>
        <div><div class="seen-title">${wineTitle(w as any)}</div>
          <div class="note">${[w.producer, w.region].filter(Boolean).join(" · ")}</div></div>
      </div>
      <div class="verdict ${verdict[0]}">${verdict[1]}</div>

      ${r.cellar.length
        ? html`<div class="section">In cantina</div>
            ${r.cellar.map((c) => html`<div class="found">
              <div><b>${wineTitle(c)}</b>${c.producer ? html` <span class="note">· ${c.producer}</span>` : nothing}
                ${c.match === "similar" ? html`<span class="pill">simile</span>` : nothing}</div>
              <div class="note">${c.bottles} ${c.bottles === 1 ? "bottiglia" : "bottiglie"} · 📍 ${[...new Set(c.locations)].slice(0, 2).join("; ")}
                ${c.reserved ? html` · 🔒 ${c.reserved} riservat${c.reserved === 1 ? "a" : "e"}` : nothing}</div>
            </div>`)}`
        : nothing}

      ${r.drunk.length
        ? html`<div class="section">Già bevuto</div>
            ${r.drunk.map((d) => html`<div class="found">
              <div><b>${wineTitle(d)}</b> <span class="note">· ${d.times === 1 ? "una volta" : `${d.times} volte`}, l'ultima il
                ${new Date(d.last).toLocaleDateString("it-IT")}</span></div>
              ${d.rating ? html`<div>${renderStars(d.rating)} <span class="note">${ratingText(d.rating)}</span></div>` : nothing}
              ${d.notes ? html`<div class="note italic">«${d.notes}»</div>` : nothing}
            </div>`)}`
        : nothing}

      ${r.wished.length
        ? html`<div class="section">Nella lista dei desideri</div>
            ${r.wished.map((x) => html`<div class="found"><b>${wineTitle(x)}</b>
              ${x.source === "rebuy" ? html`<span class="pill gold">da ricomprare</span>` : nothing}</div>`)}`
        : nothing}

      <div class="acts">
        ${r.cellar.length ? html`<button class="btn small" @click=${this._light}>💡 Illumina</button>` : nothing}
        ${!wished ? html`<button class="btn small" @click=${this._wish}>♡ Aggiungi ai desideri</button>` : nothing}
        <button class="btn small primary" @click=${() => this.dispatchEvent(new CustomEvent("buy", { detail: { wine: w } }))}>
          🛒 L'ho comprato</button>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .ask {
        display: flex;
        gap: 14px;
        align-items: stretch;
      }
      .shot {
        flex: none;
        width: 110px;
        min-height: 110px;
        border-radius: 14px;
        border: 1px dashed rgba(255, 255, 255, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        font-size: 1.6em;
        text-align: center;
      }
      .shot.off {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .shot img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.45;
      }
      .shot-label {
        font-size: 0.5em;
        position: relative;
        padding: 0 6px;
      }
      .shot input {
        display: none;
      }
      .by-name {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }
      .by-name .row {
        display: flex;
        gap: 8px;
      }
      .dish {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
      }
      .waiting {
        margin-top: 16px;
        animation: pulse 1.4s ease-in-out infinite;
      }
      @keyframes pulse {
        50% {
          opacity: 0.45;
        }
      }
      .seen {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 18px;
      }
      .mini {
        width: 18px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .seen-title {
        font-weight: 600;
        font-size: 1.05em;
      }
      .verdict {
        margin: 12px 0 4px;
        padding: 12px 14px;
        border-radius: 12px;
        font-weight: 600;
      }
      .verdict.yes {
        background: rgba(46, 125, 50, 0.18);
        color: #a5d6a7;
      }
      .verdict.almost {
        background: rgba(227, 179, 65, 0.14);
        color: #e3b341;
      }
      .verdict.no {
        background: rgba(255, 255, 255, 0.05);
      }
      .found {
        padding: 8px 0;
        border-bottom: 1px solid var(--tb-line, var(--divider-color));
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .pill {
        font-size: 0.72em;
        padding: 1px 7px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        margin-left: 6px;
      }
      .pill.gold {
        background: rgba(227, 179, 65, 0.2);
        color: #e3b341;
      }
      .italic {
        font-style: italic;
      }
      .acts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 14px;
      }
      @media (max-width: 480px) {
        .ask {
          flex-direction: column;
        }
        .shot {
          width: 100%;
          min-height: 90px;
        }
      }
    `,
  ];
}
