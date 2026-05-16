import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden scanlines">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#5CDFFF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-[#ff3df7]/10 blur-[100px] pointer-events-none" />

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] font-mono text-[#5CDFFF]/60 tracking-widest uppercase z-10">
        <span>SYS_OK · v0.4.7</span>
        <span className="flex items-center gap-1.5"><span className="live-dot" /> NEURO-LINK</span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-center text-[10px] font-mono text-[#5CDFFF]/40 tracking-widest uppercase z-10">
        // FOOTBALL.CARD.PROTOCOL · 2099
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 z-10"
      >
        <div className="relative">
          <div className="text-7xl drop-shadow-[0_0_24px_rgba(92,223,255,0.7)]">⚽</div>
          <div className="absolute -inset-6 border border-[#5CDFFF]/30 clip-cyber pointer-events-none" />
        </div>

        <div className="text-center relative">
          <h1
            className="neon-cyan text-3xl tracking-[0.4em] uppercase font-display glitch-hover"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            PITCH<span className="text-[#ff3df7] drop-shadow-[0_0_10px_rgba(255,61,247,0.6)]">/</span>DUEL
          </h1>
          <p className="text-[#5CDFFF]/60 text-[10px] mt-3 tracking-[0.4em] uppercase font-mono">
            ▸ Football Card Strategy ◂
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-6">
          <button
            onClick={() => navigate('/home')}
            className="cyber-btn clip-cyber-btn w-full py-3 text-sm"
          >
            ▸ ENTER
          </button>
          <button
            onClick={() => navigate('/deck-builder')}
            className="cyber-btn-ghost clip-cyber-btn w-full py-3 text-sm tracking-[0.18em] uppercase"
          >
            Deck Builder
          </button>
          <button
            onClick={() => navigate('/how-to-play')}
            className="text-[#5CDFFF]/60 hover:text-[#5CDFFF] py-2 text-[11px] tracking-[0.25em] uppercase font-mono transition-colors"
          >
            [ ? ] How to Play
          </button>
        </div>
      </motion.div>
    </div>
  );
}
