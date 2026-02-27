import { Link, useLocation } from 'react-router-dom';
import { Shield, House, Brain, BookOpen, ChartColumn } from 'lucide-react';

const navItems = [
  { path: '/',             label: 'Home',         Icon: House        },
  { path: '/concepts',     label: 'Concepts',     Icon: Brain        },
  { path: '/case-studies', label: 'Case Studies', Icon: BookOpen     },
  { path: '/simulator',    label: 'Simulator',    Icon: ChartColumn  },
];

const footerLinks = {
  Platform: [
    { label: 'Simulation Engine', to: '/simulator'    },
    { label: 'Data Sources',      to: '/case-studies' },
    { label: 'Security',          to: '/'             },
    { label: 'Case Studies',      to: '/case-studies' },
  ],
  Resources: [
    { label: 'Documentation',  to: '/' },
    { label: 'API Reference',  to: '/' },
    { label: 'Research Papers',to: '/' },
    { label: 'Community Forum',to: '/' },
  ],
  Contact: [
    { label: 'Technopolis, Rabat',  to: '/' },
    { label: 'contact@aegis.ma',    to: '/' },
    { label: '+212 5 37 00 00 00',  to: '/' },
  ],
};

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col bg-great-white"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(75,127,232,0.22) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }}
    >
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-violet-blue rounded-lg flex items-center justify-center shadow-sm">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-ink text-lg tracking-tight">PolicyBridge</span>
          </Link>

          {/* Centre links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, Icon }) => {
              const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-violet-blue-50 text-violet-blue'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            to="/simulator"
            className="px-5 py-2.5 bg-violet-blue text-white text-sm font-semibold rounded-full
                       hover:bg-violet-blue-700 transition-all duration-200 shadow-sm
                       hover:shadow-md hover:shadow-violet-blue/25"
          >
            Start Simulation
          </Link>
        </div>
      </nav>

      {/* ── Page ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-rich-black text-white mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-violet-blue rounded-lg flex items-center justify-center">
                <Shield size={13} className="text-white" />
              </div>
              <span className="font-bold text-lg">PolicyBridge</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering Moroccan governance with data-driven AI solutions.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-600">&copy; 2024 PolicyBridge. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs text-gray-600">
              <Link to="/" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
