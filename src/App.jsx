import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Onboarding from './components/Onboarding';
import ChatSimulator from './components/ChatSimulator';
import { Loader2, MessageCircle } from 'lucide-react';

function App() {
  const [view, setView] = useState('onboarding'); // onboarding, loading, simulator
  const [config, setConfig] = useState(null);
  const [lang, setLang] = useState(null);

  const handleOnboardingComplete = (data) => {
    setConfig({ ...data, lang });
    setView('loading');

    // Simulate generation process
    setTimeout(() => {
      setView('simulator');
    }, 2500);
  };

  const handleBackToOnboarding = () => {
    setView('onboarding');
    setConfig(null);
  };

  const handleBackToSplash = () => {
    setLang(null);
  };

  const handleChangePlatform = (newPlatform) => {
    setConfig(prev => ({ ...prev, platform: newPlatform }));
    // We keep view as simulator, it will just re-render ChatSimulator with new config.
  };

  const generateWaLink = () => {
    if (!config) return;
    const text = encodeURIComponent(`مرحباً Elegant Options! جربت عرض الـ Demo. مشروعي هو ${config.projectName} ونشاطه ${config.niche}. أرغب بالأسعار.`);
    window.open(`https://wa.me/96566305551?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 md:p-8 font-cairo overflow-hidden selection:bg-cyan-500/30">

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-900/10 blur-[100px]" />
      </div>

      {/* Main Header / Centered Logo - Hidden on Splash Screen */}
      <AnimatePresence>
        {lang !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-20 absolute top-4 md:top-6 w-full flex flex-col justify-center items-center pointer-events-none"
          >
            <img src="/logo.png" alt="Elegant Options Logo" className="h-16 w-auto object-contain md:h-20 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <h1 className="text-xl md:text-2xl font-bold tracking-widest text-white uppercase mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ fontFamily: 'system-ui, sans-serif' }}>Elegant Options</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Toggle removed as language is permanently selected on Splash Screen */}

      {/* Main Content Area */}
      <div className="z-10 w-full flex flex-col justify-center items-center h-full mt-28 md:mt-32">
        <AnimatePresence mode="wait">
          {lang === null ? (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]"
            >
              {/* Splash Background Elements */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
              </div>

              {/* Logo & Selection Area */}
              <div className="z-10 flex flex-col items-center justify-center w-full max-w-lg px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="flex flex-col items-center mb-12 relative"
                >
                  <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />
                  <img src="/logo.png" alt="Elegant Options Logo" className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse relative z-10" style={{ animationDuration: '3s' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                  <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-white uppercase mt-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] relative z-10" style={{ fontFamily: 'system-ui, sans-serif' }}>Elegant Options</h1>
                  <p className="mt-8 text-gray-300 font-light tracking-wide text-sm md:text-base relative z-10">اختر لغتك / Choose your language</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 w-full"
                >
                  <button
                    onClick={() => setLang('ar')}
                    className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
                    dir="rtl"
                  >
                    <span className="text-xl md:text-2xl font-cairo block">العربية</span>
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
                  >
                    <span className="text-xl md:text-2xl block" style={{ fontFamily: 'system-ui, sans-serif' }}>English</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : view === 'onboarding' ? (
            <motion.div key="onboarding" className="w-full flex justify-center mt-6 md:mt-10 pointer-events-auto">
              <Onboarding onComplete={handleOnboardingComplete} lang={lang} onBackToSplash={handleBackToSplash} />
            </motion.div>
          ) : view === 'loading' ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center space-y-6"
              dir={lang === 'ar' ? "rtl" : "ltr"}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
                <div className="bg-[#111111] border border-cyan-500/50 p-6 rounded-3xl relative z-10 shadow-[0_0_30px_-5px_cyan]">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                {lang === 'ar' ? 'جاري بناء عرض Demo...' : 'Building Demo...'}
              </h3>
              <p className="text-slate-400 text-sm animate-pulse">
                {lang === 'ar' ? `يتم الآن تجهيز الذكاء الاصطناعي بناءً على تخصص "${config?.niche}"` : `Preparing AI for the "${config?.niche}" niche`}
              </p>
            </motion.div>
          ) : view === 'simulator' && config ? (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full flex flex-col items-center gap-6 pointer-events-auto"
            >
              {/* The Simulator Device */}
              <ChatSimulator key={config.platform} config={config} onBack={handleBackToOnboarding} onChangePlatform={handleChangePlatform} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default App;
