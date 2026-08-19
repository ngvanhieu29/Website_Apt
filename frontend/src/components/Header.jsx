import { Link } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky  top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-xl shadow-md group-hover:shadow-lg transition">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                DaNang<span className="text-primary-600">Stay</span>
              </span>
              <p className="text-[10px] text-slate-500 -mt-0.5 tracking-widest uppercase hidden sm:block">
                Premium Living for Expats
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition">
              Apartments
            </Link>
            <a href="#about" className="text-slate-600 hover:text-primary-600 font-medium transition">
              About
            </a>
            <a href="#contact" className="text-slate-600 hover:text-primary-600 font-medium transition">
              Contact
            </a>
            <a
              href="#contact"
              className="btn-primary text-sm"
            >
              List Your Property
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-slate-700 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Apartments
            </Link>
            <a href="#about" className="block py-2 text-slate-700 font-medium">
              About
            </a>
            <a href="#contact" className="block py-2 text-slate-700 font-medium">
              Contact
            </a>
            <a href="#contact" className="btn-primary inline-block text-sm mt-2">
              List Your Property
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
