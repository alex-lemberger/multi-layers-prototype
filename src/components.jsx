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
