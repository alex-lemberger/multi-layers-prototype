// UWWB Multi-Layers POC — Shared components (CaTa pattern)
const { useState, useEffect, useRef, useMemo } = React;

// ---- Format helpers ----
function fmtEUR(n) {
  if (n == null) return "–";
  return "€ " + Number(n).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmtShortRange(lo, hi) {
  const fmt = (n) => {
    if (n >= 1e6) return (n / 1e6) + "M";
    if (n >= 1e3) return Math.round(n / 1e3) + "K";
    return String(n);
  };
  return "€ " + fmt(lo) + " – € " + fmt(hi);
}

// ---- Euro Input (format-on-blur, European grouping — same convention as CaTa Marine's NumberInput) ----
function parseEuroAmount(str) {
  if (!str) return "";
  let cleaned = String(str).replace(/[^\d.,]/g, ""); // keep digits, dots, commas only
  if (cleaned === "") return "";
  cleaned = cleaned.split(".").join("");   // "." = thousands separator -> drop
  cleaned = cleaned.replace(",", ".");     // "," = decimal separator -> convert to JS decimal point
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "";
  return String(Math.round(num * 100) / 100); // clean number string, up to 2 decimals, period-decimal (Number()-safe)
}
function formatEuroAmount(value) {
  if (value === "" || value == null) return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  return num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // e.g. 1.234,56
}
function EuroInput({ value, onChange, placeholder, disabled }) {
  const [display, setDisplay] = useState(formatEuroAmount(value));
  useEffect(() => { setDisplay(formatEuroAmount(value)); }, [value]);

  const handleBlur = () => {
    const parsed = parseEuroAmount(display);
    onChange?.(parsed);
    setDisplay(formatEuroAmount(parsed));
  };

  return (
    <div className="cst-euro-input">
      <input
        className="cst-panel-input cst-euro-input__el"
        type="text"
        inputMode="decimal"
        value={display}
        onChange={e => setDisplay(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
      />
      <span className="cst-euro-input__suffix">€</span>
    </div>
  );
}

// ---- DisplayCard components (from CaTa Marine) ----
function DisplayCardGrid({ children, cols = 2 }) {
  return <div className="dcard-grid" style={{ "--dcols": cols }}>{children}</div>;
}

function DisplayCard({ title, onEdit, badge, badgeType, children, span, grid = true }) {
  return (
    <div className="dcard" style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <header className="dcard__head">
        <h3 className="dcard__title">{title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {badge && <span className={`dcard__badge dcard__badge--${badgeType || "green"}`}>{badge}</span>}
          {onEdit && (
            <button className="dcard__edit" onClick={onEdit} title="Edit">
              <i className="fa-solid fa-pencil" style={{ fontSize: 14 }} />
            </button>
          )}
        </div>
      </header>
      <div className={`dcard__body ${grid ? "dcard__body--grid" : ""}`}>{children}</div>
    </div>
  );
}

function DisplayField({ label, value, mono, span = 1, empty = "—" }) {
  const isEmpty = value == null || value === "" || value === false;
  return (
    <div className="dfield" style={{ gridColumn: `span ${span}` }}>
      <div className="dfield__label">{label}</div>
      <div className={`dfield__value ${mono ? "dfield__value--mono" : ""} ${isEmpty ? "dfield__value--empty" : ""}`}>
        {isEmpty ? empty : value}
      </div>
    </div>
  );
}
