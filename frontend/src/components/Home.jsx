import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';

/* ─── Scroll-reveal hook ─────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Data ───────────────────────────────────────────── */
const features = [
  {
    title: 'AI Concept Simulator',
    description: 'Explore AI policy concepts through RAG-powered Q&A, tailored for Moroccan demographics.',
    path: '/concepts',
    visual: (
      <div className="w-full h-28 flex items-end gap-1.5 px-3 pb-1">
        <div className="flex-1 flex flex-col gap-1 mb-auto pt-2">
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Alignment Score</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">Vision 2030</span>
            <span className="text-xs font-bold text-aegis-green bg-aegis-green-50 px-2 py-0.5 rounded-full border border-aegis-green-100">
              Aligned ✓
            </span>
          </div>
        </div>
        {[5, 9, 4, 12, 7].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-t-sm"
            style={{
              height: `${h * 5}px`,
              background: i === 3
                ? 'linear-gradient(to top, #1A4E2D, #2D7A3E)'
                : i === 4 ? '#A1D9B5' : '#D0EDD9',
              animation: `scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    title: 'Drafting Assistance',
    description: 'Generate legal texts and policy briefs that adhere to legislative drafting standards.',
    path: '/case-studies',
    visual: (
      <div className="w-full h-28 flex flex-col justify-center gap-2 px-4">
        {[1, 0.7, 1, 0.5, 0.85].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-aegis-green-100" style={{ width: `${w * 100}%` }}>
            <div
              className="h-full rounded-full bg-aegis-green/40"
              style={{
                width: i === 3 ? '60%' : '100%',
                animation: `scaleIn 0.5s ease-out ${i * 70}ms both`,
                transformOrigin: 'left',
              }}
            />
          </div>
        ))}
        <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center mt-1 self-start">
          <ArrowRight size={14} className="text-white" />
        </div>
      </div>
    ),
  },
  {
    title: 'Impact Simulator',
    description: 'Predict socioeconomic shifts with precision AI modeling based on international evidence.',
    path: '/simulator',
    visual: (
      <div className="w-full h-28 flex items-end gap-3 px-4 pb-2 justify-end">
        <div className="flex items-center gap-1.5 mb-auto pt-2 mr-auto">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: ['#D0EDD9', '#2D7A3E', '#1A4E2D'][i],
                animation: `scaleIn 0.4s ease-out ${i * 100}ms both`,
              }}
            />
          ))}
        </div>
        {[52, 72, 92].map((h, i) => (
          <div
            key={i}
            className="rounded-t-md"
            style={{
              width: '28px',
              height: `${h}px`,
              background: `linear-gradient(to top, ${['#1A4E2D','#23633A','#2D7A3E'][i]}, ${['#2D7A3E','#3D9A52','#56B36A'][i]})`,
              animation: `scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100 + 100}ms both`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
    ),
  },
];

const standardPoints = [
  'GDPR & Moroccan Data Law Aligned',
  'Multi-ministerial Integration Capable',
  'Real-time Socio-Economic Analysis',
];

/* ─── Component ──────────────────────────────────────── */
export default function Home() {
  const [featRef, featVis]    = useReveal();
  const [standardRef, stdVis] = useReveal(0.1);

  return (
    <div className="space-y-24">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative text-center pt-20 pb-10 overflow-hidden">

        {/* ── Content ── */}
        <div className="relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm
                       border border-white/80 rounded-full text-xs font-semibold text-gray-500
                       shadow-sm mb-10"
            style={{ animation: 'var(--animate-fade-in)', animationDelay: '0ms' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-aegis-green"
              style={{ animation: 'dotPulse 2s ease-in-out infinite' }}
            />
            AI Concept Simulator
          </div>

          {/* Heading */}
          <h1
            className="text-6xl sm:text-7xl font-extrabold text-ink leading-[1.02]
                       tracking-tight mb-6 max-w-3xl mx-auto"
            style={{ animation: 'var(--animate-fade-in-up)', animationDelay: '80ms' }}
          >
            Bridging Data to<br />Policy Action
          </h1>

          {/* Subtitle */}
          <p
            className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed text-lg"
            style={{ animation: 'var(--animate-fade-in-up)', animationDelay: '160ms' }}
          >
            The smartest way for Moroccan policymakers to simulate economic
            impacts, draft legislation, and analyze public sentiment in real-time.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center justify-center gap-4 mb-8"
            style={{ animation: 'var(--animate-fade-in-up)', animationDelay: '240ms' }}
          >
            <Link
              to="/simulator"
              className="px-7 py-3.5 bg-aegis-green text-white text-sm font-semibold rounded-full
                         hover:bg-aegis-green-700 transition-all duration-200
                         shadow-lg shadow-aegis-green/30 hover:shadow-aegis-green/50
                         hover:-translate-y-0.5"
            >
              Run New Simulation
            </Link>
          </div>

          {/* Compliance badge */}
          <div
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium"
            style={{ animation: 'var(--animate-fade-in)', animationDelay: '340ms' }}
          >
            <Shield size={12} className="text-aegis-green" />
            Secure Government Standard Compliance
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CORE CAPABILITIES
      ════════════════════════════════════════ */}
      <section ref={featRef}>
        <div
          className="text-center mb-14"
          style={{
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            opacity: featVis ? 1 : 0,
            transform: featVis ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-aegis-green uppercase tracking-widest mb-4">
            <span>✦</span> Core Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            Why Policymakers Choose Aegis
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
            We combine advanced LLMs with validated econometric models to simplify the
            complexity of national decision-making.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ title, description, path, visual }, idx) => (
            <Link
              key={path}
              to={path}
              className="block bg-white/70 backdrop-blur-sm rounded-2xl border border-white/90
                         overflow-hidden hover:-translate-y-1.5 hover:shadow-xl
                         hover:shadow-aegis-green/10 hover:border-aegis-green-100
                         transition-all duration-300 group"
              style={{
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${idx * 120}ms`,
                opacity: featVis ? 1 : 0,
                transform: featVis ? 'translateY(0)' : 'translateY(32px)',
              }}
            >
              {/* Visual */}
              <div className="bg-great-white/60 border-b border-white/70 h-34 flex items-center overflow-hidden"
                   style={{ height: '136px' }}>
                {visual}
              </div>
              {/* Text */}
              <div className="p-6">
                <h3 className="font-bold text-ink text-lg mb-2 group-hover:text-aegis-green transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE AEGIS STANDARD
      ════════════════════════════════════════ */}
      <section
        ref={standardRef}
        className="relative"
      >
        {/* Background shape for this section */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: 'radial-gradient(ellipse at 80% 50%, rgba(45,122,62,0.07) 0%, transparent 65%)',
          }}
        />

        <div
          className="relative flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
          style={{
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            opacity: stdVis ? 1 : 0,
            transform: stdVis ? 'translateY(0)' : 'translateY(32px)',
          }}
        >
          {/* Left */}
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-5">
              The Aegis Standard
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
              Our platform is architected for the unique needs of the Moroccan
              administration. Grounded in international policy evidence.
            </p>
            <ul className="space-y-4">
              {standardPoints.map((point, i) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm font-semibold text-ink"
                  style={{
                    transition: `opacity 0.5s ease, transform 0.5s ease`,
                    transitionDelay: `${i * 100 + 200}ms`,
                    opacity: stdVis ? 1 : 0,
                    transform: stdVis ? 'translateX(0)' : 'translateX(-16px)',
                  }}
                >
                  <CheckCircle2 size={17} className="text-aegis-green shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — stat cards */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 shrink-0">
            {/* Benchmarks */}
            <div
              className="bg-white/80 backdrop-blur-sm border border-aegis-green-100 rounded-2xl p-7 w-56 shadow-sm"
              style={{
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: '150ms',
                opacity: stdVis ? 1 : 0,
                transform: stdVis ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Benchmarks</p>
              <p className="text-5xl font-extrabold text-ink mb-1.5">8+</p>
              <p className="text-sm text-gray-500 mb-4">Global Policies Integrated</p>
              <div className="w-10 h-1.5 bg-aegis-green rounded-full" />
            </div>

            {/* Performance */}
            <div
              className="bg-rich-black rounded-2xl p-7 w-56 text-white shadow-lg"
              style={{
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: '280ms',
                opacity: stdVis ? 1 : 0,
                transform: stdVis ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              <p className="text-xs font-bold text-aegis-green-200 uppercase tracking-wider mb-3">Performance</p>
              <p className="text-4xl font-extrabold mb-0.5">&lt;2s</p>
              <p className="text-lg font-bold italic mb-1.5">Response</p>
              <p className="text-sm text-gray-400 mb-5">Groq-Powered Inference</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Shield size={11} className="text-aegis-green-200" />
                <span className="font-bold uppercase tracking-wide">70B Parameter Model</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
