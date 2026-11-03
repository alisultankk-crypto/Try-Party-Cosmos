import React, { useRef, useState, useEffect } from 'react';
import { Zap, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onMove: (x: number, y: number) => void;
  onCharge: () => void;
  onJump: () => void;
  isChargeReady: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onCharge,
  onJump,
  isChargeReady,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handlePointerDown = (e: React.PointerEvent) => {
    touchIdRef.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || e.pointerId !== touchIdRef.current) return;
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerId !== touchIdRef.current) return;
    setIsDragging(false);
    touchIdRef.current = null;
    setStickPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setStickPos({ x: dx, y: dy });
    onMove(dx / maxRadius, dy / maxRadius);
  };

  // Only render if touch supported or small viewport
  return (
    <div className="md:hidden absolute inset-x-0 bottom-6 px-6 flex items-end justify-between pointer-events-none z-20 select-none">
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="pointer-events-auto relative w-28 h-28 rounded-full bg-slate-900/60 backdrop-blur-md border-2 border-white/20 flex items-center justify-center touch-none shadow-xl active:border-emerald-400"
      >
        <div
          className="w-12 h-12 rounded-full bg-emerald-500/80 shadow-md transform transition-transform"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        <button
          onClick={onJump}
          className="w-14 h-14 rounded-full bg-slate-900/70 active:bg-slate-800 border-2 border-white/20 text-white flex items-center justify-center shadow-lg active:scale-90 transition"
          title="Прыжок"
        >
          <ArrowUp className="w-6 h-6 text-emerald-400" />
        </button>

        <button
          onClick={onCharge}
          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-2xl transition active:scale-90 ${
            isChargeReady
              ? 'bg-amber-500 active:bg-amber-400 border-yellow-300 text-slate-950 shadow-amber-500/50'
              : 'bg-slate-900/80 border-white/10 text-slate-400'
          }`}
          title="Таран (Разгон)"
        >
          <Zap className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
