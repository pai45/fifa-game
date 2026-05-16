interface Props {
  playerScore: number;
  opponentScore: number;
  round?: number;
  label?: string;
}

export function ScoreBar({ playerScore, opponentScore, round, label }: Props) {
  return (
    <div className="bg-gradient-to-r from-[#0a0f1c] via-[#0e1424] to-[#0a0f1c] border-b border-[#1e2538] px-4 py-2 flex items-center justify-between relative">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-[#5CDFFF] text-[10px] uppercase tracking-[0.2em] font-mono">[P1] You</span>
        <span className="neon-cyan text-2xl tabular-nums font-display">{playerScore}</span>
      </div>
      <div className="text-center px-3">
        {round && (
          <div className="text-[#5CDFFF]/60 text-[9px] uppercase tracking-widest font-mono">
            R<span className="text-[#5CDFFF]">{round}</span>/4
          </div>
        )}
        {label && <div className="text-amber-400 text-[9px] uppercase tracking-widest font-mono">{label}</div>}
        <div className="text-gray-600 text-[10px] tracking-widest font-mono">— VS —</div>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className="neon-red text-2xl tabular-nums font-display">{opponentScore}</span>
        <span className="text-[#ff5a7a] text-[10px] uppercase tracking-[0.2em] font-mono">CPU [E1]</span>
      </div>
    </div>
  );
}
