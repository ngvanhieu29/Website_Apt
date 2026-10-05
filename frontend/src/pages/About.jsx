import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Award, Users, Home } from "lucide-react";
import ava1 from "../assets/contact/ava1.jpg";
import ava2 from "../assets/contact/ava2.jpg";

const agents = [
  {
    name: "Nguyễn Văn Hiếu",
    role: "Property Consultant",
    phone: "0388417492",
    whatsapp: "84388417492",
    zalo: "0388417492",
    bio: "With years of experience in the Da Nang real estate market, Hiếu specializes in helping expatriates find the perfect home. Trusted, professional, and always ready to support.",
    avatar: ava1,
  },
  {
    name: "Võ Lê Anh Nhật",
    role: "Property Consultant",
    phone: "0898220037",
    whatsapp: "84898220037",
    zalo: "0898220037",
    bio: "Nhật is passionate about connecting expats with quality apartments in Da Nang. Friendly, responsive, and dedicated to making your relocation smooth and enjoyable.",
    avatar: ava2,
  },
];

const stats = [
  { icon: Home, label: "Apartments Listed", value: "2000+" },
  { icon: Users, label: "Happy Clients", value: "500+" },
  { icon: Award, label: "Years Experience", value: "2+" },
  { icon: MapPin, label: "Areas Covered", value: "Da Nang" },
];

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl md:text-5xl font-bold mb-4"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            We are a dedicated team helping expatriates find premium apartments
            in Da Nang — with trust, care, and local expertise.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-center"
            >
              <item.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-slate-900 uppercase">
            Our Team
          </h2>
          <p className="text-slate-500 mt-2">
            Meet the consultants ready to help you find your next home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Ảnh to hơn */}
              <div className="h-72 md:h-80 overflow-hidden">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-6 md:p-8">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
                  {agent.name}
                </h3>
                <p className="text-sm text-primary-600 font-medium mb-3">
                  {agent.role}
                </p>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-5">
                  {agent.bio}
                </p>

                {/* Liên hệ */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {agent.phone}
                  </a>
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`https://zalo.me/${agent.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Zalo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            At DaNangStay, we believe finding a home abroad should be simple and
            stress-free. We carefully curate quality apartments and provide
            personal support so every expat can settle in Da Nang with confidence.
          </p>
        </div>
      </section>
    </div>
  );
}