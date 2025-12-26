import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import createGlobe from "cobe";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
  IconPlus,
  IconClock,
  IconArrowUp,
} from "@tabler/icons-react";
import { cn } from "../lib/utils";

// ============================================
// PRODUCT DATA
// ============================================
const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
  },
  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];

// ============================================
// HERO PARALLAX SECTION
// ============================================
const HeroHeader = ({ onPromptSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    if (onPromptSubmit) {
      onPromptSubmit(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 flex items-center justify-center min-h-[60vh] z-50">
      <div className="max-w-3xl w-full relative z-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl bg-black/70 border border-white/10 overflow-hidden"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            className="w-full bg-transparent text-white placeholder-white/40 text-base md:text-lg px-6 py-5 resize-none focus:outline-none h-[100px] overflow-hidden"
            style={{ scrollbarWidth: "none" }}
          />

          <div className="px-4 py-3 flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <IconPlus size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <IconClock size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              
              <button
                type="button"
                onClick={handleSubmit}
                className="p-2.5 bg-blue-500 hover:bg-blue-500/90 text-white cursor-pointer rounded-full transition-colors shadow-lg shadow-blue-500/25"
              >
                <IconArrowUp size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-xl"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none rounded-xl transition-opacity duration-300"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-medium transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};

const HeroParallax = ({ onPromptSubmit }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-400, 200]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[200vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-black"
    >
      <HeroHeader onPromptSubmit={onPromptSubmit} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// ============================================
// GLOBE COMPONENT
// ============================================
const Globe = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.1, 0.8, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};

// ============================================
// FEATURES SECTION SKELETONS
// ============================================
const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-gray-900 shadow-2xl group h-full rounded-lg">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
          />
        </div>
      </div>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-black via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

const SkeletonTwo = () => {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={`images-first-${idx}`}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-gray-900 border  shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={`images-second-${idx}`}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-gray-900 border  shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <a
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex gap-10 h-full group/image"
    >
      <div className="w-full mx-auto bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
          <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto" />
          <img
            src="https://images.unsplash.com/photo-611162616475-46b635cb6868?w=800&auto=format&fit=crop"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
          />
        </div>
      </div>
    </a>
  );
};

const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

// ============================================
// FEATURES SECTION
// ============================================
const FeatureCard = ({ children, className }) => {
  return (
    <div className={cn("p-4 sm:p-8 relative overflow-hidden", className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-semibold">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-gray-400 font-normal",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Track issues effectively",
      description:
        "Track and manage your project issues with ease using our intuitive interface.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b border-white/20 lg:border-r ",
    },
    {
      title: "Capture pictures with AI",
      description:
        "Capture stunning photos effortlessly using our advanced AI technology.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2  border-white/20",
    },
    {
      title: "Watch our AI on YouTube",
      description:
        "Whether its you or Tyler Durden, you can get to know about our product on YouTube",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r border-white/20 ",
    },
    {
      title: "Deploy in seconds",
      description:
        "With our blazing fast, state of the art, cutting edge cloud services - you can deploy your model in seconds.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b border-white/20 lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 py-10 lg:py-20 max-w-6xl mx-auto bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="px-8"
      >
        <h4 className="text-2xl lg:text-4xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-white">
          Packed with thousands of features
        </h4>
        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-gray-400 text-center font-normal">
          From Image generation to video generation, Everything AI has APIs for
          literally everything. It can even create this website copy for you.
        </p>
      </motion.div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-8 border rounded-xl border-white/20 overflow-hidden ">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// FEATURES SECTION TWO
// ============================================
const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-white/20",
        (index === 0 || index === 4) && "lg:border-l border-white/20",
        index < 4 && "lg:border-b border-white/20"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-gray-900 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-gray-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-800 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-400 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

const FeaturesSectionTwo = () => {
  const features = [
    {
      title: "Built for developers",
      description:
        "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Pricing like no other",
      description:
        "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <IconCloud />,
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. Atleast our AI Agents are.",
      icon: <IconHelp />,
    },
    {
      title: "Money back guarantee",
      description:
        "If you donot like EveryAI, we will convince you to like us.",
      icon: <IconHeart />,
    },
    {
      title: "And everything else",
      description: "I just ran out of copy ideas. Accept my sincere apologies",
      icon: <IconAdjustmentsBolt />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
};

// ============================================
// CTA SECTION
// ============================================
const CTASection = () => {
  return (
    <section className="relative py-24 bg-black overflow-hidden px-4">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border) / 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 py-20 px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to build something amazing?
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Get instant access to our state of the art platform and start
              building today.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => {
  return (
    <footer className="bg-black py-12 relative border-t border-white/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div className="lg:max-w-xs">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg" />
              <span className="text-white font-semibold text-lg">
                GenUI Studio
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building the future of development with cutting-edge tools and
              seamless experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
            <div>
              <h3 className="text-gray-400 font-medium text-sm mb-4 uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "API", "Docs"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm mb-4 uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm mb-4 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Security"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2024 GenUI Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const t = Boolean(localStorage.getItem("accessToken"));
    setIsLoggedIn(t);
  }, []);

  const handlePromptSubmit = (prompt) => {
    if (!prompt.trim()) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  return (
    <div className="bg-black min-h-screen">
      <HeroParallax onPromptSubmit={handlePromptSubmit} />
      <FeaturesSection />
      <section className="bg-black py-10">
        <FeaturesSectionTwo />
      </section>
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;