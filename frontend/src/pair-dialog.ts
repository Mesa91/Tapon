import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { COURSE_COLORS, SEARCH_COLOR, Snapshot, serviceText, wineTitle } from "./types";
import { sharedStyles } from "./styles";
import { BOTTLE_DEFS, bottleSvg } from "./bottle";
import { ratingText, renderStars } from "./rating";

interface Pick {
  key: string;
  name: string;
  producer: string;
  vintage: number | null;
  type: string;
  status: string;
  bottles: number;
  bottle_ids: string[];
  locations: string[];
  reason: string;
  rating?: number | null;
  opened?: number;
  serve_temp?: string;
  decant?: string;
  glass?: string;
}

interface PairResult {
  source: "ai" | "local";
  advice: string;
  picks?: Pick[];
  courses?: { course: string; wine: Pick | null; reason: string }[];
  one?: Pick | null;
}

const COURSE_HINTS = ["Antipasto", "Primo", "Secondo", "Dolce"];

const QUICK = ["Brasato", "Pesce al forno", "Crudi di mare", "Pizza", "Formaggi stagionati", "Risotto ai funghi", "Dolce"];

@customElement("tb-pair-dialog")
export class PairDialog extends LitElement {
  @property({ attribute: false }) card: any;
  @property({ attribute: false }) data!: Snapshot;
  @state() private _dish = "";
  @state() private _busy = false;
  @state() private _result: PairResult | null = null;
  @state() private _asked = "";
  @state() private _mode: "dish" | "menu" = "dish";
  @state() private _courses: string[] = ["", "", "", ""];

