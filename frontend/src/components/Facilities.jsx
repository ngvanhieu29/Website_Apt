import img1 from "../assets/facilities/f1.jpg";
import img2 from "../assets/facilities/f2.jpg";
import img3 from "../assets/facilities/f3.jpg";
import { motion } from "framer-motion";
const items = [
  {
    title: "Fitness Gym",
    description:
      "Stay active with our fully equipped modern gym, featuring cardio machines, free weights and everything you need for a great workout.",
    image: img1,
  },
  {
    title: "Swimming Pool",
    description:
      "Relax and unwind in our outdoor swimming pool with stunning views. Perfect for a refreshing dip or leisurely swim under the sun.",
    image: img2,
  },
  {
    title: "Sauna",
    description:
      "Rejuvenate your body and mind in our private sauna. A perfect place to destress and enjoy ultimate relaxation after a long day.",
    image: img3,
  },
];

function HoverCard({ title, image, description }) {
  return (
    <div className="relative group w-[350px] rounded-2xl overflow-hidden max-w-[450px] sm:max-w-[500px] sm:w-[400px] md:w-[400px] hover:w-[850px] md:max-w-[850px] transition-all  h-[500px] duration-500 ">
      <img
        src={image}
        className="absolute inset-0 object-cover w-full h-full "
        loading="lazy"
      />
      <div className="absolute bottom-0 w-full px-8 pb-8 text-white duration-300 bg-black bg-opacity-50 opacity-0 group-hover:delay-300  group-hover:opacity-100 ">
        <h1 className="py-2 text-[20px] font-semibold font-playfair ">{title}</h1>
        <p className="text-[15px]">{description}</p>
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 bg-black opacity-100 bg-opacity-70 group-hover:hidden">
        <div className="relative my-auto text-xl text-center text-white font-playfair ">
          {title}
        </div>
      </div>
    </div>
  );
}

function ImageGrid() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-8 items-center md:flex-row justify-center max-w-[1200px] mx-auto">
      {items.map((item, index) => (
        <HoverCard
          key={index}
          title={item.title}
          description={item.description}
          image={item.image}
        />
      ))}
    </div>
  );
}

function Facilities() {
  return (
    <motion.section
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
      className=""
    >
      <section className="max-w-7xl mx-auto px-4 mb-0 md:pb-12 sm:px-6 lg:px-8 py-6">
 <div className="px-2 md:px-24 w-full items-center  text-center">
        
          <p className="font-playfair lg:pb-2 font-semibold text-slate-900 uppercase text-xl xl:text-2xl">
            Facilities
          </p>
      
       
        <p className="text-sm md:text-lg  text-slate-500 mt-1">
          Enjoy premium amenities designed for your comfort — from a modern gym and outdoor pool to a relaxing sauna, everything you need for a perfect stay.
        </p>
      </div>

      <ImageGrid />
        
      </section>
     
    </motion.section>
  );
}
export default Facilities;
