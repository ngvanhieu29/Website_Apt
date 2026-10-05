import { Link } from 'react-router-dom';
import {
  Building2,
  Menu,
  X,
  QrCode,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const TELEGRAM_LINK = 'https://t.me/+katg_N5Zo001YmU9';

export default function Header({ onOpenContact }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopGroupOpen, setDesktopGroupOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState(false);

  const groupRef = useRef(null);

  // Đóng dropdown desktop khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        groupRef.current &&
        !groupRef.current.contains(event.target)
      ) {
        setDesktopGroupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Khi đóng mobile menu thì đóng luôn Our Group
  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileGroupOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-xl shadow-md group-hover:shadow-lg transition">
                <Building2 className="w-6 h-6 text-white" />
              </div>

              <div>
                <span className="font-display text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  DaNangStay<span className="text-primary-600">Hub</span>
                </span>

                <p className="text-[10px] text-slate-500 -mt-0.5 tracking-widest uppercase hidden sm:block">
                  Premium Living for Expats
                </p>
              </div>
            </Link>

            {/* ================= DESKTOP ================= */}
            <nav className="hidden md:flex items-center gap-6">

              <Link
                to="/"
                className="text-slate-600 hover:text-primary-600 font-medium transition"
              >
                Apartments
              </Link>

              <Link
                to="/about"
                className="text-slate-600 hover:text-primary-600 font-medium transition"
              >
                About
              </Link>

              {/* OUR GROUP */}
              <div
                ref={groupRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setDesktopGroupOpen((prev) => !prev)
                  }
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-medium transition"
                >
                  Our Group

                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      desktopGroupOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* DROPDOWN */}
                {desktopGroupOpen && (
                  <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 z-[9999]">

                    <div className="text-center">

                      

                      <h3 className="text-lg font-bold text-slate-900">
                        Join Our Group
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Connect with DaNangStay on Telegram
                      </p>

                      {/* QR */}
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl">
                          <QRCodeSVG
                            value={TELEGRAM_LINK}
                            size={180}
                            level="H"
                            includeMargin
                          />
                        </div>
                      </div>

                      {/* LINK */}
                      <div className="bg-slate-50 rounded-xl p-3 mb-3 text-left">
                        <p className="text-[11px] text-slate-500 mb-1">
                          Telegram Group
                        </p>

                        <p className="text-sm font-medium text-slate-700 truncate">
                          t.me/+katg_N5Zo001YmU9
                        </p>
                      </div>

                      {/* TELEGRAM */}
                      <a
                        href={TELEGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
                        onClick={() => setDesktopGroupOpen(false)}
                      >
                        Open Telegram
                        <ExternalLink className="w-4 h-4" />
                      </a>

                    </div>
                  </div>
                )}
              </div>

              {/* CONTACT */}
              <button
                type="button"
                onClick={onOpenContact}
                className="btn-primary text-sm"
              >
                Contact
              </button>

            </nav>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => {
                setMobileOpen((prev) => !prev);
                setMobileGroupOpen(false);
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">

            <div className="px-4 py-4 space-y-1">

              {/* Apartments */}
              <Link
                to="/"
                className="block py-3 text-slate-700 font-medium"
                onClick={closeMobileMenu}
              >
                Apartments
              </Link>

              {/* About */}
              <Link
                to="/about"
                className="block py-3 text-slate-700 font-medium"
                onClick={closeMobileMenu}
              >
                About
              </Link>

              {/* OUR GROUP */}
              <button
                type="button"
                className="flex items-center justify-between w-full py-3 text-slate-700 font-medium"
                onClick={() =>
                  setMobileGroupOpen((prev) => !prev)
                }
              >
                <span className="flex items-center gap-2">
                  
                  Our Group
                </span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileGroupOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* MOBILE GROUP CONTENT */}
              {mobileGroupOpen && (
                <div className="bg-slate-50 rounded-xl p-4 mt-1 mb-2">

                  <div className="text-center">

                    <h3 className="font-bold text-slate-900">
                      Join Our Group
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Scan to join our Telegram group
                    </p>

                    {/* QR */}
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <QRCodeSVG
                          value={TELEGRAM_LINK}
                          size={180}
                          level="H"
                          includeMargin
                        />
                      </div>
                    </div>

                    {/* Telegram URL */}
                    <div className="bg-white rounded-lg p-3 mb-3 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">
                        Telegram Group
                      </p>

                      <p className="text-sm text-slate-700 break-all">
                        t.me/+katg_N5Zo001YmU9
                      </p>
                    </div>

                    {/* OPEN TELEGRAM */}
                    <a
                      href={TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
                      onClick={() => {
                        setMobileGroupOpen(false);
                        setMobileOpen(false);
                      }}
                    >
                      Open Telegram
                      <ExternalLink className="w-4 h-4" />
                    </a>

                  </div>
                </div>
              )}

              {/* CONTACT */}
              <button
                type="button"
                className="block w-full text-left py-3 text-slate-700 font-medium"
                onClick={() => {
                  closeMobileMenu();
                  onOpenContact();
                }}
              >
                Contact
              </button>

            </div>
          </div>
        )}
      </header>
    </>
  );
}