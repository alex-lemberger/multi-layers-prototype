// UWWB Multi-Layers POC — Feature screen stubs (CaTa DisplayCard + grid-tbl pattern)
// Each "step" represents a feature screen in the wizard.

const { useState: useS, useEffect: useE, Fragment: F, useRef: useR } = React;

// ---- Layer badge (static — just shows current layer context) ----
function LayerBadge({ layer }) {
  return (
    <span className="layer-badge">{layer.name}</span>
  );
}

// ---- General Data screen (layer-scoped — parallel worlds) ----
function GeneralDataScreen({ layer, allLayers }) {
  return (
    <div>
      <div className="main__title">General Data <LayerBadge layer={layer} /></div>

      <DisplayCardGrid cols={2}>
        <DisplayCard title="HDI Responsibility">
          <DisplayField label="Producing Office" value="Australia" />
          <DisplayField label="Regional Office" value="Sydney" />
          <DisplayField label="HDI Contact" value="John Smith" />
          <DisplayField label="Lead Underwriter" value="Jane Doe" />
        </DisplayCard>

        <DisplayCard title="Contract / Offer Details">
          <DisplayField label="Option Name" value="Option 1 — Base Coverage" />
          <DisplayField label="Layer" value={layer.name} />
          <DisplayField label="Type of Business" value="New Business" />
          <DisplayField label="Type of Contract" value="Annual" />
          <DisplayField label="Inception Date" value="01 Jul 2026" mono />
          <DisplayField label="Expiration Date" value="30 Jun 2027" mono />
        </DisplayCard>
      </DisplayCardGrid>

      <DisplayCardGrid cols={2}>
        <DisplayCard title="Layer Configuration">
          <DisplayField label="Limit" value={fmtEUR(layer.limit)} mono />
          <DisplayField label="Attachment Point" value={fmtEUR(layer.attachmentPoint)} mono />
          <DisplayField label="Deductible" value={fmtEUR(layer.deductible)} mono />
          <DisplayField label="Range" value={fmtShortRange(layer.rangeFrom, layer.rangeTo)} mono />
        </DisplayCard>

        <DisplayCard title="Participation" badge={layer.participating ? "Participating" : "Not participating"} badgeType={layer.participating ? "green" : "pending"}>
          <DisplayField label="Participation" value={layer.participating ? "Participating" : "Non-participating"} />
          <DisplayField label="Premium" value={layer.premium ? fmtEUR(layer.premium) : null} mono />
          <DisplayField label="Rate" value={layer.rate} mono />
          <DisplayField label="Layers in Program" value={String(allLayers.length)} />
        </DisplayCard>
      </DisplayCardGrid>
    </div>
  );
}

// ---- Program Coverage screen (Cyber design) ----
const CYBER_COVERAGES = [
  { name: "Third Party Liability", selected: true, sublimit: "*", retroactive: "2 years" },
  { name: "Privacy (& network security) liability", selected: true, sublimit: "*" },
  { name: "Network security liability", selected: true },
  { name: "Media liability", selected: true, sublimit: "*" },
  { name: "Printed media liability extension", selected: false, sub: true },
  { name: "Claims arising from the transfer of data", selected: false },
  { name: "Regulatory proceedings", selected: false },
  { name: "Internal investigations", selected: false },
  { name: "Regulatory fines", selected: false },
  { name: "Additional sublimit for defence costs", selected: false },
  { name: "Data processing liability (e.g. cloud)", selected: false },
  { name: "Payment card industry penalties", selected: false },
  { name: "Fulfilment of Contract, Consequential Loss", selected: false },
  { name: "Cyber directors & officers", selected: false },
  { name: "Technology E&O", selected: false },
  { name: "Own losses", selected: true },
  { name: "Incident Response Costs", selected: true, sublimit: "*", waiting: "" },
  { name: "Provisional and advisory services", selected: true, sublimit: "*", warning: true, waiting: "72 hours" },
  { name: "Provisional and advisory services out of network-service", selected: false, sub: true },
  { name: "Forensic Investigations", selected: true },
  { name: "Notifications of the data protection authorities and affected parties, appointment of external service providers", selected: true },
  { name: "Public relations in the event of a crisis or for reputation protection", selected: true, waiting: "6 months" },
  { name: "Identity and credit monitoring services", selected: true, waiting: "12 months" },
  { name: "Crisis consulting in the events of cyber extortion", selected: true },
];

