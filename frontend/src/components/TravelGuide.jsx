import { motion } from "framer-motion";
import img1 from "../assets/guide/g1.jpeg";
import img2 from "../assets/guide/g2.jpg";
import img3 from "../assets/guide/g3.jpg";
import img4 from "../assets/guide/g4.jpg";
import img5 from "../assets/guide/g5.jpg";

const imgGrid = [
  { title: "Attractions", image: img1 },
  { title: "Night Life", image: img2 },
  { title: "Food & Drinks", image: img3 },
  { title: "Shopping", image: img4 },
  { title: "Do & Don'ts", image: img5 },
];

function TravelGuide() {
  return (
    <motion.div
      initial={{ y: 220, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.2,
        y: { type: "spring", stiffness: 40 },
        opacity: { duration: 1 },
        ease: "backIn",
        duration: 1,
      }}
      className=" bg-slate-50 "
    ><section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
      <div className="w-full items-center  text-center">
      
          <p className="font-playfair lg:pb-2 font-semibold text-slate-900 uppercase text-xl xl:text-2xl ">
            TRAVEL GUIDE
          </p>

        
        <p className="text-sm md:text-lg text-slate-500 mt-1"> 
          Discover our extensive guide for first-timers in Da Nang with
          recommendations for local dishes, tourist attractions and travel tips
          for Vietnam’s vibrant city!
        </p>
      </div>

      <ImageGrid />
      </section>
      
    </motion.div>
  );
}

function ImageGrid() {
  return (
    <ul className="gap-4 sm:gap-6 py-4 sm:py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-4 sm:mx-8 md:mx-auto md:max-w-[1300px]">
      {imgGrid.map((items, i) => (
        <li
          key={items.title}
          className={`relative group overflow-hidden rounded-2xl h-64 sm:h-72 md:h-80
            ${i === 0 ? "sm:col-span-2 md:col-span-2" : "col-span-1"}
          `}
        >
          <div className="relative justify-center w-full h-full">
            <img
              className="absolute w-full h-full duration-500 group-hover:scale-110 object-cover"
              src={items.image}
              alt={items.title}
              loading="lazy"
            />
            <button className="absolute px-4 py-2 mx-auto text-lg sm:text-xl text-center text-white transition-all duration-500 border border-white/70 rounded-lg hover:bg-slate-100 hover:text-black inset-x-8 max-w-48 group-hover:z-50 bottom-8 sm:bottom-10 group-hover:mb-8 sm:group-hover:mb-16 font-playfair">
              {items.title}
            </button>
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 bg-black opacity-0 bg-opacity-70 group-hover:opacity-100 rounded-2xl"></div>
        </li>
      ))}
    </ul>
  );
}

export default TravelGuide;
