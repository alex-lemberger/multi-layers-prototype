// UWWB Multi-Layers POC — App shell (CaTa header + partner banner design)
// Demonstrates layer switching via the sidebar, reusing the existing option mechanism
const { useState: useState_app, useEffect: useEffect_app, useMemo: useMemo_app, useCallback: useCallback_app, useRef: useRef_app } = React;

// ---- Option dropdown (visual only, not wired) ----
const SAMPLE_OPTIONS = [
  { name: "Option 1", desc: "Base Coverage" },
  { name: "Option 2", desc: "10% discount" },
  { name: "Option 3", desc: "20% discount" },
];

function OptionDropdown() {
  const [open, setOpen] = useState_app(false);
  const [selected] = useState_app(0);
  const ref = useRef_app(null);

  useEffect_app(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span className="option-dropdown" ref={ref}>
      <button className="option-dropdown__trigger" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-sliders" style={{fontSize: 11}} />
        {SAMPLE_OPTIONS[selected].name}
        <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`} style={{fontSize: 10}} />
      </button>
      {open && (
        <div className="option-dropdown__menu">
          <div className="option-dropdown__header">Available Options</div>
          {SAMPLE_OPTIONS.map((opt, idx) => (
            <button key={idx}
              className={`option-dropdown__item${idx === selected ? " option-dropdown__item--active" : ""}`}
              onClick={() => setOpen(false)}>
              <span className="option-dropdown__item-name">{opt.name}</span>
              <span className="option-dropdown__item-desc">{opt.desc}</span>
            </button>
          ))}
          <div className="option-dropdown__footer">
            <button className="option-dropdown__action" onClick={() => setOpen(false)}>
              <i className="fa-solid fa-plus" /> Create Variant
            </button>
            <button className="option-dropdown__action option-dropdown__action--mgmt" onClick={() => setOpen(false)}>
              <i className="fa-solid fa-sliders" /> Options Management
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

// ---- Layer switcher (partner-banner, alongside options) ----
function LayerSwitcher({ layers, activeLayerIdx, onLayerChange }) {
  const [open, setOpen] = useState_app(false);
  const ref = useRef_app(null);
  const active = layers[activeLayerIdx] || layers[0];
  const participatingLayers = layers.filter(l => l.participating);

  useEffect_app(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span className="layer-switcher" ref={ref}>
      <button className="layer-switcher__trigger" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-layer-group" style={{fontSize: 11}} />
        {active.name}
        <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`} style={{fontSize: 10}} />
      </button>
      {open && (
        <div className="layer-switcher__menu">
          <div className="layer-switcher__header">Participating Layers</div>
          {participatingLayers.length === 0 && (
            <div className="layer-switcher__empty">No participating layers</div>
          )}
          {participatingLayers.map((l) => {
            const idx = layers.indexOf(l);
            return (
            <button key={l.id}
              className={`layer-switcher__item${idx === activeLayerIdx ? " layer-switcher__item--active" : ""}`}
              onClick={() => { onLayerChange(idx); setOpen(false); }}>
              <span className="layer-switcher__item-name">{l.name}</span>
              <span className="layer-switcher__item-range">{fmtShortRange(l.rangeFrom, l.rangeTo)}</span>
            </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

// ---- Sample layer data ----
function makeInitialLayers() {
  return [
    {
      id: 0, name: "Primary Layer", type: "Primary", product: "Cyber Plus",
      rangeFrom: 0, rangeTo: 1000000,
      limit: 1000000, attachmentPoint: 0, deductible: 50000,
      premium: 55666, rate: "5.57%", participating: true,
      coverages: [
        { name: "Third Party Liability", tol: "", limitOcc: 1000000, limitAgg: 5000000, deductible: 50000, included: true },
        { name: "Media Liability", tol: "", limitOcc: 500000, limitAgg: 2000000, deductible: 25000, included: true },
        { name: "Privacy & Network Security", tol: "", limitOcc: 1000000, limitAgg: 5000000, deductible: 50000, included: true },
        { name: "Network Security Liability", tol: "", limitOcc: 500000, limitAgg: null, deductible: null, included: false },
        { name: "Digital Data & Systems Recovery", tol: "BI", limitOcc: 750000, limitAgg: 3000000, deductible: 10000, included: true },
        { name: "Extended Cover for Extortion", tol: "", limitOcc: 250000, limitAgg: null, deductible: null, included: false },
        { name: "Incident Response Costs", tol: "", limitOcc: 100000, limitAgg: 500000, deductible: 5000, included: true },
      ],
    },
    {
      id: 1, name: "Excess Layer 1", type: "Excess", product: "Cyber Baseline",
      rangeFrom: 1000000, rangeTo: 4000000,
      limit: 3000000, attachmentPoint: 1000000, deductible: 10000,
      premium: null, rate: null, participating: true,
      coverages: [
        { name: "Third Party Liability", tol: "", limitOcc: 3000000, limitAgg: 10000000, deductible: 10000, included: true },
        { name: "Privacy & Network Security", tol: "", limitOcc: 3000000, limitAgg: 10000000, deductible: 10000, included: true },
        { name: "Digital Data & Systems Recovery", tol: "BI", limitOcc: 2000000, limitAgg: 8000000, deductible: 10000, included: true },
        { name: "Media Liability", tol: "", limitOcc: null, limitAgg: null, deductible: null, included: false },
        { name: "Network Security Liability", tol: "", limitOcc: null, limitAgg: null, deductible: null, included: false },
        { name: "Incident Response Costs", tol: "", limitOcc: null, limitAgg: null, deductible: null, included: false },
      ],
    },
    {
      id: 2, name: "Excess Layer 2", type: "Excess", product: "Cyber Baseline",
      rangeFrom: 4000000, rangeTo: 10000000,
      limit: 6000000, attachmentPoint: 4000000, deductible: 0,
      premium: null, rate: null, participating: false,
      coverages: [
        { name: "Third Party Liability", tol: "", limitOcc: 6000000, limitAgg: 20000000, deductible: 0, included: true },
        { name: "Privacy & Network Security", tol: "", limitOcc: 6000000, limitAgg: 20000000, deductible: 0, included: true },
        { name: "Digital Data & Systems Recovery", tol: "BI", limitOcc: null, limitAgg: null, deductible: null, included: false },
      ],
    },
  ];
}

// ---- Navigation items (CaTa icon mapping) ----
// Variant A: Layers Settings as setup step (after General Data)
const NAV_ITEMS_A = [
  { id: "general-data",       label: "General Data",        icon: "fa-solid fa-id-card",       status: "done" },
  { id: "layers-settings",    label: "Layers",              icon: "fa-solid fa-layer-group",   status: "", children: [
    { id: "layers-settings",      label: "Layer Structure",     icon: "fa-solid fa-table-list" },
    { id: "coverage-spreading",   label: "Coverage (Cyber)",    icon: "fa-solid fa-chart-bar" },
    { id: "coverage-spreading-v2", label: "Coverage V2",         icon: "fa-solid fa-list" },
    { id: "coverage-spreading-v3", label: "Coverage V3",         icon: "fa-solid fa-toggle-on" },
    { id: "layered-coverage",     label: "Coverage Matrix",     icon: "fa-solid fa-table-cells" },
  ]},
  { id: "program-coverage",   label: "Program Coverage",    icon: "fa-solid fa-file-shield",   status: "" },
  { id: "calc-adjustment",    label: "Calculation / Adjustment", icon: "fa-solid fa-calculator", status: "", children: [
    { id: "premium-result",       label: "Premium Result",      icon: "fa-solid fa-chart-line" },
    { id: "loading-discounts",    label: "Loading / Discounts", icon: "fa-solid fa-tag" },
    { id: "premium-rates",        label: "Premium Rates",       icon: "fa-solid fa-percent" },
  ]},
  { id: "analysis",           label: "Analysis / Choice",   icon: "fa-solid fa-toolbox",       status: "" },
  { id: "final-decision",    label: "Final Decision",      icon: "fa-solid fa-flag-checkered", status: "" },
];

// Variant B: Layers as workflow step (after Program Coverage, before Premium)
const NAV_ITEMS_B = [
  { id: "general-data",       label: "General Data",        icon: "fa-solid fa-id-card",       status: "done" },
  { id: "program-coverage",   label: "Program Coverage",    icon: "fa-solid fa-file-shield",   status: "done" },
  { id: "layers",             label: "Layers",              icon: "fa-solid fa-layer-group",   status: "", children: [
    { id: "layers",               label: "Layer Structure",     icon: "fa-solid fa-table-list" },
    { id: "coverage-spreading",   label: "Coverage (Cyber)",    icon: "fa-solid fa-chart-bar" },
    { id: "coverage-spreading-v2", label: "Coverage V2",         icon: "fa-solid fa-list" },
    { id: "coverage-spreading-v3", label: "Coverage V3",         icon: "fa-solid fa-toggle-on" },
    { id: "layered-coverage",     label: "Coverage Matrix",     icon: "fa-solid fa-table-cells" },
    // Property + Liability hidden until design team delivers screenshots:
    // { id: "prop-define",       label: "Define Coverage (Property)", icon: "fa-solid fa-building" },
    // { id: "prop-limits",       label: "Limits / Ded. (Property)", icon: "fa-solid fa-sliders" },
    // { id: "liability-coverage",label: "Coverage (Liability)", icon: "fa-solid fa-scale-balanced" },
  ]},
  { id: "calc-adjustment",    label: "Calculation / Adjustment", icon: "fa-solid fa-calculator", status: "", children: [
    { id: "premium-result",       label: "Premium Result",      icon: "fa-solid fa-chart-line" },
    { id: "loading-discounts",    label: "Loading / Discounts", icon: "fa-solid fa-tag" },
    { id: "premium-rates",        label: "Premium Rates",       icon: "fa-solid fa-percent" },
  ]},
  { id: "analysis",           label: "Analysis / Choice",   icon: "fa-solid fa-toolbox",       status: "" },
  { id: "final-decision",    label: "Final Decision",      icon: "fa-solid fa-flag-checkered", status: "" },
];

// ---- Default layered screens (which screens get layer-scoped data) ----
// REMOVED — layers are parallel worlds, ALL screens are layer-scoped

// ---- LocalStorage persistence ----
const LS_KEY_LAYERS = "ml_layers_v1";

function loadFromLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function saveToLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ---- Drawer for adding a new layer ----
function AddLayerDrawer({ open, onClose, onAdd, nextIndex }) {
  const [name, setName] = useState_app("Excess Layer " + nextIndex);
  const [layerType, setLayerType] = useState_app("Excess");
  const [product, setProduct] = useState_app("Cyber Baseline");

  useEffect_app(() => {
    setName("Excess Layer " + nextIndex);
  }, [nextIndex, open]);

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer__header">
          <div className="drawer__title">Add New Layer</div>
          <button className="drawer__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="drawer__body">
          <p style={{fontSize: 13, color: "var(--fg-muted)", marginBottom: 20}}>
            Configure the basic layer structure. Coverage details can be configured after creation.
          </p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Layer Name</div>
              <input className="form-input"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Layer Type</div>
              <select className="form-input form-select"
                value={layerType} onChange={e => setLayerType(e.target.value)}>
                <option value="Primary">Primary</option>
                <option value="Excess">Excess</option>
              </select>
            </div>
            <div style={{gridColumn: "1 / -1"}}>
              <div className="dfield__label" style={{marginBottom: 6}}>Product</div>
              <select className="form-input form-select"
                value={product} onChange={e => setProduct(e.target.value)}>
                <option value="Cyber Baseline">Cyber Baseline</option>
                <option value="Cyber Plus">Cyber Plus</option>
              </select>
            </div>
          </div>
        </div>
        <div className="drawer__footer">
          <button className="btn btn--primary" onClick={() => { onAdd({ name, type: layerType, product }); onClose(); }}>
            Create Layer
          </button>
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---- Delete confirmation dialog ----
function DeleteLayerDialog({ open, onClose, onConfirm, layerName }) {
  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog__header">
          <div className="dialog__title"><i className="fa-regular fa-trash-can" style={{color: "var(--red)", marginRight: 8}} />Delete Layer</div>
          <button className="drawer__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="dialog__body">
          <p style={{fontSize: 14, marginBottom: 8}}>
            Are you sure you want to delete <strong>{layerName}</strong>?
          </p>
          <p style={{fontSize: 13, color: "var(--fg-muted)"}}>
            This will remove the layer and all its coverage configuration. This action cannot be undone.
          </p>
        </div>
        <div className="dialog__footer">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" style={{background: "var(--red)"}} onClick={() => { onConfirm(); onClose(); }}>
            Delete Layer
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Copy layer drawer ----
function CopyLayerDrawer({ open, onClose, onCopy, sourceLayer, nextIndex }) {
  const [name, setName] = useState_app("");
  useEffect_app(() => {
    if (sourceLayer) setName(sourceLayer.name + " (Copy)");
  }, [sourceLayer, open]);

  if (!open || !sourceLayer) return null;
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()} style={{width: 420}}>
        <div className="drawer__header">
          <div className="drawer__title">Copy Layer</div>
          <button className="drawer__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="drawer__body">
          <p style={{fontSize: 13, color: "var(--fg-muted)", marginBottom: 20}}>
            Creates a new layer with the same coverage configuration as <strong>{sourceLayer.name}</strong>.
          </p>
          <div>
            <div className="dfield__label" style={{marginBottom: 6}}>New Layer Name</div>
            <input className="form-input"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="drawer__footer">
          <button className="btn btn--primary" onClick={() => { onCopy({ ...sourceLayer, name, id: nextIndex }); onClose(); }}>
            Copy Layer
          </button>
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---- Edit layer drawer ----
function EditLayerDrawer({ open, onClose, onSave, layer, layerIdx }) {
  const [name, setName] = useState_app("");
  const [layerType, setLayerType] = useState_app("Excess");
  const [product, setProduct] = useState_app("Cyber Baseline");
  const [limit, setLimit] = useState_app("");
  const [attachmentPoint, setAttachmentPoint] = useState_app("");
  const [deductible, setDeductible] = useState_app("");
  const [participating, setParticipating] = useState_app(true);

  useEffect_app(() => {
    if (layer) {
      setName(layer.name);
      setLayerType(layer.type);
      setProduct(layer.product || "Cyber Baseline");
      setLimit(String(layer.limit || 0));
      setAttachmentPoint(String(layer.attachmentPoint || 0));
      setDeductible(String(layer.deductible || 0));
      setParticipating(layer.participating !== false);
    }
  }, [layer, open]);

  if (!open || !layer) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer__header">
          <div className="drawer__title">Edit Layer</div>
          <button className="drawer__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="drawer__body">
          <p style={{fontSize: 13, color: "var(--fg-muted)", marginBottom: 20}}>
            Modify the layer configuration for <strong>{layer.name}</strong>.
          </p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Layer Name</div>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Layer Type</div>
              <select className="form-input form-select" value={layerType} onChange={e => setLayerType(e.target.value)}>
                <option value="Primary">Primary</option>
                <option value="Excess">Excess</option>
              </select>
            </div>
            <div style={{gridColumn: "1 / -1"}}>
              <div className="dfield__label" style={{marginBottom: 6}}>Product</div>
              <select className="form-input form-select" value={product} onChange={e => setProduct(e.target.value)}>
                <option value="Cyber Baseline">Cyber Baseline</option>
                <option value="Cyber Plus">Cyber Plus</option>
              </select>
            </div>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Limit</div>
              <input className="form-input" type="number" value={limit} onChange={e => setLimit(e.target.value)} />
            </div>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Attachment Point</div>
              <input className="form-input" type="number" value={attachmentPoint} onChange={e => setAttachmentPoint(e.target.value)} />
            </div>
            <div>
              <div className="dfield__label" style={{marginBottom: 6}}>Deductible</div>
              <input className="form-input" type="number" value={deductible} onChange={e => setDeductible(e.target.value)} />
            </div>
          </div>

          {/* Participating Layer toggle */}
          <div className="participating-toggle" style={{marginTop: 24}}>
            <div className="dfield__label" style={{marginBottom: 10}}>Participating Layer</div>
            <div className="toggle-row">
              <button
                className={`toggle-btn${participating ? " toggle-btn--active" : ""}`}
                onClick={() => setParticipating(true)}>
                Yes
              </button>
              <button
                className={`toggle-btn${!participating ? " toggle-btn--active toggle-btn--no" : ""}`}
                onClick={() => setParticipating(false)}>
                No
              </button>
            </div>
            <p style={{fontSize: 12, color: "var(--fg-muted)", marginTop: 8}}>
              {participating
                ? "This layer is visible in the layer switcher and included in premium calculations."
                : "This layer is hidden from the layer switcher. Configure it here before activating."
              }
            </p>
          </div>
        </div>
        <div className="drawer__footer">
          <button className="btn btn--primary" onClick={() => {
            onSave(layerIdx, {
              name,
              type: layerType,
              product,
              limit: Number(limit) || 0,
              attachmentPoint: Number(attachmentPoint) || 0,
              deductible: Number(deductible) || 0,
              rangeFrom: Number(attachmentPoint) || 0,
              rangeTo: (Number(attachmentPoint) || 0) + (Number(limit) || 0),
              participating,
            });
            onClose();
          }}>
            Save Changes
          </button>
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---- Main App ----
function App() {
  const [variant, setVariant] = useState_app("B"); // A code kept but hidden for demo
  const [layers, setLayers] = useState_app(() => loadFromLS(LS_KEY_LAYERS, makeInitialLayers()));
  const [activeLayerIdx, setActiveLayerIdx] = useState_app(0);
  const [activeNav, setActiveNav] = useState_app(() => {
    const hash = window.location.hash.replace("#", "");
    const allNavIds = [...NAV_ITEMS_A, ...NAV_ITEMS_B].flatMap(n => n.children ? [n.id, ...n.children.map(c => c.id)] : [n.id]);
    return allNavIds.includes(hash) ? hash : "general-data";
  });
  const [showAddDrawer, setShowAddDrawer] = useState_app(false);
  const [deleteTarget, setDeleteTarget] = useState_app(null);
  const [copyTarget, setCopyTarget] = useState_app(null);
  const [editTarget, setEditTarget] = useState_app(null);
  const [, setFdTick] = useState_app(0);

  // Subscribe to Final Decision state changes so partner banner Achieved Premium stays live
  useEffect_app(() => {
    const sub = () => setFdTick(t => t + 1);
    _fdListeners.push(sub);
    return () => { _fdListeners = _fdListeners.filter(f => f !== sub); };
  }, []);

  const NAV_ITEMS = variant === "A" ? NAV_ITEMS_A : NAV_ITEMS_B;

  // Persist layers to localStorage
  useEffect_app(() => { saveToLS(LS_KEY_LAYERS, layers); }, [layers]);
  useEffect_app(() => { saveToLS("ml_variant", variant); }, [variant]);

  // Sync hash with active nav
  useEffect_app(() => { window.location.hash = activeNav; }, [activeNav]);
  useEffect_app(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      const allNavIds = NAV_ITEMS.flatMap(n => n.children ? [n.id, ...n.children.map(c => c.id)] : [n.id]);
      // Hidden routes (no nav item, direct URL only)
      const hiddenRoutes = ["layered-coverage-poc"];
      if (allNavIds.includes(hash) || hiddenRoutes.includes(hash)) setActiveNav(hash);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const activeLayer = layers[activeLayerIdx] || layers[0];
  const nextLayerIndex = layers.length;

  // ---- Layer CRUD ----
  const addLayer = useCallback_app((spec) => {
    const newLayer = {
      id: layers.length,
      name: spec.name,
      type: spec.type,
      product: spec.product || "Cyber Baseline",
      rangeFrom: layers[layers.length - 1]?.rangeTo || 0,
      rangeTo: (layers[layers.length - 1]?.rangeTo || 0) + 5000000,
      limit: 5000000,
      attachmentPoint: layers[layers.length - 1]?.rangeTo || 0,
      deductible: 0,
      premium: null, rate: null, participating: false,
      coverages: [],
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerIdx(layers.length);
  }, [layers]);

  const deleteLayer = useCallback_app((idx) => {
    if (layers.length <= 1) return;
    const next = [...layers];
    next.splice(idx, 1);
    setLayers(next);
    setActiveLayerIdx(Math.min(activeLayerIdx, next.length - 1));
  }, [layers, activeLayerIdx]);

  const copyLayer = useCallback_app((newLayer) => {
    const copied = { ...newLayer, id: layers.length, premium: null, rate: null, participating: false,
      coverages: (newLayer.coverages || []).map(c => ({...c})) };
    setLayers(prev => [...prev, copied]);
    setActiveLayerIdx(layers.length);
  }, [layers]);

  const editLayer = useCallback_app((idx, updates) => {
    setLayers(prev => prev.map((l, i) => i === idx ? { ...l, ...updates } : l));
  }, []);

  // Switch layer = simulates route change (:offerNumber/:optionIndex)
  const switchLayer = useCallback_app((idx) => {
    setActiveLayerIdx(idx);
    // In real app: router.navigate([offerNumber, idx, activeNav])
  }, [activeNav]);

  // ---- Render screen ----
  function renderScreen() {
    switch (activeNav) {
      case "general-data":       return <GeneralDataScreen layer={activeLayer} allLayers={layers} />;
      case "layers-settings":    return <LayersSettingsScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} onAdd={() => setShowAddDrawer(true)} onCopy={setCopyTarget} onDelete={setDeleteTarget} onEdit={setEditTarget} />;
      case "layers":             return <LayersWorkflowScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} onAdd={() => setShowAddDrawer(true)} onCopy={setCopyTarget} onDelete={setDeleteTarget} onEdit={setEditTarget} />;
      case "layered-coverage":   return <LayeredCoverageScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "coverage-spreading":  return <CoverageSpreadingScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "coverage-spreading-v2": return <CoverageSpreadingV2Screen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "coverage-spreading-v3": return <CoverageSpreadingV3Screen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "layered-coverage-poc": return <LayeredCoveragePocScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "prop-define":        return <PropDefineCoverageScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "prop-limits":        return <PropLimitsScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "liability-coverage": return <LiabilityCoverageScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "program-coverage":   return <ProgramCoverageScreen layer={activeLayer} allLayers={layers} />;
      case "premium-result":     return <PremiumResultScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "loading-discounts":  return <LoadingDiscountsScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "premium-rates":      return <PremiumRatesScreen layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={setActiveLayerIdx} />;
      case "final-decision":     return <FinalDecisionScreen layers={layers} />;
      default:
        return (
          <div>
            <div className="main__title">
              {NAV_ITEMS.find(n => n.id === activeNav)?.label || activeNav}
              <LayerBadge layer={activeLayer} />
            </div>
            <DisplayCard title={NAV_ITEMS.find(n => n.id === activeNav)?.label || activeNav} grid={false}>
              <p style={{color: "var(--fg-muted)", fontSize: 13, padding: "12px 0"}}>
                This screen will show {NAV_ITEMS.find(n => n.id === activeNav)?.label || activeNav} data
                scoped to <strong>{activeLayer.name}</strong>.
              </p>
            </DisplayCard>
          </div>
        );
    }
  }

  return (
    <div className="app">
      {/* ---- Header (CaTa design) ---- */}
      <header className="header">
        <div className="header__l">
          <a className="brandmark" href="#">
            <img src="src/hdi-logo.png" alt="HDI" className="brandmark__logo" />
            <span className="brandmark__divider" />
            <span className="brandmark__title">Underwriting Workbench</span>
            <span className="brandmark__divider" />
            <span className="brandmark__title brandmark__title--muted">Cyber</span>
          </a>
        </div>
        <div className="header__r">
          {/* Variant toggle hidden for demo — keeping code, just not rendering
          <div className="variant-toggle">
            <button className={`variant-toggle__btn${variant === "A" ? " variant-toggle__btn--active" : ""}`} onClick={() => { setVariant("A"); setActiveNav("general-data"); }}>
              A: Settings-first
            </button>
            <button className={`variant-toggle__btn${variant === "B" ? " variant-toggle__btn--active" : ""}`} onClick={() => { setVariant("B"); setActiveNav("general-data"); }}>
              B: Workflow-step
            </button>
          </div>
          */}
          <a className="header-link" href="#"><i className="fa-solid fa-comment-dots" /> Feedback</a>
          <a className="header-link" href="#"><i className="fa-solid fa-link" /> Links</a>
          <a className="header-user" href="#">
            <i className="fa-solid fa-user" />
            07149X@hdi.de
          </a>
        </div>
      </header>

      {/* ---- Body ---- */}
      <div className="body">
        {/* ---- Sidebar ---- */}
        <div className="sidebar">
          {/* Navigation section */}
          <div className="sidebar__section">
            <div className="sidebar__section-header">
              <span className="sidebar__section-label">Navigation</span>
            </div>
            <div className="nav-stepper">
            {NAV_ITEMS.map((item, idx) => (
              <React.Fragment key={item.id + (item.children ? '-parent' : '')}>
                <div
                  className={"nav-item" +
                    (item.id === activeNav && !item.children ? " nav-item--active" : "") +
                    (item.children && item.children.some(c => c.id === activeNav) ? " nav-item--parent-active" : "")
                  }
                  onClick={() => setActiveNav(item.children ? item.children[0].id : item.id)}>
                  <span className={"nav-item__dot" +
                    (item.status === "done" ? " nav-item__dot--done" : "")} />
                  <i className={item.icon + " nav-item__icon"} />
                  <span className="nav-item__label">{item.label}</span>
                </div>
                {/* Sub-navigation items (visible when layers exist) */}
                {item.children && layers.length > 1 && (
                  <div className="nav-children">
                    {item.children.map(child => (
                      <div key={child.id}
                        className={"nav-item nav-item--child" +
                          (child.id === activeNav ? " nav-item--active" : "")
                        }
                        onClick={() => setActiveNav(child.id)}>
                        <i className={child.icon + " nav-item__icon"} />
                        <span className="nav-item__label">{child.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            </div>
          </div>

          <hr className="sidebar__divider" />

          <div className="sidebar__section">
            <div className="sidebar__section-header">
              <span className="sidebar__section-label">Misc</span>
            </div>
            <div className="nav-item" style={{cursor: "pointer"}}>
              <i className="fa-solid fa-arrow-right-from-bracket nav-item__icon" />
              <span className="nav-item__label">Exit Offer</span>
            </div>
          </div>
        </div>

        {/* ---- Main content ---- */}
        <div className="main">
          {/* Partner Banner inside main (CaTa pattern) */}
          <div className="partner-banner">
            <h1 className="partner-banner__title">Suppella Partner International GmbH</h1>
            <div className="partner-banner__chips">
              <OptionDropdown />
              <span className="pb-divider" />
              <LayerSwitcher layers={layers} activeLayerIdx={activeLayerIdx} onLayerChange={switchLayer} />
              <span className="pb-divider" />
              <span className="pbchip"><i className="fa-solid fa-tag" style={{fontSize: 11}} /> Partner ID: 889088122712</span>
            </div>
            <div className="partner-banner__meta" style={{width: "100%"}}>
              <span className="meta-item">
                <i className="fa-solid fa-file" />
                <span className="meta-item__label">Offer No.:</span>
                <span className="meta-item__value meta-item__value--mono">LI-00005</span>
              </span>
              <span className="meta-item">
                <i className="fa-solid fa-circle-half-stroke" />
                <span className="meta-item__label">Option Status:</span>
                <span className="meta-item__value">In progress</span>
              </span>
              <span className="meta-item">
                <i className="fa-solid fa-check-circle" />
                <span className="meta-item__label">Offer Status:</span>
                <span className="meta-item__value">Accepted</span>
              </span>
              <span className="meta-item">
                <i className="fa-solid fa-clock" />
                <span className="meta-item__label">Last modified:</span>
                <span className="meta-item__value meta-item__value--mono">18.06.2026</span>
              </span>
              <span className="meta-item">
                <i className="fa-solid fa-coins" />
                <span className="meta-item__label">Achieved Premium:</span>
                <span className="meta-item__value meta-item__value--mono">
                  {fmtEUR(Object.values(_fdDecisions).reduce((s, d) =>
                    s + (d?.decision === "accepted" ? Number(d?.achievedPremium || 0) : 0)
                  , 0))}
                </span>
              </span>
            </div>
          </div>
          {renderScreen()}
        </div>
      </div>

      {/* ---- Drawers ---- */}
      <AddLayerDrawer
        open={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onAdd={addLayer}
        nextIndex={nextLayerIndex}
      />
      <EditLayerDrawer
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSave={editLayer}
        layer={editTarget !== null ? layers[editTarget] : null}
        layerIdx={editTarget}
      />
      <DeleteLayerDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteLayer(deleteTarget)}
        layerName={deleteTarget !== null ? layers[deleteTarget]?.name : ""}
      />
      <CopyLayerDrawer
        open={copyTarget !== null}
        onClose={() => setCopyTarget(null)}
        onCopy={copyLayer}
        sourceLayer={copyTarget !== null ? layers[copyTarget] : null}
        nextIndex={nextLayerIndex}
      />
    </div>
  );
}

// ---- Mount ----
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
