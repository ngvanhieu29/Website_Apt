import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top section */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-display">
                DaNang<span className="text-primary-400">Stay</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Premium apartments and serviced residences tailored for
              expatriates in Da Nang City. Live comfortably, live beautifully.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold tracking-wide text-white">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition hover:text-primary-400">
                  All Apartments
                </Link>
              </li>
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Ngu Hanh Son District
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Son Tra District
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Hai Chau District
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold tracking-wide text-white">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Short-term Rentals
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Long-term Leases
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Corporate Housing
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-primary-400">
                  Relocation Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact placeholder */}
          <div id="contact">
            <h4 className="mb-4 font-semibold tracking-wide text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>Da Nang, Vietnam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span className="italic ">
                  +84 388 417 492 | +84 898 220 037
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span className="italic ">
                  nvanhieu29@gmail.com | voleanhnhat20031@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 mx-auto text-xs max-w-7xl sm:px-6 lg:px-8 sm:flex-row text-slate-500">
          <p>
            © {new Date().getFullYear()} DaNangStayHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-slate-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
