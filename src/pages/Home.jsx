import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
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

      // Fast card animations
      gsap.fromTo('.feature-card', 
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
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

  const handleCardHover = (card, isEntering) => {
    gsap.to(card, {
      y: isEntering ? -8 : 0,
      scale: isEntering ? 1.02 : 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    const icon = card.querySelector('.card-icon');
    gsap.to(icon, {
      rotation: isEntering ? 3 : 0,
      scale: isEntering ? 1.05 : 1,
      duration: 0.25,
      ease: 'power2.out'
    });
  };

  return (
    <div ref={heroRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.04'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating background elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-icon absolute top-20 left-[8%] text-blue-400/15">
          <Code size={50} className="animate-float" style={{ animationDelay: '0s' }} />
        </div>
        <div className="floating-icon absolute top-32 right-[12%] text-indigo-400/15">
          <Palette size={40} className="animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="floating-icon absolute bottom-32 left-[15%] text-blue-500/15">
          <Layers size={45} className="animate-float" style={{ animationDelay: '4s' }} />
        </div>
        <div className="floating-icon absolute bottom-48 right-[8%] text-indigo-400/15">
          <Sparkles size={35} className="animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="floating-icon absolute top-1/2 left-[5%] text-blue-400/15">
          <Zap size={38} className="animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="floating-icon absolute top-1/3 right-[5%] text-indigo-400/15">
          <Star size={32} className="animate-float" style={{ animationDelay: '5s' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Section */}
        <div className="pt-24 pb-20 text-center relative">
          {/* Hero Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-gray-200 text-sm font-medium text-gray-600 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI-Powered Component Generation
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          <div className="hero-title mb-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">GenUI</span>
              <span className="text-gray-800 ml-4">Studio</span>
            </h1>
            <div className="mt-4 text-lg md:text-xl text-blue-600/60 font-medium tracking-wide uppercase">
              The Future of UI Development
            </div>
          </div>
          
          <div className="hero-subtitle mb-12 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed font-light">
              Transform ideas into beautiful components in 
              <span className="text-blue-600 font-semibold"> seconds</span>. 
              Describe, preview, and export production-ready React code with the power of AI.
            </p>
          </div>

          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden">
              <div className="relative z-10 flex items-center">
                Start Creating
                <Rocket className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 group">
              <span className="flex items-center">
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="stats-section grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="stat-item text-center group">
              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  10k+
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Components Generated
                </div>
              </div>
            </div>
            <div className="stat-item text-center group">
              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Happy Developers
                </div>
              </div>
            </div>
            <div className="stat-item text-center group">
              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  99%
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Code Quality
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Only 3 Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 py-24 max-w-6xl mx-auto">
          <div 
            className="feature-card group cursor-pointer relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="card-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                AI-Powered Generation
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Describe your component in natural language and watch our advanced AI create beautiful, 
                functional React code tailored to your exact specifications in seconds.
              </p>
            </div>
          </div>

          <div 
            className="feature-card group cursor-pointer relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="card-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                Instant Preview
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                See your components come to life in real-time with our interactive preview system. 
                Adjust properties, styles, and functionality before exporting.
              </p>
            </div>
          </div>

          <div 
            className="feature-card group cursor-pointer relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="card-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                Export Ready Code
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Get clean, production-ready code with proper TypeScript types, 
                accessibility features, and modern React best practices built-in.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center py-24">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative z-10 p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-gray-200/10">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-800">
                Ready to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">accelerate</span> your development?
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light">
                Join thousands of developers who are building faster with AI-generated components.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center">
                  Start Building Now
                  <Rocket className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center">
                  View Examples
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;