import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HistoryEntry, Snapshot, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";
import { renderStars } from "./rating";

@customElement("tb-history-dialog")
export class HistoryDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @state() private _items: HistoryEntry[] | null = null;
  @state() private _editing: string | null = null;
  @state() private _stars: number | null = null;
  @state() private _tasting = "";

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  private async _load() {
    const res = await this.card.ws({ type: "tapon/get_history" });
    this._items = res.history;
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _restore(item: HistoryEntry) {
    const res = await this.card.ws({ type: "tapon/restore", history_id: item.history_id });
    this.card.toast(res.bottle.rack_id ? "Rimessa al suo posto" : "Rimessa in cantina, in \"Da sistemare\"");
    this._load();
  }

  private _edit(h: HistoryEntry) {
    this._editing = this._editing === h.history_id ? null : h.history_id;
    this._stars = h.rating ?? null;
    this._tasting = h.tasting_notes || "";
  }

  private async _saveRating(h: HistoryEntry) {
    const res = await this.card.ws({
      type: "tapon/rate_history", history_id: h.history_id,
      rating: this._stars, tasting_notes: this._tasting.trim(),
    });
    this._editing = null;
    this.card.toast(res?.wishlisted ? "Voto salvato. Era l'ultima: messa nei desideri da ricomprare ♡" : "Voto salvato");
    this._load();
  }

  render() {
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Bottiglie stappate e non solo</div><div class="dialog-title">Storico</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._items === null
              ? html`<div class="note">Carico…</div>`
              : !this._items.length
                ? html`<div class="note">Ancora nessuna bottiglia tolta dalla cantina.</div>`
                : this._items.map((h) => this._renderItem(h))}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `;
  }

  private _renderItem(h: HistoryEntry) {
    const drank = h.reason === "drank";
    const open = this._editing === h.history_id;
    return html`<div class="item ${open ? "open" : ""}">
      <div class="line">
        <span class="mini">${bottleSvg(h.type)}</span>
        <div class="text">
          <div>${wineTitle(h)}</div>
          <div class="note">${this.data.reasons[h.reason] || h.reason} · ${new Date(h.removed_at).toLocaleDateString("it-IT")}
            ${h.producer ? html` · ${h.producer}` : nothing}</div>
          ${drank && !open
            ? html`<button class="vote" @click=${() => this._edit(h)} title="Vota o scrivi una nota">
                ${h.rating ? renderStars(h.rating) : html`<span class="add-vote">☆ Vota</span>`}
                ${h.tasting_notes ? html`<span class="tn">«${h.tasting_notes}»</span>` : nothing}
              </button>`
            : nothing}
        </div>
        <button class="btn small" @click=${() => this._restore(h)}>Rimetti</button>
      </div>
      ${open
        ? html`<div class="editor">
            ${renderStars(this._stars, (v) => (this._stars = v), true)}
            <textarea rows="2" maxlength="1000" placeholder="Note di degustazione…" .value=${this._tasting}
              @input=${(e: Event) => (this._tasting = (e.target as HTMLTextAreaElement).value)}></textarea>
            <div class="row">
              <button class="btn small" @click=${() => (this._editing = null)}>Annulla</button>
              <button class="btn small primary" @click=${() => this._saveRating(h)}>Salva</button>
            </div>
          </div>`
        : nothing}
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      .item {
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .line {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .vote {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-top: 4px;
        padding: 0;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        min-width: 0;
      }
      .add-vote {
        font-size: 0.82em;
        color: #e3b341;
      }
      .tn {
        font-size: 0.82em;
        font-style: italic;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 10px 0 4px;
      }
      .editor textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
      }
      .editor .row {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        width: 100%;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .mini {
        width: 14px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .item {
        border-bottom-color: var(--tb-line) !important;
      }
    `,
  ];
}
