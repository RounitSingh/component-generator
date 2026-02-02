// import PricingCard from "@/components/ui/pricingCard";
// import { motion } from "framer-motion";

// const PricingSection = () => {
//   return (
//     <section className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:py-16">
//       <div className="mx-auto max-w-6xl">
//         {/* Heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="mb-12 sm:mb-16 text-center px-2"
//         >
//           <h1 className="mb-4 font-mono text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
//             Choose the plan that suits your needs
//           </h1>
//           <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
//             Pick a plan that suits your needs and get started instantly.
//           </p>
//         </motion.div>

//         {/* Pricing Cards */}
//         <div className="
//           flex flex-col sm:flex-row flex-wrap 
//           items-stretch justify-center 
//           gap-6 sm:gap-8
//         ">
//           <motion.div
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="w-full sm:w-[300px]"
//           >
//             <PricingCard
//               plan="Free"
//               price="₹0"
//               period="Forever"
//               description="Perfect for getting started and exploring our features."
//               buttonText="Get Started"
//               bgColor="bg-purple-600"
//             />
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="w-full sm:w-[300px]"
//           >
//             <PricingCard
//               plan="Pro Monthly"
//               price="₹20/"
//               period="Month"
//               description="Great for individuals who need more power and flexibility."
//               buttonText="Subscribe"
//               bgColor="bg-indigo-600"
//               popular
//             />
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="w-full sm:w-[300px]"
//           >
//             <PricingCard
//               plan="Pro Yearly"
//               price="₹50/"
//               period="Year"
//               description="Best value! Save more with our annual plan."
//               buttonText="Subscribe"
//               bgColor="bg-emerald-600"
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PricingSection;
import PricingCard from "@/components/ui/pricingCard";
import { motion } from "framer-motion";


const PricingSection = () => {
  return (
    <section className="max-h-screen bg-neutral-950 px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 font-['Space_Grotesk'] text-3xl font-black text-white sm:text-5xl">
            Upgrade your plan
          </h1>
          <p className="text-lg text-neutral-400">
            Pick a plan that suits your needs and get started instantly.
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:flex-wrap sm:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <PricingCard
              plan="Free"
              price="₹0"
              period="Forever"
              description="Perfect for getting started and exploring our features."
              buttonText="Get Started"
              bgColor="bg-purple-600"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PricingCard
              plan="Pro Monthly"
              price="₹20/"
              period="Month"
              description="Great for individuals who need more power and flexibility."
              buttonText="Subscribe"
              bgColor="bg-indigo-600"
              popular
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PricingCard
              plan="Pro Yearly"
              price="₹50/"
              period="Year"
              description="Best value! Save more with our annual plan."
              buttonText="Subscribe"
              bgColor="bg-emerald-600"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
