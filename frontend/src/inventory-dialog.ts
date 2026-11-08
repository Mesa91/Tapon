import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Bottle, HistoryEntry, InventoryReport, Snapshot, locationText, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";

@customElement("tb-inventory-dialog")
export class InventoryDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @property({ attribute: false }) report!: InventoryReport;
  @state() private _history: HistoryEntry[] = [];
  @state() private _done = new Set<string>();
  @state() private _busy = false;

  connectedCallback() {
    super.connectedCallback();
    if (this.report?.found_taken.length) {
      this.card.ws({ type: "tapon/get_history" }).then((r: { history: HistoryEntry[] }) => (this._history = r.history));
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _removeMissing(ids: string[]) {
    this._busy = true;
    try {
      const res = await this.card.ws({ type: "tapon/remove_bottles", bottle_ids: ids, reason: "missing" });
      ids.forEach((id) => this._done.add(id));
      this._done = new Set(this._done);
      this.card.toast(`${res.removed} bottiglie tolte come "non trovate": le ritrovi nello storico`);
    } finally {
      this._busy = false;
    }
  }

  private async _restore(ids: string[]) {
    this._busy = true;
    try {
      for (const id of ids) await this.card.ws({ type: "tapon/restore", history_id: id });
      ids.forEach((id) => this._done.add(id));
      this._done = new Set(this._done);
      this.card.toast(ids.length > 1 ? `${ids.length} bottiglie rimesse in cantina` : "Rimessa in cantina");
    } finally {
      this._busy = false;
    }
  }

  render() {
    const r = this.report;
    const byId = new Map(this.data.bottles.map((b) => [b.id, b]));
    const missing = r.missing.filter((id) => !this._done.has(id)).map((id) => byId.get(id)).filter(Boolean) as Bottle[];
    const misplaced = r.misplaced.map((id) => byId.get(id)).filter(Boolean) as Bottle[];
    const found = r.found_taken.filter((id) => !this._done.has(id))
      .map((id) => this._history.find((h) => h.history_id === id)).filter(Boolean) as HistoryEntry[];
    const rack = this.data.racks.find((x) => x.id === r.rack_id);
    const allGood = !missing.length && !misplaced.length && !r.found_taken.length && !r.unknown;
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Inventario${rack ? ` · ${rack.name}` : ""}</div>
              <div class="dialog-title">${r.seen} su ${r.total} trovate</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${allGood ? html`<div class="ok">✓ Tutto in ordine: la cantina corrisponde all'app.</div>` : nothing}

            ${missing.length
              ? html`<div class="section">Non trovate (${missing.length})</div>
                  <div class="note">Sono nell'app ma non le hai scansionate. Se sono davvero sparite, toglile.</div>
                  ${missing.map((b) => this._row(b, locationText(b, this.data.racks)))}
                  <button class="btn small danger" ?disabled=${this._busy} @click=${() => this._removeMissing(missing.map((b) => b.id))}>
                    Togli tutte le ${missing.length} come "non trovate"</button>`
              : nothing}

            ${found.length
              ? html`<div class="section">Risultavano già tolte (${found.length})</div>
                  <div class="note">Le hai scansionate, quindi sono ancora in cantina: rimettile.</div>
                  ${found.map((h) => this._row(h, `Tolta il ${new Date(h.removed_at).toLocaleDateString("it-IT")}`))}
                  <button class="btn small primary" ?disabled=${this._busy}
                    @click=${() => this._restore(found.map((h) => h.history_id))}>Rimetti in cantina</button>`
              : nothing}

            ${misplaced.length
              ? html`<div class="section">Fuori posto (${misplaced.length})</div>
                  <div class="note">Trovate in ${rack?.name || "questo scaffale"}, ma registrate altrove. Tocca per aprirle e spostarle.</div>
                  ${misplaced.map((b) => this._row(b, `Registrata in: ${locationText(b, this.data.racks)}`, true))}`
              : nothing}

            ${r.unknown
              ? html`<div class="section">Codici sconosciuti</div>
                  <div class="note">${r.unknown} QR non corrispondono a nessuna bottiglia: forse etichette vecchie da sostituire.</div>`
              : nothing}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `;
  }

  private _row(item: Bottle | HistoryEntry, where: string, open = false) {
    return html`<div class="row ${open ? "link" : ""}"
      @click=${open ? () => this.dispatchEvent(new CustomEvent("open-bottle", { detail: { bottleId: item.id } })) : null}>
      <span class="mini">${bottleSvg(item.type)}</span>
      <div class="text"><div>${wineTitle(item)}${item.producer ? html` <span class="note">· ${item.producer}</span>` : nothing}</div>
        <div class="note">${where}</div></div>
      ${open ? html`<span class="go">›</span>` : nothing}
    </div>`;
  }

  static styles = [
    sharedStyles,
    css`
      .ok {
        padding: 14px;
        border-radius: 12px;
        background: rgba(46, 125, 50, 0.16);
        color: #a5d6a7;
        text-align: center;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 0;
        border-bottom: 1px solid var(--tb-line, var(--divider-color));
      }
      .row.link {
        cursor: pointer;
      }
      .mini {
        width: 12px;
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
      .go {
        color: var(--secondary-text-color);
        font-size: 1.4em;
      }
      .note + .btn,
      .row + .btn {
        margin-top: 10px;
      }
    `,
  ];
}
