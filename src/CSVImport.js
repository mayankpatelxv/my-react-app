import { useState, useRef } from "react";
import { addItem, addParty } from "./supabaseClient";
import "./CSVImport.css";
import { useToast } from "./Toast";

// ── CSV templates ──────────────────────────────────────────────
const TEMPLATES = {
  items: {
    headers: ["name", "category", "unit", "price", "stock_level", "min_stock_level", "description", "sku"],
    sample: [
      ["Rice Basmati", "Grocery", "kg", "120", "100", "20", "Premium basmati rice", "SKU001"],
      ["Sugar", "Grocery", "kg", "45", "200", "50", "", "SKU002"],
    ],
    label: "Items",
  },
  parties: {
    headers: ["name", "party_type", "email", "phone", "address", "city", "state", "country", "credit_limit", "notes"],
    sample: [
      ["Rahul Traders", "Customer", "rahul@example.com", "9876543210", "123 Main St", "Mumbai", "MH", "India", "50000", ""],
      ["Sharma Suppliers", "Supplier", "sharma@example.com", "9123456789", "456 Market Rd", "Delhi", "DL", "India", "100000", "Bulk supplier"],
    ],
    label: "Parties",
  },
};

// ── Parse CSV text → array of objects ─────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });
  return { headers, rows };
}

// ── Download template CSV ──────────────────────────────────────
function downloadTemplate(type) {
  const t = TEMPLATES[type];
  const lines = [t.headers.join(","), ...t.sample.map(r => r.join(","))];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}_template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ─────────────────────────────────────────────