function ProgramCoverageScreen({ layer, allLayers, onLayerChange, isLayered }) {
  const [filter, setFilter] = useS("");
  const [showAll, setShowAll] = useS(true);

  const filtered = CYBER_COVERAGES.filter(c => {
    if (!showAll && !c.selected) return false;
    if (filter && !c.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="main__title">Program Coverage <LayerBadge layer={layer} /></div>

      {/* Contract Limits and Deductibles */}
      <div className="pc-section">
        <h2 className="pc-section__title">Contract Limits and Deductibles</h2>
        <div className="pc-limits-row">
          <table className="grid-tbl grid-tbl--compact">
            <thead>
              <tr>
                <th>Program Structure</th>
                <th>Limit (agg)</th>
                <th>XS (agg)</th>
                <th>Deductible (eec)</th>
                <th style={{width: 40}}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="t-strong">Cyber Baseline</td>
                <td><span className="warning-dot"><i className="fa-solid fa-circle-exclamation" /></span></td>
                <td>–</td>
                <td><span className="warning-dot"><i className="fa-solid fa-circle-exclamation" /></span></td>
                <td><button className="row-edit-btn"><i className="fa-solid fa-pencil" /></button></td>
              </tr>
            </tbody>
          </table>
          <div className="pc-side-card">
            <div className="pc-side-card__header">
              <span className="pc-side-card__title">Sublimit Option</span>
              <button className="row-edit-btn"><i className="fa-solid fa-pencil" /></button>
            </div>
            <div className="pc-side-card__body">
              <div className="pc-side-card__field">
                <span className="pc-side-card__label">Sublimit Option</span>
                <span className="pc-side-card__value">Step-Down</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Selection */}
      <div className="pc-section">
        <h2 className="pc-section__title">Coverage Selection</h2>
        <div className="pc-filter-row">
          <div className="pc-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Filter Coverages" value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
          <div className="pc-radio-group">
            <label className={`pc-radio${!showAll ? " pc-radio--active" : ""}`}>
              <input type="radio" name="covFilter" checked={!showAll} onChange={() => setShowAll(false)} />
              Show selected Coverages only
            </label>
            <label className={`pc-radio${showAll ? " pc-radio--active" : ""}`}>
              <input type="radio" name="covFilter" checked={showAll} onChange={() => setShowAll(true)} />
              Show all available Coverages
            </label>
          </div>
        </div>

        <table className="grid-tbl grid-tbl--cov">
          <thead>
            <tr>
              <th style={{width: 36}}></th>
              <th style={{width: 36}}></th>
              <th style={{width: "36%"}}>Coverage</th>
              <th>Sublimit (agg)</th>
              <th>Shared Sublimit (agg)</th>
              <th>Deductible (absolute)</th>
              <th>Retroactive Cover</th>
              <th>Indemnity Period</th>
              <th>Waiting Period</th>
              <th style={{width: 120}}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={i} className={c.sub ? "cov-row--sub" : (!c.selected ? "cov-row--unselected" : "")}>
                <td>{c.selected && !c.sub ? <i className="fa-solid fa-chevron-up cov-chevron" /> : null}</td>
                <td>
                  {c.selected
                    ? <span className="cov-check cov-check--on"><i className="fa-solid fa-check" /></span>
                    : <span className="cov-check cov-check--off" />
                  }
                </td>
                <td className={c.selected ? "t-strong" : ""}>{c.name}</td>
                <td className="t-muted">{c.sublimit || ""}</td>
                <td className="t-muted"></td>
                <td className="t-muted">{c.warning ? <span className="warning-dot"><i className="fa-solid fa-circle-exclamation" /></span> : ""}</td>
                <td className="t-muted">{c.retroactive || ""}</td>
                <td className="t-muted"></td>
                <td className="t-muted">{c.waiting || ""}</td>
                <td>{c.selected ? <button className="row-edit-btn"><i className="fa-solid fa-pencil" /></button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Risk Profile screen ----
function RiskProfileScreen({ layer, allLayers, onLayerChange, isLayered }) {
  return (
    <div>
      <div className="main__title">Risk Profile <LayerBadge layer={layer} /></div>

      <DisplayCardGrid cols={2}>
        <DisplayCard title="Risk Assessment" badge="Pending" badgeType="pending">
          <DisplayField label="Industry Sector" value="Technology & Services" />
          <DisplayField label="Risk Country" value="Australia" />
          <DisplayField label="Revenue (USD)" value="$ 45,000,000" mono />
          <DisplayField label="Employees" value="850" />
        </DisplayCard>

        <DisplayCard title="Risk Score">
          <DisplayField label="Overall Score" value={null} />
          <DisplayField label="Maturity Level" value={null} />
          <DisplayField label="Last Assessment" value={null} />
          <DisplayField label="Assessor" value={null} />
        </DisplayCard>
      </DisplayCardGrid>
    </div>
  );
}

// ---- Technical Premium screen ----
function TechnicalPremiumScreen({ layer, allLayers, onLayerChange, isLayered }) {
  return (
    <div>
      <div className="main__title">Technical Premium <LayerBadge layer={layer} /></div>

      <div className="summary-strip">
        <div className="summary-card">
          <div className="summary-card__label">Technical Premium</div>
          <div className="summary-card__value">{layer.premium ? fmtEUR(layer.premium) : "–"}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Rate</div>
          <div className="summary-card__value">{layer.rate || "–"}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Limit</div>
          <div className="summary-card__value">{fmtEUR(layer.limit)}</div>
        </div>
      </div>

      <DisplayCard title="Premium Breakdown" grid={false}>
        <p style={{color: "var(--fg-muted)", fontSize: 13}}>
          Premium calculation details for this layer would appear here.
        </p>
      </DisplayCard>
    </div>
  );
}

// ---- Summary screen ----
function SummaryScreen({ layer, allLayers }) {
  const totalPremium = allLayers.reduce((s, l) => s + (l.premium || 0), 0);
  const totalLimit = allLayers.reduce((s, l) => s + (l.limit || 0), 0);
  const participating = allLayers.filter(l => l.participating).length;

  return (
    <div>
      <div className="main__title">Summary <span className="layer-badge">All Layers</span></div>

      <div className="summary-strip">
        <div className="summary-card">
          <div className="summary-card__label">Total Program Limit</div>
          <div className="summary-card__value">{fmtEUR(totalLimit)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Total Layers</div>
          <div className="summary-card__value">{allLayers.length}</div>
          <div className="summary-card__sub">{participating} participating</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Total Premium</div>
          <div className="summary-card__value">{fmtEUR(totalPremium)}</div>
        </div>
      </div>

      <DisplayCard title="Layer Program" grid={false}>
        <table className="grid-tbl">
          <thead>
            <tr>
              <th style={{width: "22%"}}>Layer</th>
              <th style={{width: "16%"}}>Range</th>
              <th style={{width: "14%"}}>Limit</th>
              <th style={{width: "14%"}}>Attachment (XS)</th>
              <th style={{width: "12%"}}>Deductible</th>
              <th style={{width: "12%"}}>Premium</th>
              <th style={{width: "10%"}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {allLayers.map((l, i) => (
              <tr key={i}>
                <td className="t-strong">{l.name}</td>
                <td className="t-mono t-muted">{fmtShortRange(l.rangeFrom, l.rangeTo)}</td>
                <td className="t-mono">{fmtEUR(l.limit)}</td>
                <td className="t-mono">{fmtEUR(l.attachmentPoint)}</td>
                <td className="t-mono">{fmtEUR(l.deductible)}</td>
                <td className="t-mono">{l.premium ? fmtEUR(l.premium) : <span className="text-faint">Pending</span>}</td>
                <td>
                  <span className={`status-badge ${l.participating ? 'status-badge--participating' : 'status-badge--not-participating'}`}>
                    {l.participating ? "Participating" : "Not part."}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="is-bold">
              <td>Total Program</td>
              <td className="t-mono">{fmtShortRange(0, totalLimit)}</td>
              <td className="t-mono">{fmtEUR(totalLimit)}</td>
              <td></td>
              <td></td>
              <td className="t-mono">{fmtEUR(totalPremium)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </DisplayCard>
    </div>
  );
}

// ---- Layers Settings screen (Variant A — dedicated CRUD, no screen toggles) ----

function LayersSettingsScreen({ layers, activeLayerIdx, onLayerChange, onAdd, onCopy, onDelete, onEdit }) {
  const [filterParticipating, setFilterParticipating] = useS(false); // false = show all
  const displayLayers = filterParticipating ? layers.filter(l => l.participating) : layers;

  return (
    <div>
      <div className="main__title">Layers Settings</div>
      <p className="main__subtitle" style={{marginTop: -12, marginBottom: 24}}>
        Configure the layer structure for this option. Each layer is an independent context — switching layers switches all screens.
      </p>

      {/* Layer Management Table */}
      <div className="ls-section">
        <div className="ls-section__header">
          <h2 className="ls-section__title">Layer Structure</h2>
          <div className="participation-filter">
            <button className={`pf-btn${!filterParticipating ? " pf-btn--active" : ""}`} onClick={() => setFilterParticipating(false)}>
              All Layers
            </button>
            <button className={`pf-btn${filterParticipating ? " pf-btn--active" : ""}`} onClick={() => setFilterParticipating(true)}>
              Participating only
            </button>
          </div>
        </div>

        <table className="grid-tbl">
          <thead>
            <tr>
              <th style={{width: "18%"}}>Layer Name</th>
              <th style={{width: "9%"}}>Type</th>
              <th style={{width: "13%"}}>Product</th>
              <th style={{width: "13%"}}>Range</th>
              <th style={{width: "12%"}}>Limit</th>
              <th style={{width: "12%"}}>Attachment Point</th>
              <th style={{width: "12%"}}>Participation</th>
              <th style={{width: "11%"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayLayers.map((layer) => {
              const idx = layers.indexOf(layer);
              return (
              <tr key={layer.id} className={idx === activeLayerIdx ? "ls-row--active" : ""}>
                <td className="t-strong">{layer.name}</td>
                <td><span className={`ls-type-badge ls-type-badge--${layer.type.toLowerCase()}`}>{layer.type}</span></td>
                <td>{layer.product || "—"}</td>
                <td className="t-mono t-muted">{fmtShortRange(layer.rangeFrom, layer.rangeTo)}</td>
                <td className="t-mono">{fmtEUR(layer.limit)}</td>
                <td className="t-mono">{fmtEUR(layer.attachmentPoint)}</td>
                <td>
                  <span className={`status-badge ${layer.participating ? 'status-badge--participating' : 'status-badge--not-participating'}`}>
                    {layer.participating ? "Participating" : "Non-participating"}
                  </span>
                </td>
                <td>
                  <div className="ls-actions">
                    <button className="ls-action-btn" title="Edit layer" onClick={() => onEdit(idx)}>
                      <i className="fa-solid fa-pencil" />
                    </button>
                    <button className="ls-action-btn" title="Copy layer" onClick={() => onCopy(idx)}>
                      <i className="fa-regular fa-copy" />
                    </button>
                    {layers.length > 1 && (
                      <button className="ls-action-btn ls-action-btn--delete" title="Delete layer" onClick={() => onDelete(idx)}>
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        <button className="btn-add-row" onClick={onAdd}>
          <i className="fa-solid fa-plus" /> Add Layer
        </button>
      </div>
    </div>
  );
}

// ---- Layers Workflow screen (Variant B — after Program Coverage) ----
function LayersWorkflowScreen({ layers, activeLayerIdx, onLayerChange, onAdd, onCopy, onDelete, onEdit }) {
  const [filterParticipating, setFilterParticipating] = useS(false);
  const displayLayers = filterParticipating ? layers.filter(l => l.participating) : layers;

  return (
    <div>
      <div className="main__title">Layers</div>
      <p className="main__subtitle" style={{marginTop: -12, marginBottom: 24}}>
        Define the layer structure for this option. Each layer inherits the coverages selected in Program Coverage.
      </p>

      {/* Layer Management Table */}
      <div className="ls-section">
        <div className="ls-section__header">
          <h2 className="ls-section__title">Layer Structure</h2>
          <div className="participation-filter">
            <button className={`pf-btn${!filterParticipating ? " pf-btn--active" : ""}`} onClick={() => setFilterParticipating(false)}>
              All Layers
            </button>
            <button className={`pf-btn${filterParticipating ? " pf-btn--active" : ""}`} onClick={() => setFilterParticipating(true)}>
              Participating only
            </button>
          </div>
        </div>

        <table className="grid-tbl">
          <thead>
            <tr>
              <th style={{width: "16%"}}>Layer Name</th>
              <th style={{width: "9%"}}>Type</th>
              <th style={{width: "12%"}}>Product</th>
              <th style={{width: "12%"}}>Range</th>
              <th style={{width: "11%"}}>Limit</th>
              <th style={{width: "12%"}}>Attachment Point</th>
              <th style={{width: "10%"}}>Deductible</th>
              <th style={{width: "10%"}}>Participation</th>
              <th style={{width: "8%"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayLayers.map((layer) => {
              const idx = layers.indexOf(layer);
              return (
              <tr key={layer.id} className={idx === activeLayerIdx ? "ls-row--active" : ""}>
                <td className="t-strong">{layer.name}</td>
                <td><span className={`ls-type-badge ls-type-badge--${layer.type.toLowerCase()}`}>{layer.type}</span></td>
                <td>{layer.product || "—"}</td>
                <td className="t-mono t-muted">{fmtShortRange(layer.rangeFrom, layer.rangeTo)}</td>
                <td className="t-mono">{fmtEUR(layer.limit)}</td>
                <td className="t-mono">{fmtEUR(layer.attachmentPoint)}</td>
                <td className="t-mono">{fmtEUR(layer.deductible)}</td>
                <td>
                  <span className={`status-badge ${layer.participating ? 'status-badge--participating' : 'status-badge--not-participating'}`}>
                    {layer.participating ? "Participating" : "Non-participating"}
                  </span>
                </td>
                <td>
                  <div className="ls-actions">
                    <button className="ls-action-btn" title="Edit layer" onClick={() => onEdit(idx)}>
                      <i className="fa-solid fa-pencil" />
                    </button>
                    <button className="ls-action-btn" title="Copy layer" onClick={() => onCopy(idx)}>
                      <i className="fa-regular fa-copy" />
                    </button>
                    {layers.length > 1 && (
                      <button className="ls-action-btn ls-action-btn--delete" title="Delete layer" onClick={() => onDelete(idx)}>
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        <button className="btn-add-row" onClick={onAdd}>
          <i className="fa-solid fa-plus" /> Add Layer
        </button>
      </div>

      {/* Inherited coverages info */}
      <div className="ls-section">
        <div className="ls-section__header">
          <h2 className="ls-section__title">Inherited Coverages</h2>
        </div>
        <p style={{fontSize: 13, color: "var(--fg-muted)", marginBottom: 12}}>
          Each layer inherits the following coverages from Program Coverage. Limits and deductibles can be configured per layer.
        </p>
        <div className="ls-cov-chips">
          <span className="ls-cov-chip">Third Party Liability</span>
          <span className="ls-cov-chip">Media Liability</span>
          <span className="ls-cov-chip">Privacy & Network Security</span>
          <span className="ls-cov-chip">Digital Data & Systems Recovery</span>
          <span className="ls-cov-chip">Incident Response Costs</span>
        </div>
      </div>
    </div>
  );
}

// ---- Premium Overview screen (Variant B — after Technical Premium) ----
function PremiumOverviewScreen({ layers, activeLayerIdx, onLayerChange }) {
  const [filterIdx, setFilterIdx] = useS(-1); // -1 = all layers
  const totalPremium = layers.reduce((s, l) => s + (l.premium || 0), 0);
  const totalLimit = layers.reduce((s, l) => s + (l.limit || 0), 0);
  const displayLayers = filterIdx === -1 ? layers : [layers[filterIdx]];

  return (
    <div>
      <div className="main__title">Premium Overview</div>

      <div className="summary-strip">
        <div className="summary-card">
          <div className="summary-card__label">Total Program Premium</div>
          <div className="summary-card__value">{fmtEUR(totalPremium)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Total Program Limit</div>
          <div className="summary-card__value">{fmtEUR(totalLimit)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card__label">Layers</div>
          <div className="summary-card__value">{layers.length}</div>
        </div>
      </div>

      <DisplayCard title="Premium per Layer" grid={false}>
        <div className="po-filter-row">
          <select className="form-input form-select po-filter-select" value={filterIdx} onChange={e => setFilterIdx(Number(e.target.value))}>
            <option value={-1}>All Layers ({layers.length})</option>
            {layers.map((l, i) => (
              <option key={i} value={i}>{l.name}</option>
            ))}
          </select>
        </div>
        <table className="grid-tbl">
          <thead>
            <tr>
              <th style={{width: "22%"}}>Layer</th>
              <th style={{width: "14%"}}>Type</th>
              <th style={{width: "16%"}}>Limit</th>
              <th style={{width: "16%"}}>Attachment</th>
              <th style={{width: "16%"}}>Premium</th>
              <th style={{width: "16%"}}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {displayLayers.map((l, i) => {
              const realIdx = filterIdx === -1 ? i : filterIdx;
              return (
                <tr key={realIdx} className={realIdx === activeLayerIdx ? "ls-row--active" : ""} style={{cursor: "pointer"}} onClick={() => onLayerChange(realIdx)}>
                  <td className="t-strong">{l.name}</td>
                  <td><span className={`ls-type-badge ls-type-badge--${l.type.toLowerCase()}`}>{l.type}</span></td>
                  <td className="t-mono">{fmtEUR(l.limit)}</td>
                  <td className="t-mono">{fmtEUR(l.attachmentPoint)}</td>
                  <td className="t-mono">{l.premium ? fmtEUR(l.premium) : <span className="text-faint">Pending</span>}</td>
                  <td className="t-mono">{l.rate || <span className="text-faint">–</span>}</td>
                </tr>
              );
            })}
          </tbody>
          {filterIdx === -1 && (
            <tfoot>
              <tr className="is-bold">
                <td>Total</td>
                <td></td>
                <td className="t-mono">{fmtEUR(totalLimit)}</td>
                <td></td>
                <td className="t-mono">{fmtEUR(totalPremium)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </DisplayCard>
    </div>
  );
}

// ============================================================
// Calculation / Adjustment Screens (layer-scoped)
// ============================================================

// Per-layer premium calculation data
const CALC_DATA = {
  0: { // Primary Layer
    rows: [
      { program: "General Liability Baseline", elBefore: 10435.4, techAdj: 10435.4, elPremium: 10435.4, volatility: 729.71, claimCosts: 2.97, adminCosts: 9.81, tpBefore: 12802.03, techPremium: 14224.48 },
      { program: "Public Liability", elBefore: 435.4, techAdj: null, elPremium: 435.4, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 534.15, techPremium: 593.50 },
      { program: "Employers Liability", elBefore: 10000, techAdj: 10000, elPremium: 10000, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 12267.89, techPremium: 13630.99 },
    ],
    tariff: [
      { program: "General Liability Baseline", techPremium: 14224.48, loading: null, offeredPremium: 14224.48, walkAway: 10830.03, offeredHDI: 14224.48 },
      { program: "Public Liability", techPremium: 593.50, loading: null, offeredPremium: 593.50, walkAway: null, offeredHDI: 593.50 },
      { program: "Employers Liability", techPremium: 13630.99, loading: null, offeredPremium: 13630.99, walkAway: null, offeredHDI: 13630.99 },
    ],
    rates: [
      { program: "General Liability Baseline", rateType: null, offeredPremium: 14224.48, usa: null, row: null, combined: 14224.48 },
      { program: "Employers Liability", rateType: "Flat Premium", offeredPremium: 13630.99, usa: null, row: null, combined: 13630.99 },
      { program: "Public Liability", rateType: "Flat Premium", offeredPremium: 593.50, usa: null, row: null, combined: 593.50 },
    ],
    calcStatus: { success: true, services: ["Globility-Service: 29/06/2026 - 16:22h", "ELC-Service: 29/06/2026 - 16:22h"] },
  },
  1: { // Excess Layer 1
    rows: [
      { program: "General Liability Baseline", elBefore: 6250.0, techAdj: 6250.0, elPremium: 6250.0, volatility: 437.83, claimCosts: 2.97, adminCosts: 9.81, tpBefore: 7681.22, techPremium: 8534.69 },
      { program: "Public Liability", elBefore: 261.2, techAdj: null, elPremium: 261.2, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 320.49, techPremium: 356.10 },
      { program: "Employers Liability", elBefore: 6000, techAdj: 6000, elPremium: 6000, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 7360.73, techPremium: 8178.59 },
    ],
    tariff: [
      { program: "General Liability Baseline", techPremium: 8534.69, loading: null, offeredPremium: 8534.69, walkAway: 6498.02, offeredHDI: 8534.69 },
      { program: "Public Liability", techPremium: 356.10, loading: null, offeredPremium: 356.10, walkAway: null, offeredHDI: 356.10 },
      { program: "Employers Liability", techPremium: 8178.59, loading: null, offeredPremium: 8178.59, walkAway: null, offeredHDI: 8178.59 },
    ],
    rates: [
      { program: "General Liability Baseline", rateType: null, offeredPremium: 8534.69, usa: null, row: null, combined: 8534.69 },
      { program: "Employers Liability", rateType: "Flat Premium", offeredPremium: 8178.59, usa: null, row: null, combined: 8178.59 },
      { program: "Public Liability", rateType: "Flat Premium", offeredPremium: 356.10, usa: null, row: null, combined: 356.10 },
    ],
    calcStatus: { success: true, services: ["Globility-Service: 29/06/2026 - 16:20h", "ELC-Service: 29/06/2026 - 16:20h"] },
  },
  2: { // Excess Layer 2
    rows: [
      { program: "General Liability Baseline", elBefore: 3125.0, techAdj: 3125.0, elPremium: 3125.0, volatility: 218.91, claimCosts: 2.97, adminCosts: 9.81, tpBefore: 3840.61, techPremium: 4267.35 },
      { program: "Public Liability", elBefore: 130.6, techAdj: null, elPremium: 130.6, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 160.25, techPremium: 178.05 },
      { program: "Employers Liability", elBefore: 3000, techAdj: 3000, elPremium: 3000, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 3680.37, techPremium: 4089.30 },
    ],
    tariff: [
      { program: "General Liability Baseline", techPremium: 4267.35, loading: null, offeredPremium: 4267.35, walkAway: 3249.01, offeredHDI: 4267.35 },
      { program: "Public Liability", techPremium: 178.05, loading: null, offeredPremium: 178.05, walkAway: null, offeredHDI: 178.05 },
      { program: "Employers Liability", techPremium: 4089.30, loading: null, offeredPremium: 4089.30, walkAway: null, offeredHDI: 4089.30 },
    ],
    rates: [
      { program: "General Liability Baseline", rateType: null, offeredPremium: 4267.35, usa: null, row: null, combined: 4267.35 },
      { program: "Employers Liability", rateType: "Flat Premium", offeredPremium: 4089.30, usa: null, row: null, combined: 4089.30 },
      { program: "Public Liability", rateType: "Flat Premium", offeredPremium: 178.05, usa: null, row: null, combined: 178.05 },
    ],
    calcStatus: { success: true, services: ["Globility-Service: 29/06/2026 - 16:18h", "ELC-Service: 29/06/2026 - 16:18h"] },
  },
};

// Fallback for layers beyond the 3 hardcoded ones
function getCalcData(layerIdx) {
  if (CALC_DATA[layerIdx]) return CALC_DATA[layerIdx];
  // Generate plausible data for additional layers
  const factor = 0.5 / (layerIdx + 1);
  const base = CALC_DATA[0];
  return {
    rows: base.rows.map(r => ({
      ...r,
      elBefore: r.elBefore ? +(r.elBefore * factor).toFixed(2) : null,
      techAdj: r.techAdj ? +(r.techAdj * factor).toFixed(2) : null,
      elPremium: r.elPremium ? +(r.elPremium * factor).toFixed(2) : null,
      volatility: r.volatility ? +(r.volatility * factor).toFixed(2) : null,
      tpBefore: r.tpBefore ? +(r.tpBefore * factor).toFixed(2) : null,
      techPremium: r.techPremium ? +(r.techPremium * factor).toFixed(2) : null,
    })),
    tariff: base.tariff.map(r => ({
      ...r,
      techPremium: r.techPremium ? +(r.techPremium * factor).toFixed(2) : null,
      offeredPremium: r.offeredPremium ? +(r.offeredPremium * factor).toFixed(2) : null,
      walkAway: r.walkAway ? +(r.walkAway * factor).toFixed(2) : null,
      offeredHDI: r.offeredHDI ? +(r.offeredHDI * factor).toFixed(2) : null,
    })),
    rates: base.rates.map(r => ({
      ...r,
      offeredPremium: r.offeredPremium ? +(r.offeredPremium * factor).toFixed(2) : null,
      combined: r.combined ? +(r.combined * factor).toFixed(2) : null,
    })),
    calcStatus: { success: true, services: ["Globility-Service: 29/06/2026 - 16:15h"] },
  };
}

function fmtCalcNum(n) {
  if (n == null) return "";
  // Match existing app: English locale, comma thousands, period decimal, up to 2 decimals
  const val = Number(n);
  const formatted = val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return formatted;
}

// ---- Premium Result Screen ----
function PremiumResultScreen({ layers, activeLayerIdx, onLayerChange }) {
  const activeLayer = layers[activeLayerIdx];
  const data = getCalcData(activeLayerIdx);
  const [calculating, setCalculating] = useS(false);

  const totals = data.rows.reduce((acc, r) => ({
    elBefore: acc.elBefore + (r.elBefore || 0),
    techAdj: r.techAdj != null ? (acc.techAdj || 0) + r.techAdj : acc.techAdj,
    elPremium: acc.elPremium + (r.elPremium || 0),
    volatility: r.volatility != null ? (acc.volatility || 0) + r.volatility : acc.volatility,
    claimCosts: r.claimCosts != null ? r.claimCosts : acc.claimCosts,
    adminCosts: r.adminCosts != null ? r.adminCosts : acc.adminCosts,
    tpBefore: acc.tpBefore + (r.tpBefore || 0),
    techPremium: acc.techPremium + (r.techPremium || 0),
  }), { elBefore: 0, techAdj: null, elPremium: 0, volatility: null, claimCosts: null, adminCosts: null, tpBefore: 0, techPremium: 0 });

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => setCalculating(false), 1500);
  };

  return (
    <div>
      <div className="main__title">Premium Result <LayerBadge layer={activeLayer} /></div>

      <div className="calc-table-wrap">
        <table className="grid-tbl grid-tbl--calc">
          <thead>
            <tr>
              <th style={{width: "16%"}}>Program Structure</th>
              <th>Expected Loss<br/>Before Technical<br/>Adjustment</th>
              <th>Technical Adjustment <span className="calc-info-icon"><i className="fa-solid fa-circle-info" /></span></th>
              <th>Expected Loss<br/>Premium</th>
              <th>Volatility<br/>Loading</th>
              <th>Claim Costs<br/>in %</th>
              <th>Admin Cost<br/>in %</th>
              <th>TP Before<br/>Brokerage</th>
              <th>Technical<br/>Premium</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i}>
                <td className="t-strong">
                  {i === 0 && <i className="fa-solid fa-chevron-up cov-chevron" style={{marginRight: 8}} />}
                  {r.program}
                </td>
                <td className="t-mono">{fmtCalcNum(r.elBefore)}</td>
                <td className="t-mono">{fmtCalcNum(r.techAdj)}</td>
                <td className="t-mono">{fmtCalcNum(r.elPremium)}</td>
                <td className="t-mono">{fmtCalcNum(r.volatility)}</td>
                <td className="t-mono">{r.claimCosts != null ? r.claimCosts : ""}</td>
                <td className="t-mono">{r.adminCosts != null ? r.adminCosts : ""}</td>
                <td className="t-mono">{fmtCalcNum(r.tpBefore)}</td>
                <td className="t-mono">{fmtCalcNum(r.techPremium)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="is-bold">
              <td><i className="fa-solid fa-calculator" style={{marginRight: 8, fontSize: 12}} /> Total</td>
              <td className="t-mono">{fmtCalcNum(totals.elBefore)}</td>
              <td className="t-mono"></td>
              <td className="t-mono">{fmtCalcNum(totals.elPremium)}</td>
              <td className="t-mono">{fmtCalcNum(totals.volatility)}</td>
              <td className="t-mono">{totals.claimCosts || ""}</td>
              <td className="t-mono">{totals.adminCosts || ""}</td>
              <td className="t-mono">{fmtCalcNum(totals.tpBefore)}</td>
              <td className="t-mono">{fmtCalcNum(totals.techPremium)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="calc-footer">
        <button className="btn btn--outline calc-btn" onClick={handleCalculate} disabled={calculating}>
          {calculating ? <F><i className="fa-solid fa-spinner fa-spin" style={{marginRight: 8}} /> Calculating...</F> : "Calculate"}
        </button>
        {data.calcStatus.success && !calculating && (
          <div className="calc-status">
            <i className="fa-solid fa-check-circle" style={{color: "var(--accent)", fontSize: 18, marginRight: 10}} />
            <div>
              <div className="calc-status__title">Calculated successfully</div>
              {data.calcStatus.services.map((s, i) => (
                <div key={i} className="calc-status__service">{s}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Loading / Discounts Screen ----
function LoadingDiscountsScreen({ layers, activeLayerIdx, onLayerChange }) {
  const activeLayer = layers[activeLayerIdx];
  const data = getCalcData(activeLayerIdx);

  const totals = data.tariff.reduce((acc, r) => ({
    techPremium: acc.techPremium + (r.techPremium || 0),
    offeredPremium: acc.offeredPremium + (r.offeredPremium || 0),
    walkAway: r.walkAway != null ? (acc.walkAway || 0) + r.walkAway : acc.walkAway,
    offeredHDI: acc.offeredHDI + (r.offeredHDI || 0),
  }), { techPremium: 0, offeredPremium: 0, walkAway: null, offeredHDI: 0 });

  return (
    <div>
      <div className="main__title">Loading / Discounts <LayerBadge layer={activeLayer} /></div>

      <h2 className="calc-section-title">Tariff</h2>
      <div className="calc-table-wrap">
        <table className="grid-tbl grid-tbl--calc">
          <thead>
            <tr>
              <th style={{width: "20%"}}>Program Structure</th>
              <th>Technical Premium</th>
              <th>Loading / Discount</th>
              <th>Offered Premium <span className="calc-info-icon"><i className="fa-solid fa-circle-info" /></span></th>
              <th>Walk Away Premium</th>
              <th>Offered HDI Premium</th>
            </tr>
          </thead>
          <tbody>
            {data.tariff.map((r, i) => (
              <tr key={i}>
                <td className="t-strong">
                  {i === 0 && <i className="fa-solid fa-chevron-up cov-chevron" style={{marginRight: 8}} />}
                  {r.program}
                </td>
                <td className="t-mono">{fmtCalcNum(r.techPremium)}</td>
                <td className="t-mono">{fmtCalcNum(r.loading)}</td>
                <td className="t-mono">{fmtCalcNum(r.offeredPremium)}</td>
                <td className="t-mono">{fmtCalcNum(r.walkAway)}</td>
                <td className="t-mono">{fmtCalcNum(r.offeredHDI)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="is-bold">
              <td><i className="fa-solid fa-calculator" style={{marginRight: 8, fontSize: 12}} /> Total</td>
              <td className="t-mono">{fmtCalcNum(totals.techPremium)}</td>
              <td></td>
              <td className="t-mono">{fmtCalcNum(totals.offeredPremium)}</td>
              <td className="t-mono">{fmtCalcNum(totals.walkAway)}</td>
              <td className="t-mono">{fmtCalcNum(totals.offeredHDI)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ---- Premium Rates Screen ----
function PremiumRatesScreen({ layers, activeLayerIdx, onLayerChange }) {
  const activeLayer = layers[activeLayerIdx];
  const data = getCalcData(activeLayerIdx);
  const [panelIdx, setPanelIdx] = useS(null); // index into data.rates
  const [draft, setDraft] = useS(null);

  const openPanel = (idx) => {
    setDraft({ ...data.rates[idx] });
    setPanelIdx(idx);
  };
  const closePanel = () => { setPanelIdx(null); setDraft(null); };

  return (
    <div>
      <div className="main__title">Premium Rates <LayerBadge layer={activeLayer} /></div>

      <h2 className="calc-section-title">Please Select Rate / Flat Premium Option for Your Offer</h2>
      <div className="calc-table-wrap">
        <table className="grid-tbl grid-tbl--calc">
          <thead>
            <tr>
              <th style={{width: "20%"}}>Program Structure</th>
              <th>Premium Rate</th>
              <th>Offered Premium</th>
              <th>USA</th>
              <th>ROW</th>
              <th>Combined / ROW USA</th>
            </tr>
          </thead>
          <tbody>
            {data.rates.map((r, i) => (
              <tr key={i}>
                <td className="t-strong">
                  {i === 0 && <i className="fa-solid fa-chevron-up cov-chevron" style={{marginRight: 8}} />}
                  {r.program}
                </td>
                <td>
                  {r.rateType ? (
                    <span className="rate-chip" onClick={() => openPanel(i)}>
                      {r.rateType}
                      <button className="rate-chip__edit"><i className="fa-solid fa-pencil" /></button>
                    </span>
                  ) : <span className="t-muted">—</span>}
                </td>
                <td className="t-mono">{fmtCalcNum(r.offeredPremium)}</td>
                <td className="t-mono">{fmtCalcNum(r.usa)}</td>
                <td className="t-mono">{fmtCalcNum(r.row)}</td>
                <td className="t-mono">{fmtCalcNum(r.combined)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-add-row">
        <i className="fa-solid fa-plus" /> Add group
      </button>

      {/* ---- Side Panel for editing rate ---- */}
      {panelIdx !== null && draft && (
        <div className="drawer-overlay" onClick={closePanel}>
          <div className="drawer" onClick={e => e.stopPropagation()} style={{width: 440}}>
            <div className="drawer__header">
              <div className="drawer__title">Edit Premium Rate</div>
              <button className="drawer__close" onClick={closePanel}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="drawer__body">
              <p style={{fontSize: 13, color: "var(--fg-muted)", marginBottom: 20}}>
                Configure the premium rate for <strong>{draft.program}</strong> on <strong>{activeLayer.name}</strong>.
              </p>
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                <div style={{gridColumn: "1 / -1"}}>
                  <div className="dfield__label" style={{marginBottom: 6}}>Rate Type</div>
                  <select className="form-input form-select"
                    value={draft.rateType || ""} onChange={e => setDraft(d => ({...d, rateType: e.target.value}))}>
                    <option value="">— Select —</option>
                    <option value="Flat Premium">Flat Premium</option>
                    <option value="Rate per Mille">Rate per Mille</option>
                    <option value="Rate per Cent">Rate per Cent</option>
                    <option value="Burning Cost">Burning Cost</option>
                  </select>
                </div>
                <div>
                  <div className="dfield__label" style={{marginBottom: 6}}>Offered Premium</div>
                  <input className="form-input" type="number"
                    value={draft.offeredPremium || ""} onChange={e => setDraft(d => ({...d, offeredPremium: Number(e.target.value)}))} />
                </div>
                <div>
                  <div className="dfield__label" style={{marginBottom: 6}}>USA Split</div>
                  <input className="form-input" type="number" placeholder="Optional"
                    value={draft.usa || ""} onChange={e => setDraft(d => ({...d, usa: Number(e.target.value) || null}))} />
                </div>
                <div>
                  <div className="dfield__label" style={{marginBottom: 6}}>ROW Split</div>
                  <input className="form-input" type="number" placeholder="Optional"
                    value={draft.row || ""} onChange={e => setDraft(d => ({...d, row: Number(e.target.value) || null}))} />
                </div>
                <div>
                  <div className="dfield__label" style={{marginBottom: 6}}>Combined / ROW USA</div>
                  <input className="form-input" type="number"
                    value={draft.combined || ""} onChange={e => setDraft(d => ({...d, combined: Number(e.target.value)}))} />
                </div>
              </div>
            </div>
            <div className="drawer__footer">
              <button className="btn btn--primary" onClick={closePanel}>Save Changes</button>
              <button className="btn btn--outline" onClick={closePanel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Overview / Sitemap screen ----
const SAMPLE_OFFERS = [
  {
    id: "LI-00005", name: "Suppella Partner International GmbH", status: "Accepted",
    options: [
      {
        name: "Option 1", desc: "Base Coverage", status: "In progress",
        layers: [
          { name: "Primary Layer", range: "€ 0 – € 1M", status: "Active" },
          { name: "Excess Layer 1", range: "€ 1M – € 4M", status: "Active" },
          { name: "Excess Layer 2", range: "€ 4M – € 10M", status: "Draft" },
        ]
      },
      {
        name: "Option 2", desc: "10% discount", status: "Draft",
        layers: [
          { name: "Primary Layer", range: "€ 0 – € 2M", status: "Active" },
          { name: "Excess Layer 1", range: "€ 2M – € 5M", status: "Draft" },
        ]
      },
      {
        name: "Option 3", desc: "20% discount", status: "Draft",
        layers: [
          { name: "Primary Layer", range: "€ 0 – € 1.5M", status: "Active" },
        ]
      },
    ]
  },
  {
    id: "CY-8021072140", name: "TechSecure Holdings Ltd", status: "Draft",
    options: [
      {
        name: "Option 1", desc: "Standard", status: "In progress",
        layers: [
          { name: "Primary Layer", range: "€ 0 – € 5M", status: "Active" },
          { name: "Excess Layer 1", range: "€ 5M – € 15M", status: "Active" },
        ]
      },
    ]
  },
];

function OverviewScreen({ onNavigate, allLayers }) {
  // Build live offer structure from actual layers state
  const LIVE_OFFERS = [
    {
      id: "LI-00005", name: "Suppella Partner International GmbH", status: "Accepted",
      options: [
        {
          name: "Option 1", desc: "Base Coverage", status: "In progress",
          layers: allLayers.map(l => ({ name: l.name, range: fmtShortRange(l.rangeFrom, l.rangeTo), status: l.participating ? "Participating" : "Non-part." }))
        },
        {
          name: "Option 2", desc: "10% discount", status: "Draft",
          layers: [
            { name: "Primary Layer", range: "€ 0 – € 2M", status: "Active" },
            { name: "Excess Layer 1", range: "€ 2M – € 5M", status: "Draft" },
          ]
        },
        {
          name: "Option 3", desc: "20% discount", status: "Draft",
          layers: [
            { name: "Primary Layer", range: "€ 0 – € 1.5M", status: "Active" },
          ]
        },
      ]
    },
    {
      id: "CY-8021072140", name: "TechSecure Holdings Ltd", status: "Draft",
      options: [
        {
          name: "Option 1", desc: "Standard", status: "In progress",
          layers: [
            { name: "Primary Layer", range: "€ 0 – € 5M", status: "Active" },
            { name: "Excess Layer 1", range: "€ 5M – € 15M", status: "Active" },
          ]
        },
      ]
    },
  ];

  return (
    <div>
      <div className="main__title">Overview</div>

      <div className="ov-tree">
        {LIVE_OFFERS.map((offer, oi) => (
          <div key={oi} className="ov-offer">
            <div className="ov-offer__header">
              <i className="fa-solid fa-file-lines ov-icon ov-icon--offer" />
              <span className="ov-offer__id">{offer.id}</span>
              <span className="ov-offer__name">{offer.name}</span>
              <span className={`ov-status ov-status--${offer.status.toLowerCase().replace(" ", "-")}`}>{offer.status}</span>
              <button className="ov-link" onClick={() => onNavigate && onNavigate("general-data", 0)} title="Open offer">
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>

            <div className="ov-options">
              {offer.options.map((opt, opti) => (
                <div key={opti} className="ov-option">
                  <div className="ov-option__header">
                    <i className="fa-solid fa-copy ov-icon ov-icon--option" />
                    <span className="ov-option__name">{opt.name}</span>
                    <span className="ov-option__desc">{opt.desc}</span>
                    <span className={`ov-status ov-status--${opt.status.toLowerCase().replace(" ", "-")}`}>{opt.status}</span>
                    <button className="ov-link" onClick={() => onNavigate && onNavigate("general-data", 0)} title="Open option">
                      <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>

                  <div className="ov-layers">
                    {opt.layers.map((layer, li) => (
                      <div key={li} className="ov-layer" onClick={() => onNavigate && onNavigate("program-coverage", li)} style={{cursor: "pointer"}}>
                        <i className="fa-solid fa-layer-group ov-icon ov-icon--layer" />
                        <span className="ov-layer__name">{layer.name}</span>
                        <span className="ov-layer__range">{layer.range}</span>
                        <span className={`ov-status ov-status--${layer.status.toLowerCase()}`}>{layer.status}</span>
                        <button className="ov-link" title="Open layer">
                          <i className="fa-solid fa-arrow-right" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Layered Coverage POC (previous design — hidden at #layered-coverage-poc) ----
// Flat matrix + per-layer dual-view (no tree indentation)
// Uses lc-* CSS classes, grid-tbl, pf-btn from the original deployed version
function LayeredCoveragePocScreen({ layers, activeLayerIdx, onLayerChange }) {
  const [viewMode, setViewMode] = useS("matrix"); // "matrix" or "per-layer"
  const [selectedLayerFilter, setSelectedLayerFilter] = useS(-1); // -1 = all

  // Gather all unique coverage names across all layers
  const allCoverageNames = [];
  layers.forEach(l => {
    (l.coverages || []).forEach(c => {
      if (!allCoverageNames.includes(c.name)) allCoverageNames.push(c.name);
    });
  });

  // Build matrix data: for each coverage, show its state per layer
  function getCoverageForLayer(coverageName, layer) {
    return (layer.coverages || []).find(c => c.name === coverageName);
  }

  const displayLayers = selectedLayerFilter === -1 ? layers : [layers[selectedLayerFilter]];

  return (
    <div>
      <div className="main__title">Layered Coverage</div>
      <p className="main__subtitle" style={{marginTop: -12, marginBottom: 24}}>
        Spread coverages across layers. Each cell shows how a coverage is distributed in the layer program.
      </p>

      {/* Controls */}
      <div className="lc-controls">
        <div className="participation-filter">
          <button className={`pf-btn${viewMode === "matrix" ? " pf-btn--active" : ""}`} onClick={() => setViewMode("matrix")}>
            <i className="fa-solid fa-table-cells" style={{marginRight: 6}} />Matrix View
          </button>
          <button className={`pf-btn${viewMode === "per-layer" ? " pf-btn--active" : ""}`} onClick={() => setViewMode("per-layer")}>
            <i className="fa-solid fa-layer-group" style={{marginRight: 6}} />Per-Layer View
          </button>
        </div>

        {viewMode === "per-layer" && (
          <select className="form-input form-select" style={{width: 200, marginLeft: "auto"}} value={selectedLayerFilter} onChange={e => setSelectedLayerFilter(Number(e.target.value))}>
            <option value={-1}>All Layers</option>
            {layers.map((l, i) => (
              <option key={i} value={i}>{l.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Matrix View: coverages × layers */}
      {viewMode === "matrix" && (
        <div className="lc-matrix-wrap">
          <table className="grid-tbl lc-matrix">
            <thead>
              <tr>
                <th className="lc-matrix__coverage-col">Coverage</th>
                {layers.map((l, li) => (
                  <th key={li} className={`lc-matrix__layer-col${li === activeLayerIdx ? " lc-matrix__layer-col--active" : ""}`}>
                    <div className="lc-layer-header">
                      <span className={`ls-type-badge ls-type-badge--${l.type.toLowerCase()}`} style={{fontSize: 9, padding: "1px 6px"}}>{l.type}</span>
                      <span className="lc-layer-header__name">{l.name}</span>
                      <span className="lc-layer-header__range">{fmtShortRange(l.rangeFrom, l.rangeTo)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCoverageNames.map((covName, ci) => (
                <tr key={ci}>
                  <td className="t-strong lc-matrix__coverage-name">{covName}</td>
                  {layers.map((l, li) => {
                    const cov = getCoverageForLayer(covName, l);
                    if (!cov) {
                      return <td key={li} className="lc-cell lc-cell--empty"><span className="lc-cell__dash">—</span></td>;
                    }
                    if (!cov.included) {
                      return (
                        <td key={li} className="lc-cell lc-cell--excluded">
                          <span className="lc-cell__excluded">Not included</span>
                        </td>
                      );
                    }
                    return (
                      <td key={li} className={`lc-cell lc-cell--included${li === activeLayerIdx ? " lc-cell--highlight" : ""}`}>
                        <div className="lc-cell__values">
                          <div className="lc-cell__row">
                            <span className="lc-cell__label">LIMIT</span>
                            <span className="lc-cell__value">{cov.limitOcc ? fmtEUR(cov.limitOcc) : "—"}</span>
                          </div>
                          <div className="lc-cell__row">
                            <span className="lc-cell__label">AGG</span>
                            <span className="lc-cell__value">{cov.limitAgg ? fmtEUR(cov.limitAgg) : "—"}</span>
                          </div>
                          <div className="lc-cell__row">
                            <span className="lc-cell__label">DED</span>
                            <span className="lc-cell__value">{cov.deductible != null ? fmtEUR(cov.deductible) : "—"}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Per-Layer View: one layer at a time with detailed coverage table */}
      {viewMode === "per-layer" && (
        <div className="lc-per-layer">
          {displayLayers.map((layer, dispIdx) => {
            const realIdx = selectedLayerFilter === -1 ? dispIdx : selectedLayerFilter;
            const layerCoverages = layer.coverages || [];
            const included = layerCoverages.filter(c => c.included);
            const excluded = layerCoverages.filter(c => !c.included);

            return (
              <div key={realIdx} className="lc-layer-card">
                <div className="lc-layer-card__header">
                  <div className="lc-layer-card__title">
                    <span className={`ls-type-badge ls-type-badge--${layer.type.toLowerCase()}`}>{layer.type}</span>
                    <strong>{layer.name}</strong>
                    <span className="t-muted" style={{fontSize: 12}}>{fmtShortRange(layer.rangeFrom, layer.rangeTo)}</span>
                    <span className={`status-badge ${layer.participating ? 'status-badge--participating' : 'status-badge--not-participating'}`} style={{marginLeft: 8}}>
                      {layer.participating ? "Participating" : "Non-participating"}
                    </span>
                  </div>
                  <div className="lc-layer-card__meta">
                    Limit: <strong>{fmtEUR(layer.limit)}</strong> &nbsp;|&nbsp; XS: <strong>{fmtEUR(layer.attachmentPoint)}</strong>
                  </div>
                </div>

                {included.length > 0 && (
                  <table className="grid-tbl" style={{margin: "16px 20px", width: "calc(100% - 40px)"}}>
                    <thead>
                      <tr>
                        <th style={{width: "32%"}}>Coverage</th>
                        <th>TOL</th>
                        <th>Limit (occ)</th>
                        <th>Limit (agg)</th>
                        <th>Deductible</th>
                      </tr>
                    </thead>
                    <tbody>
                      {included.map((c, ci) => (
                        <tr key={ci}>
                          <td className="t-strong">{c.name}</td>
                          <td className="t-muted">{c.tol || "—"}</td>
                          <td className="t-mono">{c.limitOcc ? fmtEUR(c.limitOcc) : "—"}</td>
                          <td className="t-mono">{c.limitAgg ? fmtEUR(c.limitAgg) : "—"}</td>
                          <td className="t-mono">{c.deductible != null ? fmtEUR(c.deductible) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {excluded.length > 0 && (
                  <div className="lc-excluded-section">
                    <span className="lc-excluded-section__label">Not included in this layer:</span>
                    <span className="lc-excluded-chips">
                      {excluded.map((c, ci) => (
                        <span key={ci} className="lc-excluded-chip">{c.name}</span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="lc-legend">
        <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--included" /> Included (with limits)</span>
        <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--excluded" /> Not included in layer</span>
        <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--empty" /> Coverage not configured</span>
      </div>
    </div>
  );
}

// ---- Layered Coverage screen — tree rows × layer columns ----
// Left column: full coverage hierarchy (indented, collapsible) from coverage.json
// Right columns: one per layer — showing how each coverage is spread across the program
// This is the UW's main view: "I see my coverage tree, and for each coverage I see
// what each layer provides (limit, ded, included/not)"
function LayeredCoverageScreen({ layers, activeLayerIdx, onLayerChange }) {
  const [coverageTree, setCoverageTree] = useS(null);
  const [collapsed, setCollapsed] = useS({});
  const [showSelectedOnly, setShowSelectedOnly] = useS(false);
  const [page, setPage] = useS(0);
  const PAGE_SIZE = 4;

  // Load coverage.json once
  useE(() => {
    fetch("coverage.json")
      .then(r => r.json())
      .then(data => setCoverageTree(data))
      .catch(() => setCoverageTree([]));
  }, []);

  // Pagination — must be before early return (hooks rules)
  const totalPages = Math.ceil(layers.length / PAGE_SIZE);
  useE(() => {
    if (page >= totalPages && totalPages > 0) setPage(totalPages - 1);
  }, [layers.length]);

  // Auto-jump to page containing the active layer
  useE(() => {
    const targetPage = Math.floor(activeLayerIdx / PAGE_SIZE);
    if (targetPage !== page) setPage(targetPage);
  }, [activeLayerIdx]);

  if (!coverageTree) return <div className="main__title">Coverage (Cyber)</div>;

  const toggleCollapse = (kindId) => {
    setCollapsed(c => ({ ...c, [kindId]: !c[kindId] }));
  };

  // Visibility filter
  const isVisible = (cov) => {
    if (!showSelectedOnly) return true;
    if (cov.selected) return true;
    return (cov.children || []).some(c => isVisible(c));
  };

  // Simulated per-layer coverage data
  // In the real app, each layer has its own coverage config.
  // For this prototype, we derive plausible spreading from the layer data
  // + the coverage tree selection state.
  const getLayerCoverageInfo = (cov, layer, layerIdx) => {
    // Match by name (fuzzy — the layer.coverages use short names)
    const covName = cov.coverageName;
    const match = (layer.coverages || []).find(c => {
      // Try exact or substring match
      return covName.includes(c.name) || c.name.includes(covName) ||
        covName.replace(/[&()]/g, "").includes(c.name.replace(/[&()]/g, ""));
    });

    if (match) {
      return {
        included: match.included,
        limitOcc: match.limitOcc,
        limitAgg: match.limitAgg,
        deductible: match.deductible,
      };
    }

    // No match in this layer's coverages — if coverage is selected,
    // show it as "inherited" (included but no specific config).
    // If not selected, show as not applicable.
    if (!cov.selected) return { included: false, na: true };

    // Selected but not explicitly in this layer → show as included (inherited)
    return { included: true, inherited: true };
  };

  // Flatten the tree for rendering — produces rows with depth info
  const flattenRows = (items, depth) => {
    const rows = [];
    const visible = items.filter(c => isVisible(c));

    visible.forEach((cov, idx) => {
      const kindId = cov.coverageKindId;
      const hasChildren = cov.children && cov.children.length > 0;
      const isCollapsed = collapsed[kindId];

      rows.push({ cov, depth, hasChildren, isCollapsed, kindId });

      if (hasChildren && !isCollapsed) {
        rows.push(...flattenRows(cov.children, depth + 1));
      }
    });
    return rows;
  };

  const flatRows = flattenRows(coverageTree, 0);

  // Pagination slicing
  const pageStart = page * PAGE_SIZE;
  const visibleLayers = layers.slice(pageStart, pageStart + PAGE_SIZE);
  const visibleLayerIndices = visibleLayers.map((_, i) => pageStart + i);

  return (
    <div>
      <div className="main__title">Coverage (Cyber)</div>
      <p className="main__subtitle" style={{ marginTop: -12, marginBottom: 20 }}>
        Coverage tree spread across layers. Each column shows how a coverage is distributed in the layer program.
      </p>

      {/* Controls */}
      <div className="ct-controls">
        <div className="ct-filter-toggle">
          <label className={`ct-radio${!showSelectedOnly ? " ct-radio--active" : ""}`} onClick={() => setShowSelectedOnly(false)}>
            <span className="ct-radio__dot ct-radio__dot--green" /> All coverages
          </label>
          <label className={`ct-radio${showSelectedOnly ? " ct-radio--active" : ""}`} onClick={() => setShowSelectedOnly(true)}>
            <span className="ct-radio__dot" /> Selected only
          </label>
        </div>

        {/* Pagination — only show if more than PAGE_SIZE layers */}
        {layers.length > PAGE_SIZE && (
          <div className="lct-pagination">
            <span className="lct-pagination__label">Layers:</span>
            <button className="lct-pagination__btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <i className="fa-solid fa-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, pi) => {
              const start = pi * PAGE_SIZE;
              const end = Math.min(start + PAGE_SIZE, layers.length) - 1;
              const firstName = layers[start].name;
              const lastName = layers[end].name;
              return (
                <button key={pi}
                  className={"lct-pagination__page" + (pi === page ? " lct-pagination__page--active" : "")}
                  onClick={() => setPage(pi)}
                  title={firstName + " – " + lastName}>
                  {firstName} – {lastName}
                </button>
              );
            })}
            <button className="lct-pagination__btn" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* Tree × Layers matrix */}
      <div className="lct-wrap">
        <table className="lct-table">
          <thead>
            <tr>
              <th className="lct-th lct-th--name">Coverage</th>
              {visibleLayers.map((l, vi) => {
                const li = visibleLayerIndices[vi];
                return (
                  <th key={li} className={`lct-th lct-th--layer${li === activeLayerIdx ? " lct-th--active" : ""}`}
                    onClick={() => onLayerChange(li)} style={{ cursor: "pointer" }}>
                    <div className="lct-layer-head">
                      <span className={`ls-type-badge ls-type-badge--${l.type.toLowerCase()}`} style={{ fontSize: 9, padding: "1px 6px" }}>{l.type}</span>
                      <span className="lct-layer-head__name">{l.name}</span>
                      <span className="lct-layer-head__range">{fmtShortRange(l.rangeFrom, l.rangeTo)}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {flatRows.map(({ cov, depth, hasChildren, isCollapsed, kindId }) => {
              const isSelected = cov.selected;
              const isRoot = depth === 0;

              return (
                <tr key={kindId} className={`lct-row${isSelected ? " lct-row--selected" : ""}${isRoot ? " lct-row--root" : ""}`}>
                  {/* Coverage name column — tree structure */}
                  <td className="lct-cell lct-cell--name" style={{ paddingLeft: 14 + depth * 28 }}>
                    <div className="lct-name-inner">
                      {hasChildren ? (
                        <button className="ct-chevron" onClick={() => toggleCollapse(kindId)}>
                          <i className={`fa-solid fa-chevron-${isCollapsed ? "right" : "down"}`} style={{ fontSize: 10 }} />
                        </button>
                      ) : (
                        depth > 0 ? <span className="lct-tree-spacer" /> : null
                      )}
                      <span className={`ct-check${isSelected ? " ct-check--on" : ""}`}>
                        {isSelected && <i className="fa-solid fa-check" style={{ fontSize: 10, color: "#fff" }} />}
                      </span>
                      <span className="lct-name-text">{cov.coverageName}</span>
                    </div>
                  </td>

                  {/* One cell per visible layer */}
                  {visibleLayers.map((l, vi) => {
                    const li = visibleLayerIndices[vi];
                    const info = getLayerCoverageInfo(cov, l, li);
                    const isActiveLayer = li === activeLayerIdx;

                    if (info.na) {
                      return (
                        <td key={li} className="lct-cell lct-cell--layer lct-cell--na">
                          <span className="lct-dash">—</span>
                        </td>
                      );
                    }

                    if (!info.included) {
                      return (
                        <td key={li} className="lct-cell lct-cell--layer lct-cell--excluded">
                          <span className="lct-excluded-label">Not incl.</span>
                        </td>
                      );
                    }

                    if (info.inherited) {
                      return (
                        <td key={li} className={`lct-cell lct-cell--layer lct-cell--included${isActiveLayer ? " lct-cell--highlight" : ""}`}>
                          <span className="lct-inherited"><i className="fa-solid fa-check" style={{ fontSize: 11, color: "var(--accent)" }} /></span>
                        </td>
                      );
                    }

                    return (
                      <td key={li} className={`lct-cell lct-cell--layer lct-cell--included${isActiveLayer ? " lct-cell--highlight" : ""}`}>
                        <div className="lct-cell-vals">
                          {info.limitOcc != null && (
                            <div className="lct-val-row">
                              <span className="lct-val-label">Lim</span>
                              <span className="lct-val-num">{fmtEUR(info.limitOcc)}</span>
                            </div>
                          )}
                          {info.limitAgg != null && (
                            <div className="lct-val-row">
                              <span className="lct-val-label">Agg</span>
                              <span className="lct-val-num">{fmtEUR(info.limitAgg)}</span>
                            </div>
                          )}
                          {info.deductible != null && (
                            <div className="lct-val-row">
                              <span className="lct-val-label">Ded</span>
                              <span className="lct-val-num">{fmtEUR(info.deductible)}</span>
                            </div>
                          )}
                          {info.limitOcc == null && info.limitAgg == null && info.deductible == null && (
                            <span className="lct-inherited"><i className="fa-solid fa-check" style={{ fontSize: 11, color: "var(--accent)" }} /></span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="lc-legend" style={{ marginTop: 20 }}>
        <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--included" /> Included (with limits)</span>
        <span className="lc-legend__item"><span className="lct-inherited-legend"><i className="fa-solid fa-check" style={{ fontSize: 10, color: "var(--accent)" }} /></span> Included (inherited)</span>
        <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--excluded" /> Not included in layer</span>
        <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--empty" /> Not applicable</span>
      </div>
    </div>
  );
}

// ============================================================
// Property Coverage — Split into 2 screens
// Shared state via module-level ref (prototype shortcut)
// ============================================================

const PROPERTY_PERILS = [
  { id: "flexa", name: "FLExA" },
  { id: "srcc", name: "SRCC (Strikes, riots, civil commotions)" },
  { id: "earthquake", name: "Earthquake" },
  { id: "tsunami", name: "Tsunami" },
  { id: "flood", name: "Flood" },
  { id: "heavy-rain", name: "Heavy rain" },
  { id: "wind", name: "Wind" },
  { id: "hail", name: "Hail" },
  { id: "subsidence", name: "Subsidence, Landslide" },
  { id: "snow", name: "Weight of snow, Avalanche" },
];

const LIMIT_TYPES = ["Per Occurrence", "Aggregate", "No Limit"];
const DEDUCTIBLE_TYPES = ["Per Occurrence", "Aggregate", "No Deductible"];

function initPropertyState() {
  return PROPERTY_PERILS.map(p => ({
    ...p,
    pd: p.id === "flexa",
    bi: p.id === "flexa",
    limits: {
      pd: { type: "Per Occurrence", value: p.id === "flexa" ? 100300 : "" },
      bi: { type: "No Limit", value: "" },
    },
    deductibles: {
      pd: { type: "Per Occurrence", value: p.id === "flexa" ? 5000 : "" },
      bi: { type: "No Deductible", value: "" },
    },
  }));
}

// Shared state across both property screens (module-level for prototype)
let _propLayerStates = null;
let _propListeners = [];
function usePropState(layers, activeLayerIdx) {
  if (!_propLayerStates) _propLayerStates = layers.map(() => initPropertyState());

  const [, forceUpdate] = useS(0);
  useE(() => {
    const fn = () => forceUpdate(n => n + 1);
    _propListeners.push(fn);
    return () => { _propListeners = _propListeners.filter(f => f !== fn); };
  }, []);

  // Sync if layers added
  if (_propLayerStates.length < layers.length) {
    const extra = Array(layers.length - _propLayerStates.length).fill(null).map(() => initPropertyState());
    _propLayerStates = [..._propLayerStates, ...extra];
  }

  const notify = () => _propListeners.forEach(fn => fn());

  const perils = _propLayerStates[activeLayerIdx] || initPropertyState();

  const updatePeril = (perilId, field, value) => {
    _propLayerStates = _propLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      return ls.map(p => p.id === perilId ? { ...p, [field]: value } : p);
    });
    notify();
  };

  const updateLimit = (perilId, coverage, field, value) => {
    _propLayerStates = _propLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      return ls.map(p => {
        if (p.id !== perilId) return p;
        return { ...p, limits: { ...p.limits, [coverage]: { ...p.limits[coverage], [field]: value } } };
      });
    });
    notify();
  };

  const updateDeductible = (perilId, coverage, field, value) => {
    _propLayerStates = _propLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      return ls.map(p => {
        if (p.id !== perilId) return p;
        return { ...p, deductibles: { ...p.deductibles, [coverage]: { ...p.deductibles[coverage], [field]: value } } };
      });
    });
    notify();
  };

  return { perils, updatePeril, updateLimit, updateDeductible };
}

// Screen 1: Define Coverage (checkbox matrix)
function PropDefineCoverageScreen({ layers, activeLayerIdx, onLayerChange }) {
  const { perils, updatePeril } = usePropState(layers, activeLayerIdx);
  const activeLayer = layers[activeLayerIdx];

  return (
    <div>
      <div className="main__title">
        Define Coverage (Property)
        <span className="main__title-badge">{activeLayer.name}</span>
      </div>

      <div className="prop-section">
        <p className="prop-section__desc">Select the scope of coverage for Property Damage and Business Interruption. You can exclude perils later as well.</p>

        <table className="prop-tbl">
          <thead>
            <tr>
              <th className="prop-tbl__th prop-tbl__th--name">Coverage</th>
              <th className="prop-tbl__th prop-tbl__th--check">Property Damage</th>
              <th className="prop-tbl__th prop-tbl__th--check">Business Interruption</th>
            </tr>
          </thead>
          <tbody>
            {perils.map(p => (
              <tr key={p.id} className="prop-tbl__row">
                <td className="prop-tbl__td prop-tbl__td--name">
                  <i className="fa-solid fa-file-lines" style={{ color: "var(--fg-muted)", fontSize: 13, marginRight: 8 }} />
                  {p.name}
                </td>
                <td className="prop-tbl__td prop-tbl__td--check">
                  <button className={"prop-pill" + (p.pd ? " prop-pill--included" : " prop-pill--excluded")}
                    onClick={() => updatePeril(p.id, "pd", !p.pd)}>
                    <span className="prop-pill__dot" />
                    {p.pd ? "Included" : "Excluded"}
                  </button>
                </td>
                <td className="prop-tbl__td prop-tbl__td--check">
                  <button className={"prop-pill" + (p.bi ? " prop-pill--included" : " prop-pill--excluded")}
                    onClick={() => updatePeril(p.id, "bi", !p.bi)}>
                    <span className="prop-pill__dot" />
                    {p.bi ? "Included" : "Excluded"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Screen 2: Limits / Deductibles
function PropLimitsScreen({ layers, activeLayerIdx, onLayerChange }) {
  const { perils, updateLimit, updateDeductible } = usePropState(layers, activeLayerIdx);
  const activeLayer = layers[activeLayerIdx];
  const includedPerils = perils.filter(p => p.pd || p.bi);

  return (
    <div>
      <div className="main__title">
        Limits / Deductibles (Property)
        <span className="main__title-badge">{activeLayer.name}</span>
      </div>

      <div className="prop-section">
        {includedPerils.length === 0 ? (
          <p className="prop-section__desc">No coverages included yet. Go to "Define Coverage" to select perils first.</p>
        ) : (
          <F>
            <p className="prop-section__desc">Define limits and deductibles for each included peril.</p>
            <table className="prop-tbl prop-tbl--limits">
              <thead>
                <tr>
                  <th className="prop-tbl__th prop-tbl__th--name">Coverage</th>
                  <th className="prop-tbl__th">Type</th>
                  <th className="prop-tbl__th">Limit Type</th>
                  <th className="prop-tbl__th">Limit Value</th>
                  <th className="prop-tbl__th">Deductible Type</th>
                  <th className="prop-tbl__th">Deductible Value</th>
                </tr>
              </thead>
              <tbody>
                {includedPerils.map(p => (
                  <F key={p.id}>
                    {p.pd && (
                      <tr className="prop-tbl__row">
                        <td className="prop-tbl__td prop-tbl__td--name" rowSpan={p.pd && p.bi ? 2 : 1}>
                          {p.name}
                        </td>
                        <td className="prop-tbl__td"><span className="prop-badge">PD</span></td>
                        <td className="prop-tbl__td">
                          <select className="prop-select" value={p.limits.pd.type}
                            onChange={e => updateLimit(p.id, "pd", "type", e.target.value)}>
                            {LIMIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="prop-tbl__td">
                          {p.limits.pd.type !== "No Limit" && (
                            <input type="number" className="prop-input" placeholder="Amount"
                              value={p.limits.pd.value} onChange={e => updateLimit(p.id, "pd", "value", e.target.value)} />
                          )}
                        </td>
                        <td className="prop-tbl__td">
                          <select className="prop-select" value={p.deductibles.pd.type}
                            onChange={e => updateDeductible(p.id, "pd", "type", e.target.value)}>
                            {DEDUCTIBLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="prop-tbl__td">
                          {p.deductibles.pd.type !== "No Deductible" && (
                            <input type="number" className="prop-input" placeholder="Amount"
                              value={p.deductibles.pd.value} onChange={e => updateDeductible(p.id, "pd", "value", e.target.value)} />
                          )}
                        </td>
                      </tr>
                    )}
                    {p.bi && (
                      <tr className="prop-tbl__row">
                        {!p.pd && <td className="prop-tbl__td prop-tbl__td--name">{p.name}</td>}
                        <td className="prop-tbl__td"><span className="prop-badge prop-badge--bi">BI</span></td>
                        <td className="prop-tbl__td">
                          <select className="prop-select" value={p.limits.bi.type}
                            onChange={e => updateLimit(p.id, "bi", "type", e.target.value)}>
                            {LIMIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="prop-tbl__td">
                          {p.limits.bi.type !== "No Limit" && (
                            <input type="number" className="prop-input" placeholder="Amount"
                              value={p.limits.bi.value} onChange={e => updateLimit(p.id, "bi", "value", e.target.value)} />
                          )}
                        </td>
                        <td className="prop-tbl__td">
                          <select className="prop-select" value={p.deductibles.bi.type}
                            onChange={e => updateDeductible(p.id, "bi", "type", e.target.value)}>
                            {DEDUCTIBLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="prop-tbl__td">
                          {p.deductibles.bi.type !== "No Deductible" && (
                            <input type="number" className="prop-input" placeholder="Amount"
                              value={p.deductibles.bi.value} onChange={e => updateDeductible(p.id, "bi", "value", e.target.value)} />
                          )}
                        </td>
                      </tr>
                    )}
                  </F>
                ))}
              </tbody>
            </table>
          </F>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Liability Coverage Screen
// ============================================================

const LIABILITY_TOI_OPTIONS = ["BI/PD/FL", "BI/PD", "PD/FL", "BI", "PD", "FL"];

function initLiabilityState() {
  return {
    contract: {
      program: "General Liability Baseline",
      toi: "BI/PD/FL", occ: 100000, max: 5, agg: 500000,
      dedToi: "BI/PD/FL", dedValue: 1000, pol: false,
    },
    coverages: [
      { id: "pub-liab", name: "Public Liability", toi: "BI/PD/FL", occ: 100000, max: 5, agg: 500000, dedToi: "BI/PD/FL", dedValue: 1000 },
    ],
  };
}

let _liabLayerStates = null;
let _liabListeners = [];
function useLiabState(layers, activeLayerIdx) {
  if (!_liabLayerStates) _liabLayerStates = layers.map(() => initLiabilityState());

  const [, forceUpdate] = useS(0);
  useE(() => {
    const fn = () => forceUpdate(n => n + 1);
    _liabListeners.push(fn);
    return () => { _liabListeners = _liabListeners.filter(f => f !== fn); };
  }, []);

  if (_liabLayerStates.length < layers.length) {
    const extra = Array(layers.length - _liabLayerStates.length).fill(null).map(() => initLiabilityState());
    _liabLayerStates = [..._liabLayerStates, ...extra];
  }

  const notify = () => _liabListeners.forEach(fn => fn());
  const state = _liabLayerStates[activeLayerIdx] || initLiabilityState();

  const updateContract = (field, value) => {
    _liabLayerStates = _liabLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      return { ...ls, contract: { ...ls.contract, [field]: value } };
    });
    notify();
  };

  const updateCoverage = (covId, field, value) => {
    _liabLayerStates = _liabLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      return { ...ls, coverages: ls.coverages.map(c => c.id === covId ? { ...c, [field]: value } : c) };
    });
    notify();
  };

  const addCoverage = (name) => {
    _liabLayerStates = _liabLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      const newCov = { id: "cov-" + Date.now(), name, toi: "BI/PD/FL", occ: 0, max: 1, agg: 0, dedToi: "BI/PD/FL", dedValue: 0 };
      return { ...ls, coverages: [...ls.coverages, newCov] };
    });
    notify();
  };

  const removeCoverage = (covId) => {
    _liabLayerStates = _liabLayerStates.map((ls, i) => {
      if (i !== activeLayerIdx) return ls;
      return { ...ls, coverages: ls.coverages.filter(c => c.id !== covId) };
    });
    notify();
  };

  return { state, updateContract, updateCoverage, addCoverage, removeCoverage };
}

// ---- Coverage Spreading Screen — tree + tower ----
// Left: full coverage tree (select a coverage); shows per-row assignment badge
// Right: vertical tower (Primary at bottom, Excess stacked above)
//        each block is interactive: toggle include/exclude + edit limits inline
//
// Assignment state lives in a module-level map keyed by coverageKindId × layerIdx
// so it persists while navigating away and back within the same session.
const _spreadingAssignments = (() => {
  try {
    const raw = localStorage.getItem("ml_spreading_v2");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
})();
let _spreadingListeners = [];

function _saveSpreadingToLS() {
  try { localStorage.setItem("ml_spreading_v2", JSON.stringify(_spreadingAssignments)); } catch {}
}

function useSpreadingState() {
  const [, forceUpdate] = useS(0);
  useE(() => {
    const fn = () => forceUpdate(n => n + 1);
    _spreadingListeners.push(fn);
    return () => { _spreadingListeners = _spreadingListeners.filter(f => f !== fn); };
  }, []);
  const notify = () => _spreadingListeners.forEach(fn => fn());

  const getAssignment = (kindId, layerIdx) =>
    _spreadingAssignments[kindId + "_" + layerIdx] || null;

  const setExcluded = (kindId, layerIdx, excluded) => {
    const key = kindId + "_" + layerIdx;
    _spreadingAssignments[key] = { ...(_spreadingAssignments[key] || {}), excluded };
    _saveSpreadingToLS(); notify();
  };

  const setFields = (kindId, layerIdx, fields) => {
    const key = kindId + "_" + layerIdx;
    _spreadingAssignments[key] = { ...(_spreadingAssignments[key] || {}), ...fields };
    _saveSpreadingToLS(); notify();
  };

  return { getAssignment, setExcluded, setFields };
}

function CoverageSpreadingScreen({ layers, activeLayerIdx, onLayerChange }) {
  const [coverageTree, setCoverageTree] = useS(null);
  const [collapsed, setCollapsed] = useS({});
  const [selectedKindId, setSelectedKindId] = useS(null);
  const [selectedCov, setSelectedCov] = useS(null);
  const [filter, setFilter] = useS("");
  const [showOnlyActive, setShowOnlyActive] = useS(false);
  const [hideNonParticipating, setHideNonParticipating] = useS(false);
  const [hideNonAssigned, setHideNonAssigned] = useS(false);
  const [panelTarget, setPanelTarget] = useS(null); // { layerIdx } | null
  // Draft state for the open panel
  const [panelDraft, setPanelDraft] = useS({});
  const [inheritToExcess, setInheritToExcess] = useS(false);
  const { getAssignment, setExcluded, setFields } = useSpreadingState();
  const parentMapRef = React.useRef({});
  const covNameByIdRef = React.useRef({});

  useE(() => {
    fetch("coverage.json")
      .then(r => r.json())
      .then(data => {
        setCoverageTree(data);
        data.forEach(root => seedAssignments(root));
        parentMapRef.current = buildParentMap(data);
        covNameByIdRef.current = buildNameMap(data);
        const first = findFirstSelected(data);
        if (first) { setSelectedKindId(first.coverageKindId); setSelectedCov(first); }
      })
      .catch(() => setCoverageTree([]));
  }, []);

  function seedAssignments(cov) {
    layers.forEach((_, li) => {
      const key = cov.coverageKindId + "_" + li;
      if (_spreadingAssignments[key] !== undefined) return;
      _spreadingAssignments[key] = {
        excluded: false,
        sublimit: "",
        sharedSublimit: "",
        deductible: "",
        retroDateYears: "",
        indemnityPeriodValue: "",
        indemnityPeriodUnit: "MONTH",
        waitingPeriodValue: "",
        waitingPeriodUnit: "HOUR",
      };
    });
    (cov.children || []).forEach(child => seedAssignments(child));
  }

  function buildParentMap(items, parentId = null, map = {}) {
    items.forEach(cov => {
      if (parentId) map[cov.coverageKindId] = parentId;
      if (cov.children?.length) buildParentMap(cov.children, cov.coverageKindId, map);
    });
    return map;
  }

  function buildNameMap(items, map = {}) {
    items.forEach(cov => {
      map[cov.coverageKindId] = (cov.coverageName || "").trim();
      if (cov.children?.length) buildNameMap(cov.children, map);
    });
    return map;
  }

  // Full ancestor chain (root first) for the tower header breadcrumb —
  // e.g. ["Own losses", "Incident Response Costs", "Forensic Investigations"]
  function breadcrumbFor(kindId, parentMap, nameMap) {
    const chain = [nameMap[kindId]];
    let current = kindId;
    while (parentMap[current]) {
      current = parentMap[current];
      chain.unshift(nameMap[current]);
    }
    return chain.filter(Boolean);
  }

  function isCascadeLocked(kindId, layerIdx, parentMap) {
    // Primary layer is never locked
    if (layerIdx === 0) return false;
    // Rule A: any earlier excess layer excluded this coverage
    for (let j = 1; j < layerIdx; j++) {
      if (_spreadingAssignments[kindId + "_" + j]?.excluded === true) return true;
    }
    // Rule B: parent excluded in same layer (recurse up tree)
    const parentId = parentMap[kindId];
    if (parentId) {
      if (_spreadingAssignments[parentId + "_" + layerIdx]?.excluded === true) return true;
      if (isCascadeLocked(parentId, layerIdx, parentMap)) return true;
    }
    return false;
  }

  function findFirstSelected(items) {
    for (const item of items) {
      if (item.selected) return item;
      if (item.children) { const f = findFirstSelected(item.children); if (f) return f; }
    }
    return null;
  }

  const toggleCovSelected = (kindId) => {
    const toggle = (items) => items.map(c =>
      c.coverageKindId === kindId ? { ...c, selected: !c.selected }
      : c.children ? { ...c, children: toggle(c.children) }
      : c
    );
    setCoverageTree(prev => toggle(prev));
  };

  const flattenTree = (items, depth) => {
    const rows = [];
    items.forEach(cov => {
      const hasChildren = cov.children && cov.children.length > 0;
      const matchesFilter = !filter || cov.coverageName.toLowerCase().includes(filter.toLowerCase());
      const descendantMatches = hasChildren && hasDescendantMatch(cov, filter);
      if (filter && !matchesFilter && !descendantMatches) return;
      // "Show only active" filter: skip unselected coverages (and check descendants)
      if (showOnlyActive && !cov.selected) {
        // Still recurse into children — some descendants may be selected
        if (hasChildren && !collapsed[cov.coverageKindId]) {
          rows.push(...flattenTree(cov.children, depth));
        }
        return;
      }
      rows.push({ cov, depth, hasChildren, isCollapsed: !!collapsed[cov.coverageKindId] });
      if (hasChildren && !collapsed[cov.coverageKindId]) {
        rows.push(...flattenTree(cov.children, depth + 1));
      }
    });
    return rows;
  };

  function hasDescendantMatch(cov, f) {
    if (!f || !cov.children) return false;
    return cov.children.some(c => c.coverageName.toLowerCase().includes(f.toLowerCase()) || hasDescendantMatch(c, f));
  }

  const countIncluded = (kindId) =>
    layers.filter((_, li) => !getAssignment(kindId, li)?.excluded).length;

  const toggle = (kindId, e) => { e.stopPropagation(); setCollapsed(c => ({ ...c, [kindId]: !c[kindId] })); };
  const selectCov = (cov) => { setSelectedKindId(cov.coverageKindId); setSelectedCov(cov); setPanelTarget(null); };

  // Open panel: copy current assignment into draft
  const openPanel = (li) => {
    const a = getAssignment(selectedCov.coverageKindId, li) || {};
    setPanelDraft({
      sublimit: a.sublimit || "",
      sharedSublimit: a.sharedSublimit || "",
      deductible: a.deductible || "",
      retroDateYears: a.retroDateYears || "",
      indemnityPeriodValue: a.indemnityPeriodValue || "",
      indemnityPeriodUnit: a.indemnityPeriodUnit || "MONTH",
      waitingPeriodValue: a.waitingPeriodValue || "",
      waitingPeriodUnit: a.waitingPeriodUnit || "HOUR",
    });
    setPanelTarget({ layerIdx: li });
    setInheritToExcess(false);
  };

  // Save panel: write draft back to assignments
  const savePanel = () => {
    if (!panelTarget || !selectedCov) return;
    const li = panelTarget.layerIdx;
    const key = selectedCov.coverageKindId + "_" + li;
    const fieldsToPush = {
      sublimit: panelDraft.sublimit,
      sharedSublimit: panelDraft.sharedSublimit,
      deductible: panelDraft.deductible,
      retroDateYears: panelDraft.retroDateYears,
      indemnityPeriodValue: panelDraft.indemnityPeriodValue,
      indemnityPeriodUnit: panelDraft.indemnityPeriodUnit,
      waitingPeriodValue: panelDraft.waitingPeriodValue,
      waitingPeriodUnit: panelDraft.waitingPeriodUnit,
    };
    _spreadingAssignments[key] = { ..._spreadingAssignments[key], ...fieldsToPush };
    // Inherit to all excess layers if toggled (overwrite their field values, preserve excluded state)
    if (inheritToExcess && li === 0) {
      layers.forEach((_, excessLi) => {
        if (excessLi === 0) return;
        const excessKey = selectedCov.coverageKindId + "_" + excessLi;
        _spreadingAssignments[excessKey] = { ...(_spreadingAssignments[excessKey] || {}), ...fieldsToPush };
      });
    }
    _saveSpreadingToLS();
    _spreadingListeners.forEach(fn => fn());
    setPanelTarget(null);
  };

  const treeRows = coverageTree ? flattenTree(coverageTree, 0) : [];

  const totalRange = layers.reduce((s, l) => s + Math.max(0, (l.rangeTo || 0) - (l.rangeFrom || 0)), 0);
  const MIN_HEIGHT_PX = 60;
  const TOWER_HEIGHT_PX = Math.max(280, layers.length * 80);

  const includedCount = selectedCov
    ? layers.filter((_, li) => !getAssignment(selectedCov.coverageKindId, li)?.excluded).length
    : 0;

  if (!coverageTree) return <div className="main__title">Coverage Spreading (Cyber)</div>;

  const panelLayer = panelTarget != null ? layers[panelTarget.layerIdx] : null;

  return (
    <div>
      <div className="main__title">Coverage Spreading (Cyber)</div>
      <p className="main__subtitle" style={{ marginTop: -12, marginBottom: 20 }}>
        Select a coverage on the left, then assign it to layers and configure limits on the right.
      </p>

      <div className="cst-layout">
        {/* ---- LEFT: Coverage tree ---- */}
        <div className="cst-tree-panel">
          <div className="cst-tree-header">
            <span className="cst-tree-header__title">Coverages</span>
            <div className="pc-search" style={{ minWidth: 0, flex: 1 }}>
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text" placeholder="Filter…"
                value={filter} onChange={e => setFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="cst-filter-bar">
            <label className="cst-filter-toggle">
              <input type="checkbox" checked={showOnlyActive} onChange={e => setShowOnlyActive(e.target.checked)} />
              <span>Show only active coverages</span>
            </label>
          </div>
          <div className="cst-tree-scroll">
            {treeRows.map(({ cov, depth, hasChildren, isCollapsed }) => {
              const included = countIncluded(cov.coverageKindId);
              const isSelected = cov.coverageKindId === selectedKindId;
              return (
                <div
                  key={cov.coverageKindId}
                  className={`cst-tree-row${cov.selected ? " cst-tree-row--checked" : ""}${isSelected ? " cst-tree-row--selected" : ""}`}
                  style={{ paddingLeft: 12 + depth * 22 }}
                  onClick={() => selectCov(cov)}
                >
                  {hasChildren ? (
                    <button className="ct-chevron" style={{ flexShrink: 0 }} onClick={e => toggle(cov.coverageKindId, e)}>
                      <i className={`fa-solid fa-chevron-${isCollapsed ? "right" : "down"}`} style={{ fontSize: 10 }} />
                    </button>
                  ) : (
                    <span style={{ width: 20, flexShrink: 0 }} />
                  )}
                  <span
                    className={`ct-check${cov.selected ? " ct-check--on" : ""}`}
                    style={{ flexShrink: 0, cursor: "pointer" }}
                    onClick={e => { e.stopPropagation(); toggleCovSelected(cov.coverageKindId); }}
                  >
                    {cov.selected && <i className="fa-solid fa-check" style={{ fontSize: 9, color: "#fff" }} />}
                  </span>
                  <span className="cst-tree-row__label">{cov.coverageName}</span>
                  {included > 0 && (
                    <span className={`cst-layer-count ${included === layers.length ? "cst-layer-count--full" : "cst-layer-count--partial"}`}>
                      {included}/{layers.length}
                    </span>
                  )}
                  {isSelected && <i className="fa-solid fa-chevron-right cst-tree-row__arrow" style={{ marginLeft: included > 0 ? 6 : "auto" }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- RIGHT: Tower ---- */}
        <div className="cst-tower-panel">
          {!selectedCov ? (
            <div className="cst-tower-empty">
              <i className="fa-solid fa-layer-group" style={{ fontSize: 32, color: "var(--fg-faint)" }} />
              <span>Select a coverage on the left to assign it to layers</span>
            </div>
          ) : (
            <>
              {/* Header: coverage title + stats */}
              <div className="cst-tower-header">
                <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  {(() => {
                    const chain = breadcrumbFor(selectedCov.coverageKindId, parentMapRef.current, covNameByIdRef.current);
                    const ancestors = chain.slice(0, -1); // exclude the leaf — it's shown big below
                    return ancestors.length > 0 && (
                      <span className="cst-tower-header__breadcrumb">
                        {ancestors.map((name, i) => (
                          <F key={i}>
                            {i > 0 && <i className="fa-solid fa-chevron-right cst-tower-header__breadcrumb-sep" />}
                            <span>{name}</span>
                          </F>
                        ))}
                      </span>
                    );
                  })()}
                  <span className="cst-tower-header__cov">{selectedCov.coverageName}</span>
                  <span className="cst-tower-header__stats">
                    {includedCount} of {layers.length} {includedCount === 1 ? "layer" : "layers"} included
                  </span>
                </div>
              </div>

              {/* Legend — moved to top (local test); pills reuse the real status-badge classes
                  (.cst-block-status-badge--*) since those are the actually-colorful part of a
                  block — the card backgrounds themselves are intentionally near-white. */}
              <div className="lc-legend cst-tower-legend">
                <span className="lc-legend__item cst-tower-legend__item"><span className="cst-block-status-badge cst-block-status-badge--included cst-legend-swatch">Included</span></span>
                <span className="lc-legend__item cst-tower-legend__item"><span className="cst-block-status-badge cst-block-status-badge--excluded cst-legend-swatch">Excluded</span></span>
                <span className="lc-legend__item cst-tower-legend__item"><span className="cst-block-status-badge cst-block-status-badge--locked cst-legend-swatch">Locked by cascade</span></span>
                <span className="lc-legend__item" style={{ marginLeft: "auto", color: "var(--fg-faint)", fontSize: 11 }}>
                  <i className="fa-solid fa-pencil" style={{ marginRight: 4 }} /> Use pencil icon to configure a layer block
                </span>
              </div>

              <div className="cst-filter-bar">
                <label className="cst-filter-toggle">
                  <input type="checkbox" checked={hideNonParticipating} onChange={e => setHideNonParticipating(e.target.checked)} />
                  <span>Hide non-participating layers</span>
                </label>
                <label className="cst-filter-toggle">
                  <input type="checkbox" checked={hideNonAssigned} onChange={e => setHideNonAssigned(e.target.checked)} />
                  <span>Hide non-assigned layers</span>
                </label>
              </div>

              {/* Tower */}
              <div className="cst-tower" style={{ minHeight: TOWER_HEIGHT_PX }}>
                {layers.filter(l => {
                  if (hideNonParticipating && !l.participating) return false;
                  if (hideNonAssigned && selectedCov) {
                    const li = layers.indexOf(l);
                    const a = getAssignment(selectedCov.coverageKindId, li);
                    if (a?.excluded) return false;
                    if (li > 0 && isCascadeLocked(selectedCov.coverageKindId, li, parentMapRef.current)) return false;
                  }
                  return true;
                }).map((layer, _fi) => {
                  const li = layers.indexOf(layer);
                  const assignment = getAssignment(selectedCov.coverageKindId, li) || {};
                  const isPrimary = li === 0;
                  const isExcluded = !isPrimary && assignment.excluded === true;
                  const isLocked = !isPrimary && isCascadeLocked(selectedCov.coverageKindId, li, parentMapRef.current);
                  const rangeSize = Math.max(0, (layer.rangeTo || 0) - (layer.rangeFrom || 0));
                  const heightFraction = totalRange > 0 ? rangeSize / totalRange : 1 / layers.length;
                  const blockHeight = Math.max(MIN_HEIGHT_PX, Math.round(heightFraction * TOWER_HEIGHT_PX));
                  const isActive = li === activeLayerIdx;
                  const isPanelOpen = panelTarget?.layerIdx === li;

                  let blockClass = "cst-layer-block";
                  if (isLocked) blockClass += " cst-layer-block--locked";
                  else if (isExcluded) blockClass += " cst-layer-block--excluded";
                  else blockClass += " cst-layer-block--included";
                  if (isActive) blockClass += " cst-layer-block--active";
                  if (!isLocked) blockClass += " cst-layer-block--readonly";

                  return (
                    <div
                      key={layer.id}
                      className={blockClass}
                      style={{ minHeight: blockHeight, outline: isPanelOpen ? "2px solid var(--accent)" : undefined }}
                    >
                      <div className="cst-block-head">
                        <span
                          className={`ls-type-badge ls-type-badge--${(layer.type || "excess").toLowerCase()}`}
                          style={{ fontSize: 10, padding: "2px 7px", cursor: "pointer" }}
                          onClick={e => { e.stopPropagation(); onLayerChange(li); }}
                        >
                          {layer.type || "Excess"}
                        </span>
                        <span
                          className="cst-block-name"
                          style={{ cursor: "pointer" }}
                          onClick={e => { e.stopPropagation(); onLayerChange(li); }}
                        >
                          {layer.name}
                        </span>
                        <span className="cst-block-range">{fmtShortRange(layer.rangeFrom, layer.rangeTo)}</span>
                        <span className={`cst-block-status-badge cst-block-status-badge--${isLocked ? "locked" : isExcluded ? "excluded" : "included"}`}>
                          {isLocked ? "Locked" : isExcluded ? "Excluded" : "Included"}
                        </span>

                        {/* Panel open/close — pencil icon only (disabled on Primary = read-only) */}
                        {!isLocked && !isPrimary && (
                          <button
                            className="cst-block-edit-btn"
                            title={isExcluded ? "Restore / configure" : "Edit coverage assignment"}
                            onClick={e => { e.stopPropagation(); isPanelOpen ? setPanelTarget(null) : openPanel(li); }}
                          >
                            {isExcluded
                              ? <i className="fa-solid fa-rotate-left" />
                              : <i className="fa-solid fa-pencil" />
                            }
                          </button>
                        )}
                      </div>

                      {/* Panel: read-only value summary for included non-locked blocks */}
                      {!isExcluded && !isLocked && (
                        <div className="cst-block-val-row">
                          <span><span className="cst-val-label">Sublimit </span><span className="cst-val-num">{assignment.sublimit ? fmtEUR(Number(assignment.sublimit)) : "—"}</span></span>
                          <span><span className="cst-val-label">Shared Sublimit </span><span className="cst-val-num">{assignment.sharedSublimit ? fmtEUR(Number(assignment.sharedSublimit)) : "—"}</span></span>
                          <span><span className="cst-val-label">Deductible </span><span className="cst-val-num">{assignment.deductible ? fmtEUR(Number(assignment.deductible)) : "—"}</span></span>
                          <span><span className="cst-val-label">Retro Cover </span><span className="cst-val-num">{assignment.retroDateYears ? `${assignment.retroDateYears}y` : "—"}</span></span>
                          <span><span className="cst-val-label">Indemnity </span><span className="cst-val-num">{assignment.indemnityPeriodValue ? `${assignment.indemnityPeriodValue} ${assignment.indemnityPeriodUnit === "HOUR" ? "h" : "mo"}` : "—"}</span></span>
                          <span><span className="cst-val-label">Waiting </span><span className="cst-val-num">{assignment.waitingPeriodValue ? `${assignment.waitingPeriodValue} ${assignment.waitingPeriodUnit === "HOUR" ? "h" : "mo"}` : "—"}</span></span>
                        </div>
                      )}

                      {/* Excluded (not locked) — empty body spacer */}
                      {isExcluded && !isLocked && (
                        <div style={{ padding: "10px 16px", fontSize: 12, color: "var(--fg-faint)" }}>
                          Not assigned to this layer
                        </div>
                      )}

                      {/* Status text for locked blocks */}
                      {isLocked && (
                        <span style={{ fontSize: 12, color: "var(--fg-faint)", padding: "10px 16px", display: "block" }}>
                          Excluded by cascade
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---- Edit Panel ---- */}
      {panelTarget !== null && panelLayer && selectedCov && (
        <div className="cst-panel-overlay">
          <div className="cst-panel">
            <div className="cst-panel__header">
              <div className="cst-panel__titles">
                <span className="cst-panel__layer">{panelLayer.name} · {fmtShortRange(panelLayer.rangeFrom, panelLayer.rangeTo)}</span>
                <span className="cst-panel__cov">{selectedCov.coverageName}</span>
              </div>
              <button className="drawer__close" onClick={() => setPanelTarget(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="cst-panel__body">
              {/* Inherit toggle — primary layer only */}
              {panelTarget?.layerIdx === 0 && (
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 12px", marginBottom: 8, borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                  onClick={() => setInheritToExcess(v => !v)}
                >
                  <span style={{ fontSize: 13, color: "var(--fg)" }}>Apply values to all excess layers on save</span>
                  <div className={`ls-toggle${inheritToExcess ? " ls-toggle--on" : ""}`}>
                    <div className="ls-toggle__track"><div className="ls-toggle__thumb" /></div>
                  </div>
                </div>
              )}
              {/* 1. Sublimit (agg) */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Sublimit (agg)</span>
                <EuroInput placeholder="e.g. 1.000.000"
                  value={panelDraft.sublimit || ""}
                  onChange={v => setPanelDraft(d => ({ ...d, sublimit: v }))} />
              </div>
              {/* 2. Shared Sublimit (agg) */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Shared Sublimit (agg)</span>
                <EuroInput placeholder="e.g. 500.000"
                  value={panelDraft.sharedSublimit || ""}
                  onChange={v => setPanelDraft(d => ({ ...d, sharedSublimit: v }))} />
              </div>
              {/* 3. Deductible (absolute) */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Deductible (absolute)</span>
                <EuroInput placeholder="e.g. 50.000"
                  value={panelDraft.deductible || ""}
                  onChange={v => setPanelDraft(d => ({ ...d, deductible: v }))} />
              </div>
              {/* 4. Retroactive Cover */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Retroactive Cover</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input className="cst-panel-input" style={{ flex: 1 }} placeholder="e.g. 3"
                    value={panelDraft.retroDateYears || ""}
                    onChange={e => setPanelDraft(d => ({ ...d, retroDateYears: e.target.value }))} />
                  <span style={{ fontSize: 13, color: "var(--fg-muted)", whiteSpace: "nowrap" }}>years</span>
                </div>
              </div>
              {/* 5. Indemnity Period */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Indemnity Period</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <input className="cst-panel-input" style={{ flex: 1 }} placeholder="e.g. 12"
                    value={panelDraft.indemnityPeriodValue || ""}
                    onChange={e => setPanelDraft(d => ({ ...d, indemnityPeriodValue: e.target.value }))} />
                  <select
                    style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 13, background: "var(--bg)", color: "var(--fg)", cursor: "pointer" }}
                    value={panelDraft.indemnityPeriodUnit || "MONTH"}
                    onChange={e => setPanelDraft(d => ({ ...d, indemnityPeriodUnit: e.target.value }))}>
                    <option value="HOUR">hours</option>
                    <option value="MONTH">months</option>
                  </select>
                </div>
              </div>
              {/* 6. Waiting Period */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Waiting Period</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <input className="cst-panel-input" style={{ flex: 1 }} placeholder="e.g. 8"
                    value={panelDraft.waitingPeriodValue || ""}
                    onChange={e => setPanelDraft(d => ({ ...d, waitingPeriodValue: e.target.value }))} />
                  <select
                    style={{ padding: "6px 8px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 13, background: "var(--bg)", color: "var(--fg)", cursor: "pointer" }}
                    value={panelDraft.waitingPeriodUnit || "HOUR"}
                    onChange={e => setPanelDraft(d => ({ ...d, waitingPeriodUnit: e.target.value }))}>
                    <option value="HOUR">hours</option>
                    <option value="MONTH">months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="cst-panel__footer">
              <button className="btn btn--primary" onClick={savePanel}>Save</button>
              {panelTarget && layers[panelTarget.layerIdx]?.type !== "Primary" && (() => {
                const li = panelTarget.layerIdx;
                const a = getAssignment(selectedCov?.coverageKindId, li) || {};
                return a.excluded
                  ? (
                    <button
                      className="btn btn--outline"
                      style={{ color: "var(--hdi-universal-green, #65a518)", borderColor: "var(--hdi-universal-green, #65a518)" }}
                      onClick={() => { setExcluded(selectedCov.coverageKindId, li, false); setPanelTarget(null); }}
                    >
                      Restore to layer
                    </button>
                  ) : (
                    <button
                      className="btn btn--outline"
                      style={{ color: "var(--hdi-bright-red, #e60018)", borderColor: "var(--hdi-bright-red, #e60018)" }}
                      onClick={() => { setExcluded(selectedCov.coverageKindId, li, true); setPanelTarget(null); }}
                    >
                      Exclude from layer
                    </button>
                  );
              })()}
              <button className="btn btn--outline" onClick={() => setPanelTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Coverage Spreading V2 — "List-Detail" variant
// Same data layer as V1, different UX: vertical layer cards + right-side drawer
// ============================================================================
function CoverageSpreadingV2Screen({ layers, activeLayerIdx, onLayerChange }) {
  const [coverageTree, setCoverageTree] = useS(null);
  const [collapsed, setCollapsed] = useS({});
  const [selectedKindId, setSelectedKindId] = useS(null);
  const [selectedCov, setSelectedCov] = useS(null);
  const [filter, setFilter] = useS("");
  const [drawerTarget, setDrawerTarget] = useS(null); // { layerIdx } | null
  const [drawerDraft, setDrawerDraft] = useS({});
  const [inheritToExcess, setInheritToExcess] = useS(false);
  const CARDS_PER_PAGE = 4;
  const [cardPage, setCardPage] = useS(0);
  const { getAssignment, setExcluded, setFields } = useSpreadingState();
  const parentMapRef = React.useRef({});

  useE(() => {
    fetch("coverage.json")
      .then(r => r.json())
      .then(data => {
        setCoverageTree(data);
        data.forEach(root => seedV2(root));
        parentMapRef.current = buildParentMapV2(data);
        const first = findFirstSelectedV2(data);
        if (first) { setSelectedKindId(first.coverageKindId); setSelectedCov(first); }
      })
      .catch(() => setCoverageTree([]));
  }, []);

  function seedV2(cov) {
    layers.forEach((_, li) => {
      const key = cov.coverageKindId + "_" + li;
      if (_spreadingAssignments[key] !== undefined) return;
      _spreadingAssignments[key] = {
        excluded: false, sublimit: "", sharedSublimit: "", deductible: "",
        retroDateYears: "", indemnityPeriodValue: "", indemnityPeriodUnit: "MONTH",
        waitingPeriodValue: "", waitingPeriodUnit: "HOUR",
      };
    });
    (cov.children || []).forEach(child => seedV2(child));
  }

  function buildParentMapV2(items, parentId = null, map = {}) {
    items.forEach(cov => {
      if (parentId) map[cov.coverageKindId] = parentId;
      if (cov.children?.length) buildParentMapV2(cov.children, cov.coverageKindId, map);
    });
    return map;
  }

  function isCascadeLockedV2(kindId, layerIdx, parentMap) {
    if (layerIdx === 0) return false;
    for (let j = 1; j < layerIdx; j++) {
      if (_spreadingAssignments[kindId + "_" + j]?.excluded === true) return true;
    }
    const parentId = parentMap[kindId];
    if (parentId) {
      if (_spreadingAssignments[parentId + "_" + layerIdx]?.excluded === true) return true;
      if (isCascadeLockedV2(parentId, layerIdx, parentMap)) return true;
    }
    return false;
  }

  function findFirstSelectedV2(items) {
    for (const item of items) {
      if (item.selected) return item;
      if (item.children) { const f = findFirstSelectedV2(item.children); if (f) return f; }
    }
    return null;
  }

  const toggleCovSelected = (kindId) => {
    const toggle = (items) => items.map(c =>
      c.coverageKindId === kindId ? { ...c, selected: !c.selected }
      : c.children ? { ...c, children: toggle(c.children) }
      : c
    );
    setCoverageTree(prev => toggle(prev));
  };

  const flattenTree = (items, depth) => {
    const rows = [];
    items.forEach(cov => {
      const hasChildren = cov.children && cov.children.length > 0;
      const matchesFilter = !filter || cov.coverageName.toLowerCase().includes(filter.toLowerCase());
      const descendantMatches = hasChildren && hasDescV2(cov, filter);
      if (filter && !matchesFilter && !descendantMatches) return;
      rows.push({ cov, depth, hasChildren, isCollapsed: !!collapsed[cov.coverageKindId] });
      if (hasChildren && !collapsed[cov.coverageKindId]) {
        rows.push(...flattenTree(cov.children, depth + 1));
      }
    });
    return rows;
  };

  function hasDescV2(cov, f) {
    if (!f || !cov.children) return false;
    return cov.children.some(c => c.coverageName.toLowerCase().includes(f.toLowerCase()) || hasDescV2(c, f));
  }

  // Layer status helper: green=included, red=excluded, gray=locked
  // (moved up so countIncluded and includedCount can use it)
  const dotStatus = (kindId, li) => {
    if (li > 0 && isCascadeLockedV2(kindId, li, parentMapRef.current)) return "locked";
    const a = getAssignment(kindId, li);
    if (a?.excluded) return "excluded";
    return "included";
  };

  const countIncluded = (kindId) =>
    layers.filter((_, li) => dotStatus(kindId, li) === "included").length;

  const toggle = (kindId, e) => { e.stopPropagation(); setCollapsed(c => ({ ...c, [kindId]: !c[kindId] })); };
  const selectCov = (cov) => { setSelectedKindId(cov.coverageKindId); setSelectedCov(cov); setDrawerTarget(null); };

  // Drawer open: copy assignment into draft
  const openDrawer = (li) => {
    const a = getAssignment(selectedCov.coverageKindId, li) || {};
    setDrawerDraft({
      sublimit: a.sublimit || "", sharedSublimit: a.sharedSublimit || "",
      deductible: a.deductible || "", retroDateYears: a.retroDateYears || "",
      indemnityPeriodValue: a.indemnityPeriodValue || "", indemnityPeriodUnit: a.indemnityPeriodUnit || "MONTH",
      waitingPeriodValue: a.waitingPeriodValue || "", waitingPeriodUnit: a.waitingPeriodUnit || "HOUR",
    });
    setDrawerTarget({ layerIdx: li });
    setInheritToExcess(false);
  };

  // Save drawer
  const saveDrawer = () => {
    if (!drawerTarget || !selectedCov) return;
    const li = drawerTarget.layerIdx;
    const fields = { ...drawerDraft };
    _spreadingAssignments[selectedCov.coverageKindId + "_" + li] = {
      ...(_spreadingAssignments[selectedCov.coverageKindId + "_" + li] || {}), ...fields
    };
    if (inheritToExcess && li === 0) {
      layers.forEach((_, exLi) => {
        if (exLi === 0) return;
        const k = selectedCov.coverageKindId + "_" + exLi;
        _spreadingAssignments[k] = { ...(_spreadingAssignments[k] || {}), ...fields };
      });
    }
    _saveSpreadingToLS();
    _spreadingListeners.forEach(fn => fn());
    setDrawerTarget(null);
  };

  const treeRows = coverageTree ? flattenTree(coverageTree, 0) : [];
  const includedCount = selectedCov
    ? layers.filter((_, li) => dotStatus(selectedCov.coverageKindId, li) === "included").length
    : 0;

  if (!coverageTree) return <div className="main__title">Coverage Spreading (Cyber)</div>;

  const drawerLayer = drawerTarget != null ? layers[drawerTarget.layerIdx] : null;

  return (
    <div className="csv2-root">
      <div className="main__title">Coverage Spreading (Cyber)</div>
      <p className="main__subtitle" style={{ marginTop: -12, marginBottom: 20 }}>
        Select a coverage on the left, then assign it to layers and configure limits on the right.
      </p>

      <div className="csv2-layout">
        {/* ---- LEFT: Coverage tree ---- */}
        <div className="csv2-tree-panel">
          <div className="csv2-tree-header">
            <span className="csv2-tree-header__title">Coverages</span>
            <div className="pc-search" style={{ minWidth: 0, flex: 1 }}>
              <i className="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder="Filter…" value={filter} onChange={e => setFilter(e.target.value)} />
            </div>
          </div>

          {/* Layer column headers */}
          <div className="csv2-tree-col-headers">
            <span className="csv2-col-label">layer status →</span>
            <span className="csv2-col-dots-block">
              {layers.map((l, li) => (
                <span key={li} className="csv2-col-dot-header" title={l.name}>
                  {li === 0 ? "P" : `XS${li}`}
                </span>
              ))}
            </span>
            <span className="csv2-col-count-spacer" />
          </div>

          <div className="csv2-tree-scroll">
            {treeRows.map(({ cov, depth, hasChildren, isCollapsed }) => {
              const included = countIncluded(cov.coverageKindId);
              const isSelected = cov.coverageKindId === selectedKindId;
              return (
                <div
                  key={cov.coverageKindId}
                  className={`csv2-tree-row${cov.selected ? " csv2-tree-row--checked" : ""}${isSelected ? " csv2-tree-row--selected" : ""}`}
                  style={{ paddingLeft: 12 + depth * 22 }}
                  onClick={() => selectCov(cov)}
                >
                  {hasChildren ? (
                    <button className="ct-chevron" style={{ flexShrink: 0 }} onClick={e => toggle(cov.coverageKindId, e)}>
                      <i className={`fa-solid fa-chevron-${isCollapsed ? "right" : "down"}`} style={{ fontSize: 10 }} />
                    </button>
                  ) : (
                    <span style={{ width: 20, flexShrink: 0 }} />
                  )}
                  <span
                    className={`ct-check${cov.selected ? " ct-check--on" : ""}`}
                    style={{ flexShrink: 0, cursor: "pointer" }}
                    onClick={e => { e.stopPropagation(); toggleCovSelected(cov.coverageKindId); }}
                  >
                    {cov.selected && <i className="fa-solid fa-check" style={{ fontSize: 9, color: "#fff" }} />}
                  </span>
                  <span className="csv2-tree-row__label">{cov.coverageName}</span>

                  {/* Per-layer status dots */}
                  <span className="csv2-dots">
                    {layers.map((_, li) => (
                      <span key={li} className={`csv2-dot csv2-dot--${dotStatus(cov.coverageKindId, li)}`} />
                    ))}
                  </span>

                  <span className={`csv2-layer-count ${included === layers.length ? "csv2-layer-count--full" : "csv2-layer-count--partial"}`}>
                    {included}/{layers.length}
                  </span>

                  {isSelected && <i className="fa-solid fa-chevron-right csv2-tree-row__arrow" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- RIGHT: Layer cards ---- */}
        <div className="csv2-detail-panel">
          {!selectedCov ? (
            <div className="csv2-empty">
              <i className="fa-solid fa-layer-group" style={{ fontSize: 32, color: "var(--fg-faint)" }} />
              <span>Select a coverage on the left to assign it to layers</span>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="csv2-detail-header">
                <span className="csv2-detail-header__cov">{selectedCov.coverageName}</span>
                <span className="csv2-detail-header__stats">
                  {includedCount} of {layers.length} {includedCount === 1 ? "layer" : "layers"} included
                </span>
              </div>

              {/* Layer pill tabs (within detail panel) */}
              <div className="csv2-layer-pills">
                {layers.map((l, li) => {
                  const status = dotStatus(selectedCov.coverageKindId, li);
                  return (
                    <span
                      key={li}
                      className={`csv2-pill csv2-pill--${status}${li === activeLayerIdx ? " csv2-pill--active" : ""}`}
                      onClick={() => {
                        onLayerChange(li);
                        // Auto-jump to the page containing this layer
                        const reversedIdx = layers.length - 1 - li;
                        setCardPage(Math.floor(reversedIdx / CARDS_PER_PAGE));
                      }}
                    >
                      <span className={`csv2-pill__dot csv2-pill__dot--${status}`} />
                      {l.name} <span className="csv2-pill__range">{fmtShortRange(l.rangeFrom, l.rangeTo)}</span>
                    </span>
                  );
                })}
              </div>

              {/* Card stack — paginated, reversed so Primary is at bottom visually */}
              {(() => {
                const reversedLayers = [...layers].reverse();
                const totalPages = Math.ceil(reversedLayers.length / CARDS_PER_PAGE);
                const safePage = Math.min(cardPage, totalPages - 1);
                const pageStart = safePage * CARDS_PER_PAGE;
                const pageLayers = reversedLayers.slice(pageStart, pageStart + CARDS_PER_PAGE);

                return (
                  <>
                    <div className="csv2-card-stack">
                      {pageLayers.map((layer, pIdx) => {
                        const revIdx = pageStart + pIdx;
                        const li = layers.length - 1 - revIdx;
                        const assignment = getAssignment(selectedCov.coverageKindId, li) || {};
                        const isPrimary = li === 0;
                        const isExcluded = !isPrimary && assignment.excluded === true;
                        const isLocked = !isPrimary && isCascadeLockedV2(selectedCov.coverageKindId, li, parentMapRef.current);
                        const isDrawerOpen = drawerTarget?.layerIdx === li;

                        let cardClass = "csv2-card";
                        if (isLocked) cardClass += " csv2-card--locked";
                        else if (isExcluded) cardClass += " csv2-card--excluded";
                        else cardClass += " csv2-card--included";
                        if (isDrawerOpen) cardClass += " csv2-card--editing";

                        return (
                          <div key={layer.id} className={cardClass}>
                            {/* Card header */}
                            <div className="csv2-card__header">
                              <span className={`ls-type-badge ls-type-badge--${(layer.type || "excess").toLowerCase()}`}>
                                {layer.type || "Excess"}
                              </span>
                              <span className="csv2-card__name">{layer.name}</span>
                              <span className="csv2-card__range">{fmtShortRange(layer.rangeFrom, layer.rangeTo)}</span>
                              <span className={`csv2-card__status csv2-card__status--${isLocked ? "locked" : isExcluded ? "excluded" : "included"}`}>
                                {isLocked ? "Locked" : isExcluded ? "Excluded" : "Included"}
                              </span>
                              {!isLocked && (
                                <button
                                  className="csv2-card__edit-btn"
                                  title={isExcluded ? "Restore / configure" : "Edit coverage limits"}
                                  onClick={() => isDrawerOpen ? setDrawerTarget(null) : openDrawer(li)}
                                >
                                  <i className={`fa-solid fa-${isExcluded ? "rotate-left" : "pencil"}`} />
                                </button>
                              )}
                            </div>

                            {/* Card body — value grid for included, message for excluded/locked */}
                            {!isExcluded && !isLocked && (
                              <div className="csv2-card__body">
                                <div className="csv2-val-grid">
                                  <span className="csv2-val-label">SUBLIMIT</span>
                                  <span className="csv2-val-value">{assignment.sublimit ? fmtEUR(Number(assignment.sublimit)) : "—"}</span>
                                  <span className="csv2-val-label">SHARED SUBLIMIT</span>
                                  <span className="csv2-val-value">{assignment.sharedSublimit ? fmtEUR(Number(assignment.sharedSublimit)) : "—"}</span>
                                  <span className="csv2-val-label">DEDUCTIBLE</span>
                                  <span className="csv2-val-value">{assignment.deductible ? fmtEUR(Number(assignment.deductible)) : "—"}</span>
                                  <span className="csv2-val-label">RETRO COVER</span>
                                  <span className="csv2-val-value">{assignment.retroDateYears ? `${assignment.retroDateYears} years` : "—"}</span>
                                  <span className="csv2-val-label">INDEMNITY</span>
                                  <span className="csv2-val-value">{assignment.indemnityPeriodValue ? `${assignment.indemnityPeriodValue} ${assignment.indemnityPeriodUnit === "HOUR" ? "hours" : "months"}` : "—"}</span>
                                  <span className="csv2-val-label">WAITING</span>
                                  <span className="csv2-val-value">{assignment.waitingPeriodValue ? `${assignment.waitingPeriodValue} ${assignment.waitingPeriodUnit === "HOUR" ? "hours" : "months"}` : "—"}</span>
                                </div>
                              </div>
                            )}
                            {isExcluded && !isLocked && (
                              <div className="csv2-card__body csv2-card__body--muted">
                                Excluded by cascade
                              </div>
                            )}
                            {isLocked && (
                              <div className="csv2-card__body csv2-card__body--muted">
                                Excluded by cascade
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="csv2-pagination">
                        <button
                          className="csv2-page-arrow"
                          disabled={safePage === 0}
                          onClick={() => setCardPage(p => Math.max(0, p - 1))}
                        >
                          <i className="fa-solid fa-chevron-left" />
                        </button>

                        {Array.from({ length: totalPages }, (_, pi) => {
                          // Show max 2 page buttons around current page
                          if (pi < safePage - 1 || pi > safePage + 1) return null;
                          // Short label: just page number
                          return (
                            <button
                              key={pi}
                              className={`csv2-page-btn${pi === safePage ? " csv2-page-btn--active" : ""}`}
                              onClick={() => setCardPage(pi)}
                            >
                              {pi + 1}
                            </button>
                          );
                        })}

                        <button
                          className="csv2-page-arrow"
                          disabled={safePage >= totalPages - 1}
                          onClick={() => setCardPage(p => Math.min(totalPages - 1, p + 1))}
                        >
                          <i className="fa-solid fa-chevron-right" />
                        </button>

                        <span className="csv2-page-info">
                          {safePage + 1} / {totalPages}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Legend */}
              <div className="lc-legend" style={{ marginTop: 16 }}>
                <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--included" /> Included</span>
                <span className="lc-legend__item"><span className="lc-legend__dot lc-legend__dot--excluded" /> Excluded</span>
                <span className="lc-legend__item">
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#e0e0e0", marginRight: 5 }} />
                  Locked by cascade
                </span>
                <span className="lc-legend__item" style={{ marginLeft: "auto", color: "var(--fg-faint)", fontSize: 11 }}>
                  <i className="fa-solid fa-pencil" style={{ marginRight: 4 }} /> Use pencil icon to configure a layer block
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---- Right-side drawer (slides from right edge) ---- */}
      {drawerTarget !== null && drawerLayer && selectedCov && (
        <div className="csv2-drawer-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setDrawerTarget(null); }}>
          <div className="csv2-drawer">
            <div className="csv2-drawer__header">
              <div className="csv2-drawer__titles">
                <span className="csv2-drawer__layer">
                  {drawerLayer.type || "Excess"} Layer {drawerTarget.layerIdx > 0 ? drawerTarget.layerIdx : ""} · {fmtShortRange(drawerLayer.rangeFrom, drawerLayer.rangeTo)}
                </span>
                <span className="csv2-drawer__cov">{selectedCov.coverageName}</span>
              </div>
              <button className="drawer__close" onClick={() => setDrawerTarget(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="csv2-drawer__body">
              {/* Inherit toggle — primary layer only */}
              {drawerTarget?.layerIdx === 0 && (
                <div className="csv2-inherit-toggle" onClick={() => setInheritToExcess(v => !v)}>
                  <span>Apply values to all excess layers on save</span>
                  <div className={`ls-toggle${inheritToExcess ? " ls-toggle--on" : ""}`}>
                    <div className="ls-toggle__track"><div className="ls-toggle__thumb" /></div>
                  </div>
                </div>
              )}
              {/* Fields */}
              <div className="csv2-drawer__field">
                <span className="csv2-drawer__field-label">Sublimit (agg)</span>
                <div className="csv2-drawer__field-input">
                  <span className="csv2-drawer__currency">€</span>
                  <input placeholder="e.g. 1,000,000" value={drawerDraft.sublimit || ""}
                    onChange={e => setDrawerDraft(d => ({ ...d, sublimit: e.target.value }))} />
                </div>
              </div>
              <div className="csv2-drawer__field">
                <span className="csv2-drawer__field-label">Shared Sublimit (agg)</span>
                <div className="csv2-drawer__field-input">
                  <span className="csv2-drawer__currency">€</span>
                  <input placeholder="e.g. 500,000" value={drawerDraft.sharedSublimit || ""}
                    onChange={e => setDrawerDraft(d => ({ ...d, sharedSublimit: e.target.value }))} />
                </div>
              </div>
              <div className="csv2-drawer__field">
                <span className="csv2-drawer__field-label">Deductible (absolute)</span>
                <div className="csv2-drawer__field-input">
                  <span className="csv2-drawer__currency">€</span>
                  <input placeholder="e.g. 50,000" value={drawerDraft.deductible || ""}
                    onChange={e => setDrawerDraft(d => ({ ...d, deductible: e.target.value }))} />
                </div>
              </div>
              <div className="csv2-drawer__field">
                <span className="csv2-drawer__field-label">Retroactive Cover</span>
                <div className="csv2-drawer__field-input csv2-drawer__field-input--with-unit">
                  <input placeholder="e.g. 3" value={drawerDraft.retroDateYears || ""}
                    onChange={e => setDrawerDraft(d => ({ ...d, retroDateYears: e.target.value }))} />
                  <span className="csv2-drawer__unit">years</span>
                </div>
              </div>
              <div className="csv2-drawer__field">
                <span className="csv2-drawer__field-label">Indemnity Period</span>
                <div className="csv2-drawer__field-input csv2-drawer__field-input--with-unit">
                  <input placeholder="e.g. 12" value={drawerDraft.indemnityPeriodValue || ""}
                    onChange={e => setDrawerDraft(d => ({ ...d, indemnityPeriodValue: e.target.value }))} />
                  <select value={drawerDraft.indemnityPeriodUnit || "MONTH"}
                    onChange={e => setDrawerDraft(d => ({ ...d, indemnityPeriodUnit: e.target.value }))}>
                    <option value="HOUR">hours</option>
                    <option value="MONTH">months</option>
                  </select>
                </div>
              </div>
              <div className="csv2-drawer__field">
                <span className="csv2-drawer__field-label">Waiting Period</span>
                <div className="csv2-drawer__field-input csv2-drawer__field-input--with-unit">
                  <input placeholder="e.g. 8" value={drawerDraft.waitingPeriodValue || ""}
                    onChange={e => setDrawerDraft(d => ({ ...d, waitingPeriodValue: e.target.value }))} />
                  <select value={drawerDraft.waitingPeriodUnit || "HOUR"}
                    onChange={e => setDrawerDraft(d => ({ ...d, waitingPeriodUnit: e.target.value }))}>
                    <option value="HOUR">hours</option>
                    <option value="MONTH">months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="csv2-drawer__footer">
              <button className="btn btn--primary" onClick={saveDrawer}>Save</button>
              {drawerTarget && layers[drawerTarget.layerIdx]?.type !== "Primary" && (() => {
                const li = drawerTarget.layerIdx;
                const a = getAssignment(selectedCov?.coverageKindId, li) || {};
                return a.excluded
                  ? (
                    <button className="btn btn--outline" style={{ color: "var(--hdi-universal-green, #65a518)", borderColor: "var(--hdi-universal-green, #65a518)" }}
                      onClick={() => { setExcluded(selectedCov.coverageKindId, li, false); setDrawerTarget(null); }}>
                      Restore to layer
                    </button>
                  ) : (
                    <button className="btn btn--outline" style={{ color: "var(--hdi-bright-red, #e60018)", borderColor: "var(--hdi-bright-red, #e60018)" }}
                      onClick={() => { setExcluded(selectedCov.coverageKindId, li, true); setDrawerTarget(null); }}>
                      Exclude from layer
                    </button>
                  );
              })()}
              <button className="btn btn--outline" onClick={() => setDrawerTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// COVERAGE SPREADING V3 — Layer-first navigation (tab per layer, full tree below)
// =========================================================================
function CoverageSpreadingV3Screen({ layers, activeLayerIdx, onLayerChange }) {
  const [coverageTree, setCoverageTree] = useS(null);
  const [collapsed, setCollapsed] = useS({});
  const [filter, setFilter] = useS("");
  const [expandedKindId, setExpandedKindId] = useS(null); // accordion: which node is editing
  const [editDraft, setEditDraft] = useS({});
  const [inheritToExcess, setInheritToExcess] = useS(false);
  const { getAssignment, setExcluded, setFields } = useSpreadingState();
  const parentMapRef = React.useRef({});

  useE(() => {
    fetch("coverage.json")
      .then(r => r.json())
      .then(data => {
        setCoverageTree(data);
        data.forEach(root => seedV3(root));
        parentMapRef.current = buildParentMapV3(data);
      })
      .catch(() => setCoverageTree([]));
  }, []);

  function seedV3(cov) {
    layers.forEach((_, li) => {
      const key = cov.coverageKindId + "_" + li;
      if (_spreadingAssignments[key] !== undefined) return;
      _spreadingAssignments[key] = {
        excluded: false, sublimit: "", sharedSublimit: "", deductible: "",
        retroDateYears: "", indemnityPeriodValue: "", indemnityPeriodUnit: "MONTH",
        waitingPeriodValue: "", waitingPeriodUnit: "HOUR",
      };
    });
    (cov.children || []).forEach(child => seedV3(child));
  }

  function buildParentMapV3(items, parentId = null, map = {}) {
    items.forEach(cov => {
      if (parentId) map[cov.coverageKindId] = parentId;
      if (cov.children?.length) buildParentMapV3(cov.children, cov.coverageKindId, map);
    });
    return map;
  }

  function isCascadeLockedV3(kindId, layerIdx, parentMap) {
    if (layerIdx === 0) return false;
    for (let j = 1; j < layerIdx; j++) {
      if (_spreadingAssignments[kindId + "_" + j]?.excluded === true) return true;
    }
    const parentId = parentMap[kindId];
    if (parentId) {
      if (_spreadingAssignments[parentId + "_" + layerIdx]?.excluded === true) return true;
      if (isCascadeLockedV3(parentId, layerIdx, parentMap)) return true;
    }
    return false;
  }

  const getStatus = (kindId, li) => {
    if (li > 0 && isCascadeLockedV3(kindId, li, parentMapRef.current)) return "locked";
    const a = getAssignment(kindId, li);
    if (a?.excluded) return "excluded";
    return "included";
  };

  const toggleCollapse = (kindId, e) => {
    e.stopPropagation();
    setCollapsed(c => ({ ...c, [kindId]: !c[kindId] }));
  };

  // Toggle include/exclude for current layer
  const toggleExclude = (kindId, e) => {
    e.stopPropagation();
    const status = getStatus(kindId, activeLayerIdx);
    if (status === "locked") return;
    const a = getAssignment(kindId, activeLayerIdx);
    setExcluded(kindId, activeLayerIdx, !(a?.excluded));
  };

  // Accordion: open/close edit form
  const toggleAccordion = (kindId) => {
    if (expandedKindId === kindId) {
      setExpandedKindId(null);
    } else {
      const a = getAssignment(kindId, activeLayerIdx) || {};
      setEditDraft({
        sublimit: a.sublimit || "", sharedSublimit: a.sharedSublimit || "",
        deductible: a.deductible || "", retroDateYears: a.retroDateYears || "",
        indemnityPeriodValue: a.indemnityPeriodValue || "", indemnityPeriodUnit: a.indemnityPeriodUnit || "MONTH",
        waitingPeriodValue: a.waitingPeriodValue || "", waitingPeriodUnit: a.waitingPeriodUnit || "HOUR",
      });
      setExpandedKindId(kindId);
      setInheritToExcess(false);
    }
  };

  // Save accordion form
  const saveAccordion = () => {
    if (!expandedKindId) return;
    const fields = { ...editDraft };
    const key = expandedKindId + "_" + activeLayerIdx;
    _spreadingAssignments[key] = { ...(_spreadingAssignments[key] || {}), ...fields };
    if (inheritToExcess && activeLayerIdx === 0) {
      layers.forEach((_, li) => {
        if (li === 0) return;
        const k = expandedKindId + "_" + li;
        _spreadingAssignments[k] = { ...(_spreadingAssignments[k] || {}), ...fields };
      });
    }
    _saveSpreadingToLS();
    _spreadingListeners.forEach(fn => fn());
    setExpandedKindId(null);
  };

  function hasDescV3(cov, f) {
    if (!f || !cov.children) return false;
    return cov.children.some(c => c.coverageName.toLowerCase().includes(f.toLowerCase()) || hasDescV3(c, f));
  }

  const flattenTree = (items, depth) => {
    const rows = [];
    items.forEach(cov => {
      const hasChildren = cov.children && cov.children.length > 0;
      const matchesFilter = !filter || cov.coverageName.toLowerCase().includes(filter.toLowerCase());
      const descendantMatches = hasChildren && hasDescV3(cov, filter);
      if (filter && !matchesFilter && !descendantMatches) return;
      rows.push({ cov, depth, hasChildren, isCollapsed: !!collapsed[cov.coverageKindId] });
      if (hasChildren && !collapsed[cov.coverageKindId]) {
        rows.push(...flattenTree(cov.children, depth + 1));
      }
    });
    return rows;
  };

  const treeRows = coverageTree ? flattenTree(coverageTree, 0) : [];
  const activeLayer = layers[activeLayerIdx];

  if (!coverageTree) return <div className="main__title">Coverage Spreading V3 (Cyber)</div>;

  // Summary counts for current layer
  const includedCount = treeRows.filter(r => getStatus(r.cov.coverageKindId, activeLayerIdx) === "included").length;
  const excludedCount = treeRows.filter(r => getStatus(r.cov.coverageKindId, activeLayerIdx) === "excluded").length;
  const lockedCount = treeRows.filter(r => getStatus(r.cov.coverageKindId, activeLayerIdx) === "locked").length;

  return (
    <div className="csv3-root">
      <div className="main__title">Coverage Spreading V3 (Cyber)</div>
      <p className="main__subtitle" style={{ marginTop: -12, marginBottom: 20 }}>
        Select a layer to configure its coverage assignments. Each tab shows the full tree for that layer.
      </p>

      {/* Layer tabs */}
      <div className="csv3-layer-tabs">
        {layers.map((l, li) => (
          <button
            key={li}
            className={`csv3-tab${li === activeLayerIdx ? " csv3-tab--active" : ""}`}
            onClick={() => { onLayerChange(li); setExpandedKindId(null); }}
          >
            <span className={`csv3-tab__type csv3-tab__type--${l.type.toLowerCase()}`}>
              {l.type === "Primary" ? "P" : `XS${li}`}
            </span>
            <span className="csv3-tab__name">{l.name}</span>
            <span className="csv3-tab__range">{fmtShortRange(l.rangeFrom, l.rangeTo)}</span>
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="csv3-summary-bar">
        <span className="csv3-summary-item csv3-summary-item--included">
          <i className="fa-solid fa-circle-check" /> {includedCount} included
        </span>
        <span className="csv3-summary-item csv3-summary-item--excluded">
          <i className="fa-solid fa-circle-xmark" /> {excludedCount} excluded
        </span>
        {lockedCount > 0 && (
          <span className="csv3-summary-item csv3-summary-item--locked">
            <i className="fa-solid fa-lock" /> {lockedCount} inherited
          </span>
        )}
        <span className="csv3-summary-spacer" />
        <div className="pc-search" style={{ minWidth: 0, maxWidth: 220 }}>
          <i className="fa-solid fa-magnifying-glass" />
          <input type="text" placeholder="Filter coverages…" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </div>

      {/* Coverage tree for active layer */}
      <div className="csv3-tree">
        {treeRows.map(({ cov, depth, hasChildren, isCollapsed }) => {
          const kindId = cov.coverageKindId;
          const status = getStatus(kindId, activeLayerIdx);
          const isExpanded = expandedKindId === kindId;
          const assignment = getAssignment(kindId, activeLayerIdx) || {};
          const hasSublimit = assignment.sublimit && Number(assignment.sublimit) > 0;
          const hasDeductible = assignment.deductible && Number(assignment.deductible) > 0;

          return (
            <React.Fragment key={kindId}>
              <div
                className={`csv3-row csv3-row--${status}${isExpanded ? " csv3-row--expanded" : ""}`}
                style={{ paddingLeft: 16 + depth * 24 }}
              >
                {/* Expand/collapse tree */}
                {hasChildren ? (
                  <button className="ct-chevron" onClick={e => toggleCollapse(kindId, e)}>
                    <i className={`fa-solid fa-chevron-${isCollapsed ? "right" : "down"}`} style={{ fontSize: 10 }} />
                  </button>
                ) : (
                  <span style={{ width: 20, flexShrink: 0 }} />
                )}

                {/* Include/Exclude toggle pill */}
                <button
                  className={`csv3-toggle csv3-toggle--${status}`}
                  onClick={e => toggleExclude(kindId, e)}
                  disabled={status === "locked"}
                  title={status === "locked" ? "Inherited from parent/earlier layer" : status === "excluded" ? "Click to include" : "Click to exclude"}
                >
                  {status === "included" && <i className="fa-solid fa-check" style={{ fontSize: 9 }} />}
                  {status === "excluded" && <i className="fa-solid fa-xmark" style={{ fontSize: 9 }} />}
                  {status === "locked" && <i className="fa-solid fa-lock" style={{ fontSize: 8 }} />}
                </button>

                {/* Coverage name */}
                <span className="csv3-row__name">{cov.coverageName}</span>

                {/* Inline field summary (when included and has values) */}
                {status === "included" && (hasSublimit || hasDeductible) && (
                  <span className="csv3-row__summary">
                    {hasSublimit && <span className="csv3-tag">Lim: {fmtEUR(Number(assignment.sublimit))}</span>}
                    {hasDeductible && <span className="csv3-tag">Ded: {fmtEUR(Number(assignment.deductible))}</span>}
                  </span>
                )}

                {/* Status label for locked/excluded */}
                {status === "locked" && <span className="csv3-row__status csv3-row__status--locked">Inherited</span>}

                {/* Edit button (only for included coverages) */}
                {status === "included" && (
                  <button
                    className={`csv3-edit-btn${isExpanded ? " csv3-edit-btn--active" : ""}`}
                    onClick={e => { e.stopPropagation(); toggleAccordion(kindId); }}
                    title="Configure coverage"
                  >
                    <i className={`fa-solid fa-${isExpanded ? "chevron-up" : "pen"}`} style={{ fontSize: 11 }} />
                  </button>
                )}
              </div>

              {/* Accordion edit form */}
              {isExpanded && status === "included" && (
                <div className="csv3-accordion" style={{ marginLeft: 16 + depth * 24 + 20 }}>
                  <div className="csv3-accordion__grid">
                    <div className="csv3-field">
                      <label className="csv3-field__label">Sublimit</label>
                      <input className="form-input" type="number" placeholder="—"
                        value={editDraft.sublimit} onChange={e => setEditDraft(d => ({ ...d, sublimit: e.target.value }))} />
                    </div>
                    <div className="csv3-field">
                      <label className="csv3-field__label">Shared Sublimit</label>
                      <input className="form-input" type="number" placeholder="—"
                        value={editDraft.sharedSublimit} onChange={e => setEditDraft(d => ({ ...d, sharedSublimit: e.target.value }))} />
                    </div>
                    <div className="csv3-field">
                      <label className="csv3-field__label">Deductible</label>
                      <input className="form-input" type="number" placeholder="—"
                        value={editDraft.deductible} onChange={e => setEditDraft(d => ({ ...d, deductible: e.target.value }))} />
                    </div>
                    <div className="csv3-field">
                      <label className="csv3-field__label">Retro Date (Years)</label>
                      <input className="form-input" type="number" placeholder="—"
                        value={editDraft.retroDateYears} onChange={e => setEditDraft(d => ({ ...d, retroDateYears: e.target.value }))} />
                    </div>
                    <div className="csv3-field">
                      <label className="csv3-field__label">Indemnity Period</label>
                      <div className="csv3-field__combo">
                        <input className="form-input" type="number" placeholder="—" style={{ flex: 1 }}
                          value={editDraft.indemnityPeriodValue} onChange={e => setEditDraft(d => ({ ...d, indemnityPeriodValue: e.target.value }))} />
                        <select className="form-input form-select" style={{ width: 90 }}
                          value={editDraft.indemnityPeriodUnit} onChange={e => setEditDraft(d => ({ ...d, indemnityPeriodUnit: e.target.value }))}>
                          <option value="MONTH">Months</option>
                          <option value="HOUR">Hours</option>
                        </select>
                      </div>
                    </div>
                    <div className="csv3-field">
                      <label className="csv3-field__label">Waiting Period</label>
                      <div className="csv3-field__combo">
                        <input className="form-input" type="number" placeholder="—" style={{ flex: 1 }}
                          value={editDraft.waitingPeriodValue} onChange={e => setEditDraft(d => ({ ...d, waitingPeriodValue: e.target.value }))} />
                        <select className="form-input form-select" style={{ width: 90 }}
                          value={editDraft.waitingPeriodUnit} onChange={e => setEditDraft(d => ({ ...d, waitingPeriodUnit: e.target.value }))}>
                          <option value="MONTH">Months</option>
                          <option value="HOUR">Hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Inherit toggle (only on Primary layer) */}
                  {activeLayerIdx === 0 && (
                    <label className="csv3-inherit-toggle">
                      <input type="checkbox" checked={inheritToExcess} onChange={e => setInheritToExcess(e.target.checked)} />
                      <span>Apply values to all excess layers on save</span>
                    </label>
                  )}

                  <div className="csv3-accordion__actions">
                    <button className="btn btn--primary" onClick={saveAccordion}>Save</button>
                    <button className="btn btn--outline" onClick={() => setExpandedKindId(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="csv3-legend">
        <span className="csv3-legend__item"><span className="csv3-toggle csv3-toggle--included" style={{ width: 16, height: 16 }}><i className="fa-solid fa-check" style={{ fontSize: 8 }} /></span> Included</span>
        <span className="csv3-legend__item"><span className="csv3-toggle csv3-toggle--excluded" style={{ width: 16, height: 16 }}><i className="fa-solid fa-xmark" style={{ fontSize: 8 }} /></span> Excluded</span>
        <span className="csv3-legend__item"><span className="csv3-toggle csv3-toggle--locked" style={{ width: 16, height: 16 }}><i className="fa-solid fa-lock" style={{ fontSize: 7 }} /></span> Inherited (locked)</span>
      </div>
    </div>
  );
}

function LiabilityCoverageScreen({ layers, activeLayerIdx, onLayerChange }) {
  const { state, updateContract, updateCoverage, addCoverage, removeCoverage } = useLiabState(layers, activeLayerIdx);
  const activeLayer = layers[activeLayerIdx];
  const [showAdd, setShowAdd] = useS(false);
  const [newName, setNewName] = useS("");

  const fmtNum = (n) => {
    if (!n && n !== 0) return "";
    return Number(n).toLocaleString("en-US");
  };

  return (
    <div>
      <div className="main__title">
        Coverage (Liability)
        <span className="main__title-badge">{activeLayer.name}</span>
      </div>

      {/* Contract Limits and Deductibles */}
      <div className="prop-section">
        <h2 className="prop-section__title">Contract Limits and Deductibles</h2>
        <table className="prop-tbl">
          <thead>
            <tr>
              <th className="prop-tbl__th" rowSpan="2">Program Structure</th>
              <th className="prop-tbl__th" colSpan="4" style={{ textAlign: "center", borderBottom: "1px solid var(--border)" }}>Limits</th>
              <th className="prop-tbl__th" colSpan="3" style={{ textAlign: "center", borderBottom: "1px solid var(--border)" }}>Deductibles</th>
            </tr>
            <tr>
              <th className="prop-tbl__th">ToI</th>
              <th className="prop-tbl__th">Occ</th>
              <th className="prop-tbl__th">Max</th>
              <th className="prop-tbl__th">Agg</th>
              <th className="prop-tbl__th">ToI</th>
              <th className="prop-tbl__th">Value</th>
              <th className="prop-tbl__th">PoL</th>
            </tr>
          </thead>
          <tbody>
            <tr className="prop-tbl__row">
              <td className="prop-tbl__td prop-tbl__td--name">{state.contract.program}</td>
              <td className="prop-tbl__td"><span className="prop-badge">{state.contract.toi}</span></td>
              <td className="prop-tbl__td">{fmtNum(state.contract.occ)}</td>
              <td className="prop-tbl__td">{state.contract.max}</td>
              <td className="prop-tbl__td">{fmtNum(state.contract.agg)}</td>
              <td className="prop-tbl__td"><span className="prop-badge">{state.contract.dedToi}</span></td>
              <td className="prop-tbl__td">{fmtNum(state.contract.dedValue)}</td>
              <td className="prop-tbl__td">{state.contract.pol ? "✓" : "✕"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Coverages Limits and Deductibles */}
      <div className="prop-section" style={{ marginTop: 32 }}>
        <h2 className="prop-section__title">Coverages Limits and Deductibles</h2>
        <table className="prop-tbl">
          <thead>
            <tr>
              <th className="prop-tbl__th" rowSpan="2">Coverages</th>
              <th className="prop-tbl__th" colSpan="4" style={{ textAlign: "center", borderBottom: "1px solid var(--border)" }}>Limits</th>
              <th className="prop-tbl__th" colSpan="2" style={{ textAlign: "center", borderBottom: "1px solid var(--border)" }}>Deductibles</th>
              <th className="prop-tbl__th" rowSpan="2"></th>
            </tr>
            <tr>
              <th className="prop-tbl__th">ToI</th>
              <th className="prop-tbl__th">Occ</th>
              <th className="prop-tbl__th">Max</th>
              <th className="prop-tbl__th">Agg</th>
              <th className="prop-tbl__th">ToI</th>
              <th className="prop-tbl__th">Value</th>
            </tr>
          </thead>
          <tbody>
            {state.coverages.map(cov => (
              <tr key={cov.id} className="prop-tbl__row">
                <td className="prop-tbl__td prop-tbl__td--name">{cov.name}</td>
                <td className="prop-tbl__td"><span className="prop-badge">{cov.toi}</span></td>
                <td className="prop-tbl__td">{fmtNum(cov.occ)}</td>
                <td className="prop-tbl__td">{cov.max}</td>
                <td className="prop-tbl__td">{fmtNum(cov.agg)}</td>
                <td className="prop-tbl__td"><span className="prop-badge">{cov.dedToi}</span></td>
                <td className="prop-tbl__td">{fmtNum(cov.dedValue)}</td>
                <td className="prop-tbl__td" style={{ whiteSpace: "nowrap" }}>
                  <button className="liab-action-btn" title="Edit">
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button className="liab-action-btn liab-action-btn--danger" title="Delete"
                    onClick={() => removeCoverage(cov.id)}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!showAdd ? (
          <button className="liab-add-btn" onClick={() => setShowAdd(true)}>
            <i className="fa-solid fa-plus" /> Create a new coverage
          </button>
        ) : (
          <div className="liab-add-row">
            <input className="prop-input" style={{ width: 220 }} placeholder="Coverage name"
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newName.trim()) { addCoverage(newName.trim()); setNewName(""); setShowAdd(false); } }} />
            <button className="liab-add-row__save" onClick={() => { if (newName.trim()) { addCoverage(newName.trim()); setNewName(""); setShowAdd(false); } }}>Add</button>
            <button className="liab-add-row__cancel" onClick={() => { setShowAdd(false); setNewName(""); }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Final Decision Screen state ----
const _fdDecisions = (() => {
  try {
    const raw = localStorage.getItem("ml_fd_v1");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
})();
let _fdFinalized = (() => {
  try { return JSON.parse(localStorage.getItem("ml_fd_finalized_v1") || "false"); } catch { return false; }
})();
let _fdBindDate = (() => {
  try { return localStorage.getItem("ml_fd_binddate_v1") || ""; } catch { return ""; }
})();
let _fdPolicyGroupId = (() => {
  try { return localStorage.getItem("ml_fd_policygroup_v1") || ""; } catch { return ""; }
})();
let _fdFinalizedAt = (() => {
  try { return localStorage.getItem("ml_fd_finalizedat_v1") || ""; } catch { return ""; }
})();
let _fdListeners = [];

function _saveFdToLS() {
  try {
    localStorage.setItem("ml_fd_v1", JSON.stringify(_fdDecisions));
    localStorage.setItem("ml_fd_finalized_v1", JSON.stringify(_fdFinalized));
    localStorage.setItem("ml_fd_binddate_v1", _fdBindDate);
    localStorage.setItem("ml_fd_policygroup_v1", _fdPolicyGroupId);
    localStorage.setItem("ml_fd_finalizedat_v1", _fdFinalizedAt);
  } catch {}
}

// e.g. "01/07/2026 14:23h" — mirrors the "25/06/2026 09:58h" style seen in the
// real Cyber app's finalised timeline.
function fmtFdTimestamp(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}h`;
}

function seedFdDecisions(layers) {
  layers.forEach((_, li) => {
    if (_fdDecisions[li] !== undefined) return;
    _fdDecisions[li] = {
      decision: "offered",
      typeOfParticipation: "100% direct business",
      hdiSharePct: "100",
      leadInsurer: true,
      reasonForDecision: "",
      achievedPremium: "",
      policyId: null,
    };
  });
}

function useFdState() {
  const [, forceUpdate] = useS(0);
  useE(() => {
    const fn = () => forceUpdate(n => n + 1);
    _fdListeners.push(fn);
    return () => { _fdListeners = _fdListeners.filter(f => f !== fn); };
  }, []);
  const notify = () => _fdListeners.forEach(fn => fn());

  const getDecision = (li) => _fdDecisions[li] || null;

  const setDecisionField = (li, field, value) => {
    _fdDecisions[li] = { ...(_fdDecisions[li] || {}), [field]: value };
    _saveFdToLS(); notify();
  };

  const finalise = (layers) => {
    layers.forEach((_, li) => {
      if (_fdDecisions[li]?.decision === "accepted") {
        const id = "80" + String(Math.floor(10000000 + Math.random() * 90000000));
        _fdDecisions[li] = { ..._fdDecisions[li], policyId: id };
      }
    });
    _fdPolicyGroupId = "PG-" + String(Math.floor(100000 + Math.random() * 900000));
    _fdFinalizedAt = fmtFdTimestamp(new Date());
    _fdFinalized = true;
    _saveFdToLS(); notify();
  };

  const setBindDate = (val) => {
    _fdBindDate = val;
    _saveFdToLS(); notify();
  };

  const reset = (layers) => {
    layers.forEach((_, li) => { delete _fdDecisions[li]; });
    _fdFinalized = false;
    _fdBindDate = "";
    _fdPolicyGroupId = "";
    _fdFinalizedAt = "";
    _saveFdToLS(); notify();
  };

  return { getDecision, setDecisionField, finalise, setBindDate, reset };
}

function FinalDecisionScreen({ layers }) {
  const { getDecision, setDecisionField, finalise, setBindDate, reset } = useFdState();
  const [collapsed, setCollapsed] = useS({});
  const [, forceRender] = useS(0);
  const [panelLi, setPanelLi] = useS(null);   // layerIdx of open panel, null = closed
  const [draft, setDraft] = useS(null);         // editable copy of decision while panel open

  useE(() => { seedFdDecisions(layers); forceRender(n => n + 1); }, []);

  // Group layers by product — only participating layers are listed on this
  // screen; a non-participating layer was never actually offered, so there's
  // no decision to make on it.
  const groups = layers.reduce((acc, layer, li) => {
    if (!layer.participating) return acc;
    const prod = layer.product || "Unknown";
    if (!acc[prod]) acc[prod] = [];
    acc[prod].push({ layer, li });
    return acc;
  }, {});

  const allHaveDecision = layers.every((layer, li) => {
    if (!layer.participating) return true;
    const d = getDecision(li);
    return d && d.decision !== "offered";
  });

  const isFinalized = _fdFinalized;

  // Aggregate status for a group
  const groupStatus = (items) => {
    const decisions = items.map(({ li }) => getDecision(li)?.decision || "offered");
    if (decisions.every(d => d === "offered"))   return "Pending";
    if (decisions.every(d => d === "accepted"))  return "All Accepted";
    if (decisions.every(d => d === "declined"))  return "All Declined";
    return "Mixed";
  };

  const statusClass = (status) => {
    if (status === "All Accepted") return "fd-status--accepted";
    if (status === "All Declined") return "fd-status--declined";
    if (status === "Mixed")        return "fd-status--mixed";
    return "fd-status--pending";
  };

  const groupOfferedPremium = (items) =>
    items.reduce((s, { layer }) => s + (layer.premium || 0), 0);

  // Only accepted layers have an achieved premium (matches the per-row column logic)
  const groupAchievedPremium = (items) =>
    items.reduce((s, { li }) => {
      const d = getDecision(li);
      return s + (d?.decision === "accepted" && d.achievedPremium ? Number(d.achievedPremium) : 0);
    }, 0);

  // Total achieved premium across all groups — drives the top-right stat once finalised
  const totalAchievedPremium = Object.values(groups).reduce(
    (s, items) => s + groupAchievedPremium(items), 0
  );

  const openPanel = (li) => {
    setDraft({ ...(getDecision(li) || {}) });
    setPanelLi(li);
  };

  const closePanel = () => { setPanelLi(null); setDraft(null); };

  const savePanel = () => {
    if (panelLi === null || !draft) return;
    Object.entries(draft).forEach(([field, value]) => setDecisionField(panelLi, field, value));
    closePanel();
  };

  const decisionLabel = (dec) => {
    if (dec === "accepted") return "✓ Accepted";
    if (dec === "declined") return "✕ Declined";
    return "Offered";
  };

  const panelLayer = panelLi !== null ? layers[panelLi] : null;
  const draftIsAccepted = draft?.decision === "accepted";

  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      {/* ---- Main content ---- */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="main__title" style={{ justifyContent: "space-between" }}>
          <span>Final Decision <span className="layer-badge">All Layers</span></span>
          {isFinalized && (
            <div className="fd-finalised-stat">
              <span className="fd-finalised-stat__label">Achieved Premium</span>
              <span className="fd-finalised-stat__value">{fmtEUR(totalAchievedPremium)}</span>
              <span className="fd-finalised-stat__pill">Finalised offer</span>
            </div>
          )}
        </div>
        <p className="main__subtitle" style={{ marginTop: -12, marginBottom: 20 }}>
          Please select decision for submitted offer
        </p>

        {/* Bind Date — shared across all layers */}
        <div className="fd-bind-row">
          <span>Bind Date:</span>
          <input
            type="date"
            className="fd-bind-input"
            value={_fdBindDate}
            onChange={e => setBindDate(e.target.value)}
            disabled={isFinalized}
          />
        </div>

        {/* Layer groups */}
        {Object.entries(groups).map(([product, items]) => {
          const status = groupStatus(items);
          const offeredPremium = groupOfferedPremium(items);
          const achievedPremium = groupAchievedPremium(items);
          const isCollapsed = !!collapsed[product];

          return (
            <div key={product} className="fd-group">
              {/* Group header */}
              <div className="fd-group-header" onClick={() => setCollapsed(c => ({ ...c, [product]: !c[product] }))}>
                <span className="fd-group-header__product">{product}</span>
                <span className={`fd-group-header__status ${statusClass(status)}`}>{status}</span>
                <span className="fd-group-header__premiums">
                  <span className="fd-group-header__premium-item">
                    <span className="fd-group-header__premium-label">Offered</span>
                    {offeredPremium ? fmtEUR(offeredPremium) : "—"}
                  </span>
                  <span className="fd-group-header__premium-item">
                    <span className="fd-group-header__premium-label">Achieved</span>
                    {achievedPremium ? fmtEUR(achievedPremium) : "—"}
                  </span>
                </span>
                <i className={`fa-solid fa-chevron-${isCollapsed ? "right" : "down"} fd-group-header__chevron`} />
              </div>

              {/* Layer rows — read-only display */}
              {!isCollapsed && (
                <table className="fd-table">
                  <thead>
                    <tr>
                      <th>Program Structure</th>
                      <th>Decision</th>
                      <th>Offered Premium</th>
                      <th>Type of Participation</th>
                      <th>Final HDI Share in %</th>
                      <th>Lead Insurer</th>
                      <th>Achieved Premium</th>
                      <th>Achieved HDI Premium</th>
                      <th>Policy</th>
                      {!isFinalized && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ layer, li }) => {
                      const d = getDecision(li) || {};
                      const achievedHdi = d.achievedPremium && d.hdiSharePct
                        ? Math.round(Number(d.achievedPremium) * Number(d.hdiSharePct) / 100)
                        : null;
                      const isAccepted = d.decision === "accepted";
                      const isDeclined = d.decision === "declined";
                      const isActive = panelLi === li;

                      return (
                        <tr key={li} style={{ background: isActive ? "var(--bg-sunk)" : undefined }}>
                          {/* Program Structure */}
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span className={`ls-type-badge ls-type-badge--${(layer.type || "excess").toLowerCase()}`} style={{ fontSize: 10, padding: "2px 6px" }}>
                                {layer.type}
                              </span>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>{layer.name}</span>
                            </div>
                          </td>

                          {/* Decision — read-only badge */}
                          <td>
                            <span className={`fd-group-header__status ${isAccepted ? "fd-status--accepted" : isDeclined ? "fd-status--declined" : "fd-status--pending"}`} style={{ padding: "2px 8px", borderRadius: 10 }}>
                              {decisionLabel(d.decision)}
                            </span>
                          </td>

                          {/* Offered Premium */}
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                            {layer.premium ? fmtEUR(layer.premium) : <span style={{ color: "var(--fg-faint)" }}>—</span>}
                          </td>

                          {/* Type of Participation */}
                          <td style={{ fontSize: 12, color: d.typeOfParticipation ? "var(--fg)" : "var(--fg-faint)" }}>
                            {d.typeOfParticipation || "—"}
                          </td>

                          {/* HDI Share % */}
                          <td style={{ fontSize: 12 }}>
                            {d.hdiSharePct ? `${d.hdiSharePct}%` : <span style={{ color: "var(--fg-faint)" }}>—</span>}
                          </td>

                          {/* Lead Insurer — only meaningful for co-insurance */}
                          <td style={{ fontSize: 12 }}>
                            {d.typeOfParticipation === "Co-insurance"
                              ? (d.leadInsurer
                                  ? <span style={{ color: "var(--accent)" }}>✓ Yes</span>
                                  : <span style={{ color: "var(--fg-faint)" }}>No</span>)
                              : <span style={{ color: "var(--fg-faint)" }}>—</span>}
                          </td>

                          {/* Achieved Premium */}
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                            {isAccepted && d.achievedPremium
                              ? fmtEUR(Number(d.achievedPremium))
                              : <span style={{ color: "var(--fg-faint)" }}>—</span>}
                          </td>

                          {/* Achieved HDI Premium — auto-computed */}
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                            {achievedHdi != null ? fmtEUR(achievedHdi) : <span style={{ color: "var(--fg-faint)" }}>—</span>}
                          </td>

                          {/* Policy */}
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                            {d.policyId
                              ? <span style={{ color: "var(--accent)", fontWeight: 600 }}>{d.policyId}</span>
                              : <span style={{ color: "var(--fg-faint)" }}>—</span>}
                          </td>

                          {/* Edit button */}
                          {!isFinalized && (
                            <td style={{ width: 32, textAlign: "center" }}>
                              <button
                                onClick={() => isActive ? closePanel() : openPanel(li)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: isActive ? "var(--accent)" : "var(--fg-muted)", fontSize: 13, padding: "2px 4px" }}
                                title="Edit layer decision"
                              >
                                <i className="fa-solid fa-pen" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

        {/* Finalise button / result */}
        {!isFinalized ? (
          <div className="fd-finalise-row">
            <button
              className="btn btn--primary"
              disabled={!allHaveDecision}
              style={{ opacity: allHaveDecision ? 1 : 0.45, cursor: allHaveDecision ? "pointer" : "not-allowed" }}
              onClick={() => finalise(layers)}
            >
              Finalise and create policy
            </button>
            {!allHaveDecision && (
              <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>
                All layers must have a decision before finalising
              </span>
            )}
            <button
              className="btn btn--outline"
              style={{ marginLeft: "auto", fontSize: 12, color: "var(--fg-muted)" }}
              onClick={() => reset(layers)}
            >
              <i className="fa-solid fa-rotate-left" style={{ marginRight: 6 }} />
              Reset (demo)
            </button>
          </div>
        ) : (
          <div className="fd-timeline">
            <div className="fd-timeline__item">
              <i className="fa-solid fa-circle-check fd-timeline__icon" />
              <div className="fd-timeline__body">
                <span className="fd-timeline__title">Offer Finalised</span>
                <span className="fd-timeline__meta">{_fdFinalizedAt} · Finalised by: —</span>
              </div>
            </div>
            <div className="fd-timeline__item">
              <i className="fa-solid fa-circle-check fd-timeline__icon" />
              <div className="fd-timeline__body">
                <span className="fd-timeline__title">Policy Group Created</span>
                <span className="fd-timeline__meta">Policy Group ID: {_fdPolicyGroupId}</span>
              </div>
            </div>
            <button
              className="btn btn--outline"
              style={{ marginTop: 14, fontSize: 11, color: "var(--fg-muted)" }}
              onClick={() => reset(layers)}
            >
              <i className="fa-solid fa-rotate-left" style={{ marginRight: 5 }} />
              Reset (demo)
            </button>
          </div>
        )}
      </div>

      {/* ---- Edit panel (full-height overlay, same pattern as Coverage Spreading) ---- */}
      {panelLi !== null && panelLayer && draft && (
        <div className="cst-panel-overlay">
          <div className="cst-panel">
            <div className="cst-panel__header">
              <div className="cst-panel__titles">
                <span className="cst-panel__layer">{(panelLayer.type || "Excess").toUpperCase()} · {fmtShortRange(panelLayer.rangeFrom, panelLayer.rangeTo)}</span>
                <span className="cst-panel__cov">{panelLayer.name}</span>
                <span className="cst-panel__range">{panelLayer.product}</span>
              </div>
              <button className="drawer__close" onClick={closePanel}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="cst-panel__body">
              {/* Decision */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Decision</span>
                <select
                  className={`fd-decision-select${draft.decision === "accepted" ? " fd-decision-select--accepted" : draft.decision === "declined" ? " fd-decision-select--declined" : ""}`}
                  style={{ width: "100%", padding: "9px 12px", fontSize: 13 }}
                  value={draft.decision || "offered"}
                  onChange={e => setDraft(d => ({ ...d, decision: e.target.value, achievedPremium: e.target.value !== "accepted" ? "" : d.achievedPremium }))}
                >
                  <option value="offered">Offered</option>
                  <option value="accepted">✓ Accepted</option>
                  <option value="declined">✕ Declined</option>
                </select>
              </div>

              {/* Reason for Decision */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Reason for Decision</span>
                <textarea
                  className="cst-panel-textarea"
                  placeholder="e.g. Risk accepted within appetite guidelines"
                  rows={3}
                  value={draft.reasonForDecision || ""}
                  onChange={e => setDraft(d => ({ ...d, reasonForDecision: e.target.value }))}
                />
              </div>

              {/* Offered Premium — read-only context */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Offered Premium</span>
                <div className="cst-panel__field-static">
                  {panelLayer.premium ? fmtEUR(panelLayer.premium) : "—"}
                </div>
              </div>

              {/* Type of Participation */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Type of Participation</span>
                <select
                  className="cst-panel-input"
                  value={draft.typeOfParticipation || "100% direct business"}
                  onChange={e => {
                    const val = e.target.value;
                    setDraft(d => ({ ...d, typeOfParticipation: val, leadInsurer: val === "Co-insurance" ? d.leadInsurer : false }));
                  }}
                >
                  <option value="100% direct business">100% direct business</option>
                  <option value="Co-insurance">Co-insurance</option>
                </select>
              </div>

              {/* Final HDI Share % */}
              <div className="cst-panel__field">
                <span className="cst-panel__field-label">Final HDI Share %</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    className="cst-panel-input"
                    style={{ width: 100 }}
                    type="number"
                    min="0" max="100"
                    placeholder="e.g. 100"
                    value={draft.hdiSharePct || ""}
                    onChange={e => setDraft(d => ({ ...d, hdiSharePct: e.target.value }))}
                  />
                  <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>%</span>
                </div>
              </div>

              {/* Lead Insurer toggle — only relevant when co-insured */}
              {draft.typeOfParticipation === "Co-insurance" && (
                <div className="cst-panel__field">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                    onClick={() => setDraft(d => ({ ...d, leadInsurer: !d.leadInsurer }))}>
                    <span className="cst-panel__field-label">Lead Insurer</span>
                    <div className={`ls-toggle${draft.leadInsurer ? " ls-toggle--on" : ""}`}>
                      <div className="ls-toggle__track"><div className="ls-toggle__thumb" /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achieved Premium — only if Accepted */}
              {draftIsAccepted && (
                <div className="cst-panel__field">
                  <span className="cst-panel__field-label">Achieved Premium</span>
                  <EuroInput placeholder="e.g. 55.000"
                    value={draft.achievedPremium || ""}
                    onChange={v => setDraft(d => ({ ...d, achievedPremium: v }))} />
                  {draft.achievedPremium && draft.hdiSharePct && (
                    <span className="cst-panel__field-hint">
                      Achieved HDI Premium: {fmtEUR(Math.round(Number(draft.achievedPremium) * Number(draft.hdiSharePct) / 100))}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="cst-panel__footer">
              <button className="btn btn--primary" onClick={savePanel}>Save</button>
              <button className="btn btn--outline" onClick={closePanel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
