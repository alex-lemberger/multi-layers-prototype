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
              <th style={{width: "20%"}}>Layer Name</th>
              <th style={{width: "10%"}}>Type</th>
              <th style={{width: "14%"}}>Range</th>
              <th style={{width: "14%"}}>Limit</th>
              <th style={{width: "14%"}}>Attachment Point</th>
              <th style={{width: "14%"}}>Participation</th>
              <th style={{width: "14%"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayLayers.map((layer) => {
              const idx = layers.indexOf(layer);
              return (
              <tr key={layer.id} className={idx === activeLayerIdx ? "ls-row--active" : ""}>
                <td className="t-strong">{layer.name}</td>
                <td><span className={`ls-type-badge ls-type-badge--${layer.type.toLowerCase()}`}>{layer.type}</span></td>
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
              <th style={{width: "18%"}}>Layer Name</th>
              <th style={{width: "10%"}}>Type</th>
              <th style={{width: "14%"}}>Range</th>
              <th style={{width: "12%"}}>Limit</th>
              <th style={{width: "14%"}}>Attachment Point</th>
              <th style={{width: "12%"}}>Deductible</th>
              <th style={{width: "12%"}}>Participation</th>
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

// ---- Layered Coverage screen (the "spreading" matrix) ----
// Rows = coverages from Program Coverage
// Columns = layers
// Cells = limit/deductible/included per coverage per layer
function LayeredCoverageScreen({ layers, activeLayerIdx, onLayerChange }) {
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
                            <span className="lc-cell__label">Limit</span>
                            <span className="lc-cell__value">{cov.limitOcc ? fmtEUR(cov.limitOcc) : "—"}</span>
                          </div>
                          <div className="lc-cell__row">
                            <span className="lc-cell__label">Agg</span>
                            <span className="lc-cell__value">{cov.limitAgg ? fmtEUR(cov.limitAgg) : "—"}</span>
                          </div>
                          <div className="lc-cell__row">
                            <span className="lc-cell__label">Ded</span>
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
                  <table className="grid-tbl" style={{marginBottom: 16}}>
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
