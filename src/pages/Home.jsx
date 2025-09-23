import React, { useEffect,  useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Code, 
  Palette, 
  Layers, 
  Download,
  ArrowRight,
  Star,
  Users,
  Rocket
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const floatingElementsRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn,setIsLoggedIn]=useState(false);

  // Determine auth state from localStorage (kept simple and synchronous)
  useEffect(()=>{
    const t =  Boolean(localStorage.getItem('accessToken'));
    setIsLoggedIn(t);
    console.log("isLoggedIn", t);
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fast, smooth hero animations
      gsap.fromTo('.hero-title', 
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }
      );

      gsap.fromTo('.hero-subtitle', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo('.hero-buttons', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo('.hero-badge', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, delay: 0.3, ease: 'back.out(1.7)' }
      );

      // Smooth floating elements
      gsap.fromTo('.floating-icon', 
        { opacity: 0, scale: 0, rotation: -90 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0, 
          duration: 0.8, 
          delay: 0.4,
          ease: 'back.out(1.7)',
          stagger: 0.08
        }
      );

      // Smooth stats animation
      gsap.fromTo('.stat-item', 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Clean card data
  const cardData = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Describe your component in natural language and watch our advanced AI create beautiful, functional React code tailored to your exact specifications in seconds.",
      gradient: "from-cyan-500 to-blue-500",
      glowColor: "cyan"
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description: "See your components come to life in real-time with our interactive preview system. Adjust properties, styles, and functionality before exporting.",
      gradient: "from-purple-500 to-pink-500",
      glowColor: "purple"
    },
    {
      icon: Download,
      title: "Export Ready Code",
      description: "Get clean, production-ready code with proper TypeScript types, accessibility features, and modern React best practices built-in.",
      gradient: "from-emerald-500 to-teal-500",
      glowColor: "emerald"
    }
  ];

  // Framer Motion variants for clean animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        bounce: 0.3
      }
    }
  };

  const iconVariants = {
    rest: { 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.4 }
    },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { 
        duration: 0.4,
        type: "spring",
        bounce: 0.5
      }
    }
  };

  return (
    <div ref={heroRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Enhanced dark background with neon accents */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.08'%3E%3Ccircle cx='7' cy='7' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
      </div>

      {/* Floating background elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-icon absolute top-20 left-[8%] text-cyan-400/20">
          <Code size={50} className="animate-float drop-shadow-lg" style={{ animationDelay: '0s', filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))' }} />
        </div>
        <div className="floating-icon absolute top-32 right-[12%] text-purple-400/20">
          <Palette size={40} className="animate-float drop-shadow-lg" style={{ animationDelay: '2s', filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))' }} />
        </div>
        <div className="floating-icon absolute bottom-32 left-[15%] text-emerald-400/20">
          <Layers size={45} className="animate-float drop-shadow-lg" style={{ animationDelay: '4s', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))' }} />
        </div>
        <div className="floating-icon absolute bottom-48 right-[8%] text-pink-400/20">
          <Sparkles size={35} className="animate-float drop-shadow-lg" style={{ animationDelay: '1s', filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.3))' }} />
        </div>
        <div className="floating-icon absolute top-1/2 left-[5%] text-yellow-400/20">
          <Zap size={38} className="animate-float drop-shadow-lg" style={{ animationDelay: '3s', filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))' }} />
        </div>
        <div className="floating-icon absolute top-1/3 right-[5%] text-blue-400/20">
          <Star size={32} className="animate-float drop-shadow-lg" style={{ animationDelay: '5s', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Hero Section */}
        <div className="pt-32 pb-24 text-center relative">
          {/* Hero Badge with neon glow */}
          <div className="hero-badge inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-cyan-500/20 text-sm font-medium text-gray-300 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
            <Sparkles className="w-5 h-5 text-cyan-400 relative z-10" />
            <span className="relative z-10">AI-Powered Component Generation</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping relative z-10"></div>
          </div>

          <div className="hero-title mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                GenUI
              </span>
              <span className="text-white ml-6 drop-shadow-2xl">Studio</span>
            </h1>
            <div className="mt-6 text-lg md:text-xl bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent font-bold tracking-widest uppercase">
              The Future of UI Development
            </div>
          </div>
          
          <div className="hero-subtitle mb-16 max-w-5xl mx-auto">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed font-light">
              Transform ideas into beautiful components in 
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold"> seconds</span>. 
              Describe, preview, and export production-ready React code with the power of AI.
            </p>
          </div>

          <div className="hero-buttons flex flex-col sm:flex-row gap-8 justify-center mb-24">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  Start Creating
                  <Rocket className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 border border-cyan-400/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    Start Creating
                    <Rocket className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 border border-cyan-400/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="group relative border-2 border-cyan-500/50 bg-transparent text-cyan-400 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-cyan-500/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                  </span>
                  <div className="absolute inset-0 border border-cyan-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            )}
          </div>

          {/* Enhanced Stats with neon glow */}
          <div className="stats-section grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="stat-item text-center group">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                  10k+
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Components Generated
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="stat-item text-center group">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                  500+
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Happy Developers
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="stat-item text-center group">
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                  99%
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Code Quality
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Feature Cards with Framer Motion */}
        <motion.div 
          ref={cardsRef}
          className="py-32 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {cardData.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  className="group cursor-pointer"
                >
                  <div className="relative h-full">
                    {/* Clean background with subtle border */}
                    <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-500 group-hover:bg-white/8 group-hover:border-white/20 overflow-hidden">
                      
                      {/* Subtle gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col">
                        
                        {/* Icon with clean animation */}
                        <motion.div 
                          className="mb-6"
                          variants={iconVariants}
                        >
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors duration-300">
                          {card.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 leading-relaxed text-base group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                          {card.description}
                        </p>

                        {/* Subtle bottom accent */}
                        <motion.div 
                          className={`mt-6 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                        />
                      </div>

                      {/* Subtle glow effect on hover */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Dark CTA Section */}
        <div className="text-center py-32">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse"></div>
            <div className="relative z-10 p-16 rounded-3xl bg-gradient-to-br from-slate-800/10 to-slate-900/10 backdrop-blur-2xl border border-slate-700/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white">
                  Ready to <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">build faster</span>?
                </h2>
                <p className="text-xl text-gray-300 mb-16 font-normal leading-relaxed">
                  Join developers who've already saved hours with AI-generated components.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => navigate('/chat')}
                      className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 inline-flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center">
                        Start Building Now
                        <Rocket className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 inline-flex items-center justify-center overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center">
                          Start Building Now
                          <Rocket className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="group relative border-2 border-cyan-500/50 bg-transparent text-cyan-400 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-cyan-500/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 inline-flex items-center justify-center backdrop-blur-sm"
                      >
                        <span className="flex items-center">
                          Sign In
                          <ArrowRight className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;