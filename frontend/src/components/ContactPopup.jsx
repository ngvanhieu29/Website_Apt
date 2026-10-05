import { X, Phone, MessageCircle } from "lucide-react";
import img1ws from "../assets/contact/anhnhatws.jpg";
import img1zalo from "../assets/contact/anhnhatzalo.jpg";
import img2ws from "../assets/contact/hieuws.jpg";
import img2zalo from "../assets/contact/hieuzalo.jpg";

const contacts = [
  {
    name: "Nguyễn Văn Hiếu",
    phone: "+84388417492",
    whatsapp: "+8484388417492",
    zalo: "0388417492",
    whatsappQR: img2ws,
    zaloQR: img2zalo,
  },
  {
    name: "Võ Lê Anh Nhật",
    phone: "+84898220037",
    whatsapp: "+84898220037",
    zalo: "0898220037",
    whatsappQR:img1ws,
    zaloQR: img1zalo,
  },
];

export default function ContactPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-slate-900 text-center mb-1 pr-6">
          Contact Us
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-5">
          Scan QR or tap to chat on WhatsApp / Zalo
        </p>

        {/* Mobile: dọc | Desktop: ngang */}
        <div className="flex flex-col md:flex-row gap-5">
          {contacts.map((person) => (
            <div
              key={person.name}
              className="border border-slate-100 rounded-xl p-4 flex-1"
            >
              <h3 className="font-semibold text-base sm:text-lg text-slate-900 text-center">
                {person.name}
              </h3>
              <a
                href={`tel:${person.phone}`}
                className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-primary-600 my-2"
              >
                <Phone className="w-4 h-4" />
                {person.phone}
              </a>

              {/* Mobile: dọc | Desktop: ngang */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-3">
                {/* WhatsApp */}
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src={person.whatsappQR}
                    alt="WhatsApp QR"
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl border object-contain bg-white p-2"
                  />
                  <a
                    href={`https://wa.me/${person.whatsapp.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 font-medium flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>

                {/* Zalo */}
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src={person.zaloQR}
                    alt="Zalo QR"
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl border object-contain bg-white p-2"
                  />
                  <a
                    href={`https://zalo.me/${person.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 font-medium flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Zalo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}