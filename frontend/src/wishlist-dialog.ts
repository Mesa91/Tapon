import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Snapshot, Wish, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";
import { renderStars } from "./rating";

@customElement("tb-wishlist-dialog")
export class WishlistDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _remove(w: Wish) {
    await this.card.ws({ type: "tapon/wishlist_remove", wish_id: w.id });
    this.card.toast(`${wineTitle(w)} tolto dai desideri`);
  }

  render() {
    const items = this.data.wishlist || [];
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Da comprare</div><div class="dialog-title">Lista dei desideri</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${!items.length
              ? html`<div class="empty-wish">
                  <div class="big">♡</div>
                  <div>Ancora vuota.</div>
                  <div class="note">Aggiungi i vini assaggiati al ristorante o da amici: basta una foto dell'etichetta.
                    Anche quando finisci l'ultima bottiglia di un vino a cui hai dato 4 o 5 stelle, finisce qui da solo.</div>
                </div>`
              : items.map((w) => this._renderWish(w))}
          </div>
          <div class="dialog-foot">
            <button class="btn" @click=${this._close}>Chiudi</button>
            <button class="btn primary" @click=${() => this.dispatchEvent(new CustomEvent("add-wish"))}>＋ Aggiungi desiderio</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderWish(w: Wish) {
    const t = this.data.types[w.type];
    return html`<div class="wish">
      <span class="mini">${bottleSvg(w.type)}</span>
      <div class="text">
        <div class="title">
          ${wineTitle(w)}
          ${w.source === "rebuy" ? html`<span class="tag">Da ricomprare</span>` : nothing}
        </div>
        <div class="note">${[w.producer, t?.label, w.region].filter(Boolean).join(" · ")}</div>
        ${w.rating ? html`<div class="note">Il tuo voto ${renderStars(w.rating)}</div>` : nothing}
        ${w.where ? html`<div class="note">📍 ${w.where}</div>` : nothing}
        ${w.wish_notes ? html`<div class="note italic">${w.wish_notes}</div>` : nothing}
      </div>
      <div class="acts">
        <button class="btn small primary" title="L'ho comprato: mettilo in cantina"
          @click=${() => this.dispatchEvent(new CustomEvent("buy", { detail: { wish: w } }))}>🛒 Comprato</button>
        <button class="btn small" title="Togli dalla lista" @click=${() => this._remove(w)}>✕</button>
      </div>
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      .wish {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid var(--tb-line, var(--divider-color));
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
      .text {
        flex: 1;
        min-width: 0;
      }
      .title {
        font-weight: 600;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .tag {
        font-size: 0.72em;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(227, 179, 65, 0.2);
        color: #e3b341;
      }
      .italic {
        font-style: italic;
      }
      .acts {
        display: flex;
        gap: 6px;
        flex: none;
      }
      .empty-wish {
        text-align: center;
        padding: 18px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .empty-wish .big {
        font-size: 2.4em;
        color: #e3b341;
      }
    `,
  ];
}
