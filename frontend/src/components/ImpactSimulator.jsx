import { useState, useEffect } from 'react';
import { Play, Loader2, AlertTriangle, CheckCircle2, BookOpen, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getTemplates, predictImpact } from '../api';

const COUNTRY_FLAGS = {
  'EU':          '\u{1F1EA}\u{1F1FA}',
  'Canada':      '\u{1F1E8}\u{1F1E6}',
  'Singapore':   '\u{1F1F8}\u{1F1EC}',
  'Rwanda':      '\u{1F1F7}\u{1F1FC}',
  'Brazil':      '\u{1F1E7}\u{1F1F7}',
  'UK':          '\u{1F1EC}\u{1F1E7}',
  'Tunisia':     '\u{1F1F9}\u{1F1F3}',
  'South Korea': '\u{1F1F0}\u{1F1F7}',
};

function DimensionBar({ dimension }) {
  const score = dimension.score;
  const pct   = Math.min(100, Math.max(0, score * 10));
  const color = score >= 7 ? 'bg-aegis-green' : score >= 4 ? 'bg-yellow-500' : 'bg-red-400';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-ink text-sm">{dimension.name}</h4>
        <div className="flex items-center gap-1">
          <span className="text-base font-bold text-ink">{score.toFixed(1)}</span>
          <span className="text-xs text-gray-400">/10</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2.5">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{dimension.explanation}</p>
    </div>
  );
}

/* Markdown component overrides for formatted full analysis */
const analysisComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-ink mt-2 mb-4 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-aegis-green mt-6 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-ink mt-4 mb-1.5">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-gray-700 leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-3 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-3 ml-1 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-aegis-green shrink-0" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
};

function ImpactReport({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-aegis-green-50 rounded-xl p-5 border border-aegis-green-100">
        <h3 className="text-sm font-bold text-aegis-green-800 mb-2">Executive Summary</h3>
        <p className="text-sm text-aegis-green-900 leading-relaxed">{result.executive_summary}</p>
        <div className="flex gap-4 mt-3 text-xs text-aegis-green font-medium">
          <span>Evidence base: {result.evidence_base_size} policies</span>
          <span>Processing: {(result.processing_time_ms / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* Impact Dimensions */}
      <div>
        <h3 className="text-sm font-bold text-ink mb-3">Impact Dimensions</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {result.impact_dimensions?.map((dim, i) => (
            <DimensionBar key={i} dimension={dim} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-ink mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 size={14} className="text-aegis-green mt-0.5 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Analysis */}
      {result.full_analysis && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
            <FileText size={16} className="text-aegis-green" />
            <h3 className="text-base font-bold text-ink">Full Analysis</h3>
          </div>
          <div className="max-w-none">
            <ReactMarkdown components={analysisComponents}>
              {result.full_analysis}
            </ReactMarkdown>
          </div>

          {/* Backing Documents */}
          {result.similar_policies?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} className="text-aegis-green" />
                <h4 className="text-sm font-bold text-ink">Backing Documents</h4>
                <span className="ml-auto text-xs text-gray-400">
                  {result.similar_policies.length} source{result.similar_policies.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {result.similar_policies.map(sp => (
                  <div
                    key={sp.id}
                    className="flex items-start gap-2.5 bg-aegis-green-50 border border-aegis-green-100
                               rounded-lg px-3 py-2.5"
                  >
                    <span className="text-base shrink-0 mt-0.5">{COUNTRY_FLAGS[sp.country] || '🌐'}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink leading-snug truncate">{sp.policy_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {sp.country} · {sp.policy_type?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImpactSimulator() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    policy_name:  '',
    description:  '',
    sectors:      [],
    policy_type:  'comprehensive',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  const sectors     = ['agriculture', 'tourism', 'manufacturing', 'public_services', 'healthcare', 'education', 'finance'];
  const policyTypes = ['comprehensive', 'sectoral', 'voluntary', 'sandbox', 'national_strategy', 'bill'];

  useEffect(() => {
    getTemplates().then(res => setTemplates(res.data)).catch(() => {});
  }, []);

  const loadTemplate = t => {
    setForm({ policy_name: t.name, description: t.description, sectors: t.sectors, policy_type: t.policy_type });
    setResult(null);
    setError('');
  };

  const toggleSector = s => setForm(prev => ({
    ...prev,
    sectors: prev.sectors.includes(s) ? prev.sectors.filter(x => x !== s) : [...prev.sectors, s],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.policy_name || !form.description) { setError('Please provide a policy name and description.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await predictImpact(form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please check that the LLM service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-aegis-green uppercase tracking-widest mb-3">
          <span>✦</span> AI Policy Analysis
        </div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Impact Simulator</h1>
        <p className="text-gray-500 text-sm mt-1">Predict how a proposed AI policy would impact Morocco.</p>
      </div>

      {templates.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-2">Start from a template:</p>
          <div className="flex flex-wrap gap-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => loadTemplate(t)}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg
                           hover:border-aegis-green-200 hover:bg-aegis-green-50 hover:text-aegis-green
                           transition-colors duration-200"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Policy Name</label>
          <input
            type="text"
            value={form.policy_name}
            onChange={e => setForm(prev => ({ ...prev, policy_name: e.target.value }))}
            placeholder="e.g., Morocco AI Transparency Act"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-aegis-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the proposed policy..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-aegis-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Target Sectors</label>
          <div className="flex flex-wrap gap-2">
            {sectors.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSector(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-200 ${
                  form.sectors.includes(s)
                    ? 'bg-aegis-green-50 border-aegis-green-200 text-aegis-green'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Policy Type</label>
          <select
            value={form.policy_type}
            onChange={e => setForm(prev => ({ ...prev, policy_type: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-aegis-green focus:border-transparent"
          >
            {policyTypes.map(pt => (
              <option key={pt} value={pt}>{pt.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-aegis-green text-white rounded-xl hover:bg-aegis-green-700
                     disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm
                     flex items-center justify-center gap-2 transition-colors duration-200"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Running simulation&hellip;</>
          ) : (
            <><Play size={16} /> Run Impact Simulation</>
          )}
        </button>
      </form>

      <ImpactReport result={result} />
    </div>
  );
}
