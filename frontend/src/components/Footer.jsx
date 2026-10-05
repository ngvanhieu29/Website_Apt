import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                DaNang<span className="text-primary-400">Stay</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium apartments and serviced residences tailored for expatriates in Da Nang City.
              Live comfortably, live beautifully.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition">
                  All Apartments
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Ngu Hanh Son District
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Son Tra District
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Hai Chau District
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Short-term Rentals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Long-term Leases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Corporate Housing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition">
                  Relocation Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact placeholder */}
          <div id="contact">
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>Da Nang, Vietnam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span className=" italic">+84 388 417 492 | +84 898 220 037</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span className=" italic">nvanhieu29@gmail.com | voleanhnhat20031@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DaNangStay. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