  firstUpdated() {
    (this.renderRoot.querySelector("input") as HTMLInputElement | null)?.focus();
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private async _ask(dish = this._dish) {
    dish = dish.trim();
    if (!dish || this._busy) return;
    this._dish = dish;
    this._busy = true;
    this._result = null;
    try {
      this._result = await this.card.ws({ type: "tapon/pair", dish });
      this._asked = dish;
    } catch {
      /* toast already shown */
    } finally {
      this._busy = false;
    }
  }

  private async _askMenu() {
    const courses = this._courses.map((c) => c.trim()).filter(Boolean);
    if (!courses.length || this._busy) return;
    this._busy = true;
    this._result = null;
    try {
      this._result = await this.card.ws({ type: "tapon/pair", courses });
      this._asked = courses.join(" · ");
    } catch {
      /* toast already shown */
    } finally {
      this._busy = false;
    }
  }

  private _setMode(mode: "dish" | "menu") {
    if (this._mode === mode) return;
    this._mode = mode;
    this._result = null;
  }

  private async _light(groups: { label: string; color: string; bottle_ids: string[] }[], source: "pair" | "menu") {
    if (!groups.length) return;
    await this.card.ws({ type: "tapon/highlight", source, query: this._asked, groups });
    this.card.toast("Illuminate sullo scaffale: si spengono quando ne prendi una");
    this._close();
  }

  private _open(p: Pick) {
    this.dispatchEvent(new CustomEvent("open-bottle", { detail: { bottleId: p.bottle_ids[0] } }));
  }

  render() {
    const r = this._result;
    return html`
      ${BOTTLE_DEFS}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Dalla tua cantina</div><div class="dialog-title">Cosa si mangia?</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="modes">
              <button class="chip ${this._mode === "dish" ? "active" : ""}" @click=${() => this._setMode("dish")}>Un piatto</button>
              <button class="chip ${this._mode === "menu" ? "active" : ""}" @click=${() => this._setMode("menu")}>Menu della serata</button>
            </div>
            ${this._mode === "dish" ? this._renderDishForm(r) : this._renderMenuForm()}
            ${this._busy ? html`<div class="note waiting">Il sommelier sta guardando gli scaffali…</div>` : nothing}
            ${r ? (r.courses ? this._renderMenuResult(r) : this._renderResult(r)) : nothing}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `;
  }

  private _renderDishForm(r: PairResult | null) {
    return html`
      <form class="ask" @submit=${(e: Event) => { e.preventDefault(); this._ask(); }}>
        <input class="dish" type="text" placeholder="Es. tagliata al rosmarino, spaghetti alle vongole…"
          .value=${this._dish} maxlength="300"
          @input=${(e: Event) => (this._dish = (e.target as HTMLInputElement).value)} />
        <button class="btn primary" type="submit" ?disabled=${this._busy || !this._dish.trim()}>
          ${this._busy ? "Ci penso…" : "Consiglia"}
        </button>
      </form>
      ${!r && !this._busy
        ? html`<div class="quick">
            ${QUICK.map((q) => html`<button class="chip" @click=${() => this._ask(q)}>${q}</button>`)}
          </div>`
        : nothing}
    `;
  }

  private _renderMenuForm() {
    const set = (i: number, v: string) => (this._courses = this._courses.map((c, j) => (j === i ? v : c)));
    const filled = this._courses.some((c) => c.trim());
    return html`
      <form class="menu" @submit=${(e: Event) => { e.preventDefault(); this._askMenu(); }}>
        ${this._courses.map((c, i) => html`<div class="course">
          <span class="num">${i + 1}</span>
          <input class="dish" type="text" maxlength="200" .value=${c}
            placeholder=${`${COURSE_HINTS[i] || "Portata"}${i === 0 ? ", es. crudi di mare" : i === 1 ? ", es. risotto ai funghi" : i === 2 ? ", es. brasato" : ", es. crostata"}`}
            @input=${(e: Event) => set(i, (e.target as HTMLInputElement).value)} />
          ${this._courses.length > 1
            ? html`<button type="button" class="close mini-x" title="Togli portata"
                @click=${() => (this._courses = this._courses.filter((_, j) => j !== i))}>✕</button>`
            : nothing}
        </div>`)}
        <div class="menu-actions">
          ${this._courses.length < 8
            ? html`<button type="button" class="btn small" @click=${() => (this._courses = [...this._courses, ""])}>＋ Portata</button>`
            : html`<span></span>`}
          <button class="btn primary" type="submit" ?disabled=${this._busy || !filled}>
            ${this._busy ? "Ci penso…" : "Componi i vini"}
          </button>
        </div>
        <div class="note">Lascia vuote le portate che non ci sono.</div>
      </form>
    `;
  }

  private _wineCard(p: Pick, opts: { best?: boolean; reason?: string; compact?: boolean } = {}) {
    const status: Record<string, string> = { closing: "Da bere presto", past: "Oltre la finestra", wait: "Ancora giovane" };
    const reason = opts.reason ?? p.reason;
    return html`<button class="pick ${opts.best ? "best" : ""} ${opts.compact ? "compact" : ""}" @click=${() => this._open(p)}>
      <span class="mini">${bottleSvg(p.type, p.status === "closing" || p.status === "past" ? (p.status as any) : null)}</span>
      <div class="text">
        <div class="wine">
          ${opts.best ? html`<span class="badge">Il migliore</span>` : nothing}
          ${wineTitle(p)}
          ${status[p.status] ? html`<span class="state ${p.status}">${status[p.status]}</span>` : nothing}
          ${p.opened ? html`<span class="state open">🍾 già aperta</span>` : nothing}
        </div>
        ${p.producer || p.rating
          ? html`<div class="note">${p.producer || ""}${p.rating
              ? html`<span class="your">${p.producer ? " · " : ""}il tuo voto ${renderStars(p.rating)} ${ratingText(p.rating)}</span>`
              : nothing}</div>`
          : nothing}
        ${reason ? html`<div class="reason">${reason}</div>` : nothing}
        ${serviceText(p).length ? html`<div class="svc-line">${serviceText(p).join(" · ")}</div>` : nothing}
        <div class="where">📍 ${p.locations[0]}${p.bottles > 1 ? html` · ${p.bottles} bottiglie` : nothing}</div>
      </div>
      <span class="go">›</span>
    </button>`;
  }

  private _renderMenuResult(r: PairResult) {
    const courses = r.courses || [];
    return html`
      <div class="eyebrow small">Il percorso</div>
      <div class="path">
        ${courses.map((c, i) => html`<div class="step">
          <div class="step-head"><span class="num" style="--c:${COURSE_COLORS[i % COURSE_COLORS.length]}">${i + 1}</span>${c.course.charAt(0).toUpperCase() + c.course.slice(1)}</div>
          ${c.wine
            ? this._wineCard(c.wine, { compact: true, reason: c.reason })
            : html`<div class="note nothing">Nessun vino della cantina è adatto a questa portata.</div>`}
        </div>`)}
      </div>
      ${courses.some((c) => c.wine)
        ? html`<button class="btn primary light" @click=${() => this._light(
            courses.map((c, i) => ({ label: c.course, color: COURSE_COLORS[i % COURSE_COLORS.length], bottle_ids: c.wine?.bottle_ids || [] }))
              .filter((g) => g.bottle_ids.length), "menu")}>💡 Illumina il percorso sullo scaffale</button>`
        : nothing}
      ${r.one
        ? html`<div class="eyebrow small">Oppure un vino per tutta la cena</div>${this._wineCard(r.one, { best: true })}
            <button class="btn small light" @click=${() => this._light(
              [{ label: "Tutta la cena", color: SEARCH_COLOR, bottle_ids: r.one!.bottle_ids }], "pair")}>💡 Illumina questo</button>`
        : nothing}
      ${r.advice ? html`<div class="advice ${r.source}">${r.source === "ai" ? "🍷 " : "ℹ️ "}${r.advice}</div>` : nothing}
    `;
  }

  private _renderResult(r: PairResult) {
    return html`
      ${!(r.picks || []).length
        ? html`<div class="note">Nessun vino della cantina è davvero adatto a «${this._asked}».</div>`
        : html`<div class="eyebrow small">Per «${this._asked}»</div>`}
      ${(r.picks || []).map((p, i) => this._wineCard(p, { best: i === 0 }))}
      ${(r.picks || []).length
        ? html`<button class="btn primary light" @click=${() => this._light(
            [{ label: this._asked, color: SEARCH_COLOR, bottle_ids: (r.picks || []).flatMap((p) => p.bottle_ids) }], "pair")}>
            💡 Illumina sullo scaffale</button>`
        : nothing}
      ${r.advice ? html`<div class="advice ${r.source}">${r.source === "ai" ? "🍷 " : "ℹ️ "}${r.advice}</div>` : nothing}
    `;
  }

  static styles = [
    sharedStyles,
    css`
      .ask {
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
      .modes {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
      }
      .menu {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .course {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .light {
        display: block;
        margin: 4px 0 12px auto;
      }
      .step-head .num {
        background: color-mix(in srgb, var(--c) 22%, transparent);
        color: var(--c);
        box-shadow: 0 0 10px -2px var(--c);
      }
      .num {
        flex: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-grid;
        place-items: center;
        font-size: 0.8em;
        font-weight: 600;
        background: rgba(227, 179, 65, 0.16);
        color: #e3b341;
      }
      .mini-x {
        flex: none;
        width: 30px;
        height: 30px;
        font-size: 0.8em;
      }
      .menu-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
      }
      .path {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }
      .step-head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        margin: 6px 0;
      }
      .pick.compact {
        margin-left: 32px;
        width: calc(100% - 32px);
        margin-bottom: 4px;
      }
      .nothing {
        margin-left: 32px;
      }
      .your {
        white-space: nowrap;
      }
      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
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
      .eyebrow.small {
        margin: 18px 0 8px;
      }
      .pick {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.03);
        color: inherit;
        font: inherit;
        cursor: pointer;
      }
      .pick:hover {
        background: rgba(255, 255, 255, 0.06);
      }
      .pick.best {
        border-color: rgba(201, 162, 39, 0.55);
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(255, 255, 255, 0.02));
      }
      .mini {
        width: 22px;
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
      .wine {
        font-weight: 600;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .badge,
      .state {
        font-size: 0.72em;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        letter-spacing: 0.02em;
      }
      .badge {
        background: rgba(201, 162, 39, 0.22);
        color: #e8c766;
      }
      .state {
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
      }
      .state.open {
        background: rgba(129, 199, 132, 0.2);
        color: #a5d6a7;
      }
      .svc-line {
        margin-top: 4px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      .state.closing {
        background: rgba(201, 162, 39, 0.18);
        color: #e8c766;
      }
      .state.past {
        background: rgba(229, 57, 53, 0.18);
        color: #ef7a77;
      }
      .reason {
        margin-top: 6px;
        line-height: 1.4;
      }
      .where {
        margin-top: 6px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      .go {
        font-size: 1.6em;
        color: var(--secondary-text-color);
      }
      .advice {
        margin-top: 6px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        font-size: 0.9em;
        line-height: 1.4;
      }
      .advice.local {
        color: var(--secondary-text-color);
      }
    `,
  ];
}
