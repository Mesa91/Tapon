import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Bottle, Snapshot, WINE_FIELDS } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";

/** Form for a wine: used to add bottles and to edit one. */
export function renderWineForm(
  data: Snapshot,
  values: Record<string, any>,
  onChange: (key: string, value: any) => void,
) {
  return html`
    <div class="form">
      <label class="field wide">
        Tipo
        <div class="types">
          ${Object.entries(data.types).map(
            ([key, t]) => html`<button type="button" class="chip ${values.type === key ? "active" : ""}"
              @click=${() => onChange("type", key)}><span class="dot" style="background:${t.color}"></span>${t.label}</button>`,
          )}
        </div>
      </label>
      ${WINE_FIELDS.map((f) => {
        const wide = f.key === "name" || f.kind === "area";
        const value = values[f.key as string] ?? "";
        const input = (e: Event) => onChange(f.key as string, (e.target as HTMLInputElement).value);
        return html`<label class="field ${wide ? "wide" : ""}">
          ${f.label}
          ${f.kind === "area"
            ? html`<textarea rows="2" .value=${value} @input=${input}></textarea>`
            : html`<input
                type=${f.kind === "text" ? "text" : "number"}
                inputmode=${f.kind === "text" ? "text" : "numeric"}
                step=${f.kind === "number" ? "0.01" : "1"}
                .value=${String(value)}
                @input=${input}
              />`}
        </label>`;
      })}
    </div>
  `;
}