const CSVImport = ({ type = "items", user, onClose, onSuccess }) => {
  const toast = useToast();
  const [step, setStep] = useState("upload"); // upload | preview | result
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [errors, setErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState({ success: 0, failed: 0, errors: [] });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const template = TEMPLATES[type];

  // ── Validate a row ───────────────────────────────────────────
  const validateRow = (row, idx) => {
    const errs = [];
    if (!row.name?.trim()) errs.push(`Row ${idx + 1}: name is required`);
    if (type === "items") {
      if (!row.price || isNaN(Number(row.price))) errs.push(`Row ${idx + 1}: price must be a number`);
      if (!row.stock_level || isNaN(Number(row.stock_level))) errs.push(`Row ${idx + 1}: stock_level must be a number`);
    }
    if (type === "parties") {
      const validTypes = ["customer", "supplier", "both"];
      if (!validTypes.includes((row.party_type || "").toLowerCase())) {
        errs.push(`Row ${idx + 1}: party_type must be Customer, Supplier, or Both`);
      }
    }
    return errs;
  };

  // ── Handle file ──────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      toast.warning("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers: h, rows: r } = parseCSV(e.target.result);
      if (!r.length) { toast.warning("CSV is empty or invalid"); return; }
      const allErrors = r.flatMap((row, i) => validateRow(row, i));
      setHeaders(h);
      setRows(r);
      setErrors(allErrors);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  // ── Import rows ──────────────────────────────────────────────
  const handleImport = async () => {
    if (errors.length) { toast.warning("Fix validation errors before importing"); return; }
    setImporting(true);
    let success = 0, failed = 0;
    const failedErrors = [];

    for (const row of rows) {
      let res;
      if (type === "items") {
        res = await addItem({
          name: row.name,
          category: row.category || "General",
          unit: row.unit || "pcs",
          price: row.price,
          stockLevel: row.stock_level,
          minStockLevel: row.min_stock_level || null,
          description: row.description || null,
          sku: row.sku || null,
        }, user.id);
      } else {
        res = await addParty({
          name: row.name,
          partyType: row.party_type || "Customer",
          email: row.email || "",
          phone: row.phone || "",
          address: row.address || "",
          city: row.city || "",
          state: row.state || "",
          country: row.country || "",
          creditLimit: row.credit_limit || null,
          notes: row.notes || null,
          taxId: null,
          paymentTerms: null,
          zipCode: null,
        }, user.id);
      }
      if (res.success) success++;
      else { failed++; failedErrors.push(`${row.name}: ${res.error}`); }
    }

    setResult({ success, failed, errors: failedErrors });
    setImporting(false);
    setStep("result");
    if (success > 0 && onSuccess) onSuccess();
  };

  return (
    <div className="csv-overlay" onClick={onClose}>
      <div className="csv-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="csv-header">
          <div className="csv-header-title">
            <span className="csv-header-icon">📥</span>
            <span>Bulk Import {template.label}</span>
          </div>
          <button className="csv-close" onClick={onClose}>×</button>
        </div>

        {/* Steps indicator */}
        <div className="csv-steps">
          {["upload", "preview", "result"].map((s, i) => (
            <div key={s} className={`csv-step ${step === s ? "active" : ""} ${
              ["upload","preview","result"].indexOf(step) > i ? "done" : ""}`}>
              <span className="csv-step-num">{i + 1}</span>
              <span className="csv-step-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </div>
          ))}
        </div>

        {/* ── STEP 1: Upload ── */}
        {step === "upload" && (
          <div className="csv-body">
            <div
              className={`csv-dropzone ${dragOver ? "drag-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current.click()}
            >
              <div className="csv-drop-icon">📂</div>
              <p className="csv-drop-text">Drag & drop your CSV file here</p>
              <p className="csv-drop-sub">or click to browse</p>
              <input ref={fileRef} type="file" accept=".csv" hidden onChange={e => handleFile(e.target.files[0])} />
            </div>

            <div className="csv-template-row">
              <span className="csv-template-label">Don't have a file?</span>
              <button className="csv-template-btn" onClick={() => downloadTemplate(type)}>
                ⬇ Download Template
              </button>
            </div>

            <div className="csv-format-info">
              <p className="csv-format-title">Required columns:</p>
              <div className="csv-columns">
                {template.headers.map(h => (
                  <span key={h} className={`csv-col-tag ${["name","price","stock_level","party_type"].includes(h) ? "required" : ""}`}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Preview ── */}
        {step === "preview" && (
          <div className="csv-body">
            <div className="csv-preview-info">
              <span className="csv-count">{rows.length} rows found</span>
              {errors.length > 0 && (
                <span className="csv-error-count">⚠ {errors.length} validation error(s)</span>
              )}
            </div>

            {errors.length > 0 && (
              <div className="csv-errors">
                {errors.map((e, i) => <div key={i} className="csv-error-item">⚠ {e}</div>)}
              </div>
            )}

            <div className="csv-table-wrap">
              <table className="csv-preview-table">
                <thead>
                  <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {headers.map(h => <td key={h}>{row[h] || "—"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 10 && (
                <p className="csv-more">+ {rows.length - 10} more rows not shown</p>
              )}
            </div>

            <div className="csv-actions">
              <button className="csv-btn-secondary" onClick={() => setStep("upload")}>← Back</button>
              <button
                className="csv-btn-primary"
                onClick={handleImport}
                disabled={importing || errors.length > 0}
              >
                {importing ? "Importing..." : `Import ${rows.length} Records`}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Result ── */}
        {step === "result" && (
          <div className="csv-body csv-result">
            <div className={`csv-result-icon ${result.failed === 0 ? "success" : "partial"}`}>
              {result.failed === 0 ? "✅" : "⚠️"}
            </div>
            <h3 className="csv-result-title">
              {result.failed === 0 ? "Import Complete!" : "Import Finished with Errors"}
            </h3>
            <div className="csv-result-stats">
              <div className="csv-stat green">
                <span className="csv-stat-num">{result.success}</span>
                <span className="csv-stat-label">Imported</span>
              </div>
              <div className="csv-stat red">
                <span className="csv-stat-num">{result.failed}</span>
                <span className="csv-stat-label">Failed</span>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="csv-errors">
                {result.errors.map((e, i) => <div key={i} className="csv-error-item">✗ {e}</div>)}
              </div>
            )}
            <button className="csv-btn-primary" onClick={onClose}>Done</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CSVImport;
