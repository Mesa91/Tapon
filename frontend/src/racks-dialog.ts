import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Rack, Snapshot, capacityOf, shelvesOf } from "./types";
import { sharedStyles } from "./styles";

const MAX = 30;

interface Draft {
  name: string;
  shelves: number[];
}

/** Racks (name, shelves, bottles per shelf) plus the few settings. */
@customElement("tb-racks-dialog")
export class RacksDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @state() private _drafts: Record<string, Draft> = {};
  @state() private _open: string | null = null;

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private _draft(rack: Rack): Draft {
    return this._drafts[rack.id] || { name: rack.name, shelves: [...shelvesOf(rack)] };
  }

  private _edit(rack: Rack, change: (d: Draft) => void) {
    const d = this._draft(rack);
    const copy = { name: d.name, shelves: [...d.shelves] };
    change(copy);
    this._drafts = { ...this._drafts, [rack.id]: copy };
  }

  private _setShelfCount(rack: Rack, count: number) {
    this._edit(rack, (d) => {
      count = Math.max(1, Math.min(MAX, count));
      const last = d.shelves[d.shelves.length - 1] || 6;
      while (d.shelves.length < count) d.shelves.push(last);
      d.shelves.length = count;
    });
  }

  private _setShelf(rack: Rack, index: number, value: number) {
    this._edit(rack, (d) => (d.shelves[index] = Math.max(1, Math.min(MAX, value))));
  }

  private _setAll(rack: Rack, value: number) {
    this._edit(rack, (d) => (d.shelves = d.shelves.map(() => Math.max(1, Math.min(MAX, value)))));
  }

  private _count(rackId: string) {
    return this.data.bottles.filter((b) => b.rack_id === rackId).length;
  }

  private async _save(rack: Rack) {
    const d = this._draft(rack);
    const res = await this.card.ws({ type: "tapon/save_rack", rack: { id: rack.id, name: d.name, shelves: d.shelves } });
    const copy = { ...this._drafts };
    delete copy[rack.id];
    this._drafts = copy;
    this.card.toast(res.displaced ? `Salvato. ${res.displaced} bottiglie sono finite in "Da sistemare".` : "Scaffale salvato");
  }

  private async _delete(rack: Rack) {
    const n = this._count(rack.id);
    if (!confirm(`Eliminare "${rack.name}"?${n ? ` Le sue ${n} bottiglie restano in cantina, in "Da sistemare".` : ""}`)) return;
    await this.card.ws({ type: "tapon/delete_rack", rack_id: rack.id });
    this.card.toast("Scaffale eliminato");
  }

  private async _add() {
    const res = await this.card.ws({
      type: "tapon/save_rack",
      rack: { name: `Scaffale ${this.data.racks.length + 1}`, shelves: [8, 8, 8, 8, 8] },
    });
    this._open = res.rack.id;
  }

  private async _setting(key: string, value: unknown) {
    await this.card.ws({ type: "tapon/update_settings", [key]: value });
  }

  private _stepper(value: number, set: (v: number) => void) {
    return html`<span class="stepper">
      <button @click=${() => set(value - 1)} aria-label="meno">−</button>
      <span>${value}</span>
      <button @click=${() => set(value + 1)} aria-label="più">+</button>
    </span>`;
  }

  private _preview(shelves: number[]) {
    const widest = Math.max(...shelves);
    return html`<div class="preview">
      ${shelves.map((n) => html`<div class="pv-shelf">
        <div class="pv-row" style="grid-template-columns: repeat(${n}, 1fr); width: ${(n / widest) * 100}%">
          ${Array.from({ length: n }, () => html`<i></i>`)}
        </div>
        <div class="pv-board"></div>
      </div>`)}
    </div>`;
  }

  private _renderRack(rack: Rack) {
    const d = this._draft(rack);
    const dirty = !!this._drafts[rack.id];
    const open = this._open === rack.id || dirty;
    const uniform = d.shelves.every((n) => n === d.shelves[0]);
    const capacity = d.shelves.reduce((a, b) => a + b, 0);
    return html`<div class="rack ${open ? "open" : ""}">
      <button class="rack-sum" @click=${() => (this._open = open && !dirty ? null : rack.id)}>
        <span class="rack-name">${d.name}</span>
        <span class="note">${d.shelves.length} mensole · ${capacity} posti · ${this._count(rack.id)} bottiglie</span>
        <span class="chev">${open ? "▴" : "▾"}</span>
      </button>
      ${open
        ? html`<div class="rack-edit">
            <div class="cols">
              <div class="controls">
                <label class="field">Nome
                  <input .value=${d.name} @input=${(e: Event) => this._edit(rack, (x) => (x.name = (e.target as HTMLInputElement).value))} />
                </label>
                <div class="line"><span>Mensole</span>${this._stepper(d.shelves.length, (v) => this._setShelfCount(rack, v))}</div>
                <div class="line">
                  <span>Bottiglie per mensola${uniform ? "" : html` <em class="note">(diverse)</em>`}</span>
                  ${this._stepper(uniform ? d.shelves[0] : Math.max(...d.shelves), (v) => this._setAll(rack, v))}
                </div>
                <details ?open=${!uniform}>
                  <summary>Personalizza ogni mensola</summary>
                  ${d.shelves.map((n, i) => html`<div class="line small">
                    <span>Mensola ${i + 1}${i === 0 ? " (in alto)" : i === d.shelves.length - 1 ? " (in basso)" : ""}</span>
                    ${this._stepper(n, (v) => this._setShelf(rack, i, v))}
                  </div>`)}
                </details>
              </div>
              ${this._preview(d.shelves)}
            </div>
            <div class="rack-foot">
              <button class="btn small danger" @click=${() => this._delete(rack)}>Elimina scaffale</button>
              <span>
                ${dirty ? html`<button class="btn small" @click=${() => { const c = { ...this._drafts }; delete c[rack.id]; this._drafts = c; }}>Annulla</button>` : nothing}
                <button class="btn small primary" ?disabled=${!dirty} @click=${() => this._save(rack)}>Salva</button>
              </span>
            </div>
          </div>`
        : nothing}
    </div>`;
  }

  private async _inventory(rackId: string | null) {
    await this.card.ws({ type: "tapon/inventory_start", rack_id: rackId });
    this.card.toast("Inventario avviato: scansiona le bottiglie");
    this._close();
  }

  render() {
    const s = this.data.settings;
    const total = this.data.racks.reduce((a, r) => a + capacityOf(r), 0);
    return html`
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div>
              <div class="eyebrow">La tua cantina</div>
              <div class="dialog-title">Scaffali e impostazioni</div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="section" style="margin-top:4px">Scaffali · ${total} posti</div>
            ${this.data.racks.map((r) => this._renderRack(r))}
            <button class="btn" @click=${this._add}>＋ Nuovo scaffale</button>

            <div class="section">Etichette</div>
            <div class="types" style="margin-bottom:12px">
              ${[["qr", "Solo QR · 23 × 23 mm"], ["qr30", "Solo QR · 30 × 30 mm"], ["full", "QR e dati del vino · 50 × 30 mm"]].map(
                ([fmt, label]) => html`<button class="chip ${s.label_format === fmt ? "active" : ""}"
                  @click=${() => this._setting("label_format", fmt)}>${label}</button>`,
              )}
            </div>
            <label class="check">
              <input type="checkbox" .checked=${s.auto_labels}
                @change=${(e: Event) => this._setting("auto_labels", (e.target as HTMLInputElement).checked)} />
              Stampa l'etichetta QR quando aggiungo una bottiglia
            </label>

            <div class="section">Controllo inventario</div>
            <div class="note" style="margin-bottom:8px">
              Scansiona una per una le bottiglie (con il telefono o con lo scanner): in questa modalità
              non viene tolto nulla, alla fine vedi cosa manca, cosa è fuori posto e cosa risultava già bevuto.
            </div>
            <div class="types" style="margin-bottom:12px">
              <button class="chip" @click=${() => this._inventory(null)}>Tutta la cantina</button>
              ${this.data.racks.length > 1
                ? this.data.racks.map((r) => html`<button class="chip" @click=${() => this._inventory(r.id)}>Solo ${r.name}</button>`)
                : nothing}
            </div>

            <div class="section">Finestra di beva</div>
            <div class="note" style="margin-bottom:8px">Avvisami prima che si chiuda:</div>
            <div class="types">
              ${[[90, "3 mesi"], [180, "6 mesi"], [365, "1 anno"]].map(
                ([days, label]) => html`<button class="chip ${s.alert_days === days ? "active" : ""}"
                  @click=${() => this._setting("alert_days", days)}>${label}</button>`,
              )}
            </div>
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .rack {
        border: 1px solid var(--tb-line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.025);
        margin-bottom: 10px;
        overflow: hidden;
      }
      .rack.open {
        background: rgba(255, 255, 255, 0.04);
      }
      .rack-sum {
        width: 100%;
        display: flex;
        align-items: baseline;
        gap: 10px;
        padding: 14px 16px;
        background: none;
        border: none;
        color: var(--tb-ink);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .rack-name {
        font-family: var(--tb-serif);
        font-size: 1.15em;
        font-weight: 600;
      }
      .chev {
        margin-left: auto;
        color: var(--tb-ink-2);
      }
      .rack-edit {
        padding: 0 16px 14px;
      }
      .cols {
        display: grid;
        grid-template-columns: 1fr 160px;
        gap: 18px;
        align-items: start;
      }
      .controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        font-size: 0.92em;
      }
      .line.small {
        font-size: 0.85em;
        margin-top: 8px;
        color: var(--tb-ink-2);
      }
      details summary {
        cursor: pointer;
        color: var(--tb-gold);
        font-size: 0.85em;
      }
      .preview {
        padding: 12px 10px 10px;
        border-radius: 12px;
        background: linear-gradient(180deg, #1d1a1a, #110f10);
        border: 1px solid var(--tb-line);
        display: flex;
        flex-direction: column;
        gap: 7px;
        align-items: center;
      }
      .pv-shelf {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .pv-row {
        display: grid;
        gap: 2px;
      }
      .pv-row i {
        display: block;
        height: 12px;
        border-radius: 2px 2px 1px 1px;
        background: linear-gradient(180deg, rgba(216, 180, 106, 0.25), rgba(155, 44, 63, 0.55));
      }
      .pv-board {
        width: 100%;
        height: 2px;
        margin-top: 2px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 1px;
      }
      .rack-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      .check {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      @media (max-width: 480px) {
        .cols {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
}