@customElement("tb-add-dialog")
export class AddDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @property({ attribute: false }) rackId: string | null = null;
  @property({ attribute: false }) row: number | null = null;
  @property({ attribute: false }) col: number | null = null;
  /** "wish": the same form, saved to the wishlist instead of the cellar. */
  @property({ attribute: false }) mode: "cellar" | "wish" = "cellar";
  @property({ attribute: false }) prefill: Record<string, any> | null = null;
  /** Buying a wish: it leaves the wishlist once added. */
  @property({ attribute: false }) wishId: string | null = null;
  @state() private _where = "";
  @state() private _wishNotes = "";
  private _prefilled = false;
  @state() private _values: Record<string, any> = { type: "red" };
  @state() private _quantity = 1;
  @state() private _busy = false;
  @state() private _reading = "";
  @state() private _front = "";
  @state() private _back = "";

  static styles = [
    sharedStyles,
    css`
      .ai {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: center;
        padding: 14px;
        margin-bottom: 16px;
        border-radius: 16px;
        border: 1px solid rgba(216, 180, 106, 0.25);
        background:
          radial-gradient(120% 140% at 0% 0%, rgba(216, 180, 106, 0.12), transparent 55%),
          rgba(255, 255, 255, 0.025);
      }
      .ai-title {
        font-weight: 600;
      }
      .ai .note {
        margin-top: 2px;
      }
      .slots {
        display: flex;
        gap: 8px;
      }
      .slot {
        position: relative;
        width: 74px;
        height: 96px;
        border-radius: 12px;
        border: 1px dashed rgba(216, 180, 106, 0.45);
        background: rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        overflow: hidden;
        transition: border-color 0.15s, background 0.15s;
      }
      .slot:hover {
        border-color: var(--tb-gold);
        background: rgba(216, 180, 106, 0.08);
      }
      .slot.has {
        border-style: solid;
      }
      .slot.off {
        opacity: 0.4;
        cursor: default;
      }
      .slot img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .slot .plus {
        font-size: 1.4em;
      }
      .slot-label {
        position: relative;
        font-size: 0.72em;
        text-align: center;
        line-height: 1.15;
        padding: 2px 6px;
        border-radius: 8px;
      }
      .slot.has .slot-label {
        margin-top: auto;
        margin-bottom: 6px;
        background: rgba(0, 0, 0, 0.65);
      }
      .slot-label small {
        display: block;
        color: var(--tb-ink-2);
        font-size: 0.9em;
      }
      .reading {
        grid-column: 1 / -1;
        height: 3px;
        border-radius: 2px;
        background: linear-gradient(90deg, transparent, var(--tb-gold), transparent);
        background-size: 40% 100%;
        background-repeat: no-repeat;
        animation: tb-scan 1.1s linear infinite;
      }
      @keyframes tb-scan {
        from { background-position: -40% 0; }
        to { background-position: 140% 0; }
      }
      input[type="file"] {
        display: none;
      }
    `,
  ];

  private _merge(wine: Record<string, any>, overwrite: boolean) {
    const next = { ...this._values };
    for (const [k, v] of Object.entries(wine)) {
      if (v === null || v === undefined || v === "") continue;
      if (overwrite || next[k] === undefined || next[k] === null || String(next[k]).trim() === "") next[k] = v;
    }
    this._values = next;
  }

  private async _photo(e: Event, side: "front" | "back") {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    const image = await shrink(file);
    if (side === "front") this._front = image;
    else this._back = image;
    if (this._front) await this._read();
  }

  /** Read whatever photos are there (front, plus back if given). */
  private async _read() {
    this._reading = this._back ? "Leggo fronte e retro…" : "Leggo l'etichetta…";
    try {
      const res = await this.card.ws({
        type: "tapon/ai_recognize",
        image: this._front,
        ...(this._back ? { back_image: this._back } : {}),
      });
      this._merge(res.wine, true);
      this.card.toast(this._back ? "Fronte e retro letti: controlla i dati" : "Etichetta letta: controlla i dati");
    } catch {
      /* the card already showed the error */
    } finally {
      this._reading = "";
    }
  }

  private _slot(side: "front" | "back") {
    const image = side === "front" ? this._front : this._back;
    const label = side === "front" ? "Fronte" : "Retro";
    const disabled = !!this._reading || (side === "back" && !this._front);
    return html`<label class="slot ${image ? "has" : ""} ${disabled ? "off" : ""}"
        title=${side === "back" && !this._front ? "Prima fotografa il fronte" : `Foto ${label.toLowerCase()}`}>
      ${image ? html`<img src=${image} alt=${label} />` : html`<span class="plus">📷</span>`}
      <span class="slot-label">${label}${side === "back" && !image ? html`<small>facoltativo</small>` : nothing}</span>
      <input type="file" accept="image/*" capture="environment" ?disabled=${disabled}
        @change=${(e: Event) => this._photo(e, side)} />
    </label>`;
  }

  private async _fill() {
    if (!String(this._values.name || "").trim()) {
      this.card.toast("Scrivi almeno il nome del vino");
      return;
    }
    this._reading = "Completo i dati…";
    try {
      const res = await this.card.ws({ type: "tapon/ai_fill", wine: this._values });
      this._merge(res.wine, false);
      this.card.toast("Dati completati");
    } catch {
      /* shown by the card */
    } finally {
      this._reading = "";
    }
  }

  private _renderAI() {
    if (!this.data.ai) {
      return html`<div class="ai"><div>
        <div class="ai-title">✨ Compilazione automatica</div>
        <div class="note">Aggiungi una chiave Gemini (gratuita) in Impostazioni → Dispositivi e servizi → Tapon → Configura per leggere le etichette con una foto.</div>
      </div></div>`;
    }
    return html`<div class="ai">
      <div class="slots">${this._slot("front")}${this._slot("back")}</div>
      <div class="ai-side">
        <div class="ai-title">✨ Compilazione automatica</div>
        <div class="note">${this._reading ||
          (this._front
            ? "Fatto. Se in etichetta mancava qualcosa, aggiungi il retro."
            : "Fotografa il fronte dell'etichetta; il retro è facoltativo.")}</div>
        <button class="btn small" style="margin-top:8px" ?disabled=${!!this._reading} @click=${this._fill}>Oppure completa dal nome</button>
      </div>
      ${this._reading ? html`<div class="reading"></div>` : nothing}
    </div>`;
  }

  protected willUpdate() {
    if (!this._prefilled && this.prefill) {
      this._prefilled = true;
      const skip = new Set(["id", "added_at", "source", "where", "wish_notes", "rating"]);
      this._values = { type: "red", ...Object.fromEntries(Object.entries(this.prefill).filter(([k, v]) => !skip.has(k) && v != null)) };
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _save() {
    if (!String(this._values.name || "").trim()) {
      this.card.toast("Scrivi almeno il nome del vino");
      return;
    }
    if (this.mode === "wish") {
      this._busy = true;
      try {
        await this.card.ws({ type: "tapon/wishlist_add", wine: this._values, where: this._where, wish_notes: this._wishNotes });
        this.card.toast("Aggiunto alla lista dei desideri");
        this._close();
      } finally {
        this._busy = false;
      }
      return;
    }
    this._busy = true;
    try {
      const res = await this.card.ws({
        type: "tapon/add_bottles",
        wine: this._values,
        quantity: this._quantity,
        rack_id: this.rackId,
        row: this.row,
        col: this.col,
        wish_id: this.wishId,
      });
      const added: Bottle[] = res.bottles;
      const unplaced = added.filter((b) => !b.rack_id).length;
      this.card.toast(
        unplaced
          ? `Aggiunte ${added.length} bottiglie, ${unplaced} da sistemare: scaffale pieno`
          : added.length > 1 ? `Aggiunte ${added.length} bottiglie` : "Bottiglia aggiunta",
      ) + (this.wishId ? " e tolta dai desideri" : "");
      this._close();
    } finally {
      this._busy = false;
    }
  }

  private _renderWishFields() {
    return html`<div class="form" style="margin-top:10px">
      <label class="field wide">
        Dove l'hai assaggiato
        <input type="text" maxlength="200" placeholder="Es. cena da Marco, Osteria del Ponte…" .value=${this._where}
          @input=${(e: Event) => (this._where = (e.target as HTMLInputElement).value)} />
      </label>
      <label class="field wide">
        Nota
        <textarea rows="2" maxlength="1000" placeholder="Es. chiedere all'enoteca sotto casa, prezzo visto 25 €…"
          .value=${this._wishNotes} @input=${(e: Event) => (this._wishNotes = (e.target as HTMLTextAreaElement).value)}></textarea>
      </label>
    </div>`;
  }

  render() {
    const rack = this.data.racks.find((r) => r.id === this.rackId);
    const where =
      rack && this.row != null && this.col != null
        ? `${rack.name}, mensola ${this.row + 1}, posto ${this.col + 1}`
        : "nel primo posto libero";
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div style="display:flex;gap:16px;align-items:flex-end">
              <div style="width:34px;flex:none;filter:drop-shadow(0 8px 10px rgba(0,0,0,.55))">${bottleSvg(this._values.type || "red")}</div>
              <div>
                <div class="eyebrow">${this.mode === "wish" ? "Lista dei desideri" : this.wishId ? "Comprato!" : "Nuovo in cantina"}</div>
                <div class="dialog-title">${String(this._values.name || "").trim() || "Aggiungi vino"}</div>
              </div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._renderAI()}
            ${renderWineForm(this.data, this._values, (k, v) => (this._values = { ...this._values, [k]: v }))}
            ${this.mode === "wish" ? this._renderWishFields() : html`            <div class="form" style="margin-top:10px">
              <label class="field">
                Quante bottiglie
                <input type="number" min="1" max="100" .value=${String(this._quantity)}
                  @input=${(e: Event) => (this._quantity = Math.max(1, Math.min(100, Number((e.target as HTMLInputElement).value) || 1)))} />
              </label>
              <div class="field">Dove<span style="color:var(--tb-ink);text-transform:none;letter-spacing:normal;font-size:1.3em">${where}${this._quantity > 1 ? " e i successivi" : ""}</span></div>
            </div>
            ${this.data.settings.auto_labels
              ? html`<p class="note">Per ogni bottiglia verrà richiesta la stampa dell'etichetta QR.</p>`
              : nothing}`}
          </div>
          <div class="dialog-foot">
            <button class="btn" @click=${this._close}>Annulla</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${this._save}>
              ${this._busy ? "Salvo…" : this.mode === "wish" ? "♡ Aggiungi ai desideri"
                : `Aggiungi ${this._quantity > 1 ? `${this._quantity} bottiglie` : "bottiglia"}`}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

/** Downscale a photo to keep the upload small (Gemini reads 1280 px fine). */
export async function shrink(file: File, max = 1280): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
