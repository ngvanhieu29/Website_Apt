import img1 from "../assets/facilities/f1.jpg";
import img2 from "../assets/facilities/f2.jpg";
import img3 from "../assets/facilities/f3.jpg";
import { motion } from "framer-motion";
const items = [
  {
    title: "La énMay Spa",
    description: "A serene corner for premium experiences",
    image: img1, // Replace with your image path
  },
  {
    title: "The Symphony Restaurant",
    description:
      "An artfully blend of traditional Vietnamese ingredients and techniques with European culinary influences that promises unforgettable dining experience. We also offer an exceptional selection of authentic local cuisine.",
    image: img2, // Replace with your image path
  },
  {
    title: "Majesty Sky Bar",
    description:
      "Immerse yourself in the vibrant nightlife of Hanoi from above",
    image: img3, // Replace with your image path
  },
];

function HoverCard({ title, image, description }) {
  return (
    <div className="relative group w-[350px] max-w-[450px] sm:max-w-[500px] sm:w-[400px] md:w-[400px] hover:w-[850px] md:max-w-[850px] transition-all  h-[500px] duration-500 ">
      <img
        src={image}
        className="absolute inset-0 object-cover w-full h-full "
        loading="lazy"
      />
      <div className="absolute bottom-0 w-full px-8 pb-8 text-white duration-300 bg-black bg-opacity-50 opacity-0 group-hover:delay-300 font-playfair group-hover:opacity-100 ">
        <h1 className="py-2 text-[20px] font-semibold ">{title}</h1>
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
    <div className="flex flex-col items-center  md:flex-row justify-center max-w-[1200px] py-2 sm:py-4 mx-auto ">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
 <div className="px-2 md:px-24 w-full items-center  text-center">
        
          <p className="text-2xl font-playfair lg:pb-2 font-semibold text-slate-900 uppercase md:text-xl xl:text-2xl">
            Facilities
          </p>
      
       
        <p className="text-[18px] font-thin">
          Take a look at the rich list of facilities offered by our hotel. Every
          small care has been taken to make your stay memorable and delightful.
        </p>
      </div>

      <ImageGrid />
        
      </section>
     
    </motion.section>
  );
}
export default Facilities;
