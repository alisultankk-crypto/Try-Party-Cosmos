import React, { useEffect, useRef } from 'react';
import { MagicEffectType } from '../types/game';

export interface MagicBurstTrigger {
  id: string;
  type: MagicEffectType;
  x: number; // Center X in viewport pixels
  y: number; // Center Y in viewport pixels
}

interface MagicVfxOverlayProps {
  burst: MagicBurstTrigger | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
  shape: 'circle' | 'spark' | 'shard' | 'star';
}

export const MagicVfxOverlay: React.FC<MagicVfxOverlayProps> = ({ burst }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const blastRingsRef = useRef<
    { x: number; y: number; r: number; maxR: number; color: string; alpha: number; type: MagicEffectType }[]
  >([]);

  useEffect(() => {
    if (!burst) return;

    const { type, x, y } = burst;
    const pList = particlesRef.current;

    // 1. Add Shockwave Ring
    const ringColors: Record<MagicEffectType, string> = {
      arcane: '#c084fc',
      fire: '#f97316',
      void: '#818cf8',
      frost: '#38bdf8',
      wind: '#34d399',
      starlight: '#fef08a',
    };

    blastRingsRef.current.push({
      x,
      y,
      r: 10,
      maxR: 95,
      color: ringColors[type] || '#ffffff',
      alpha: 1.0,
      type,
    });

    // 2. Spawn Magic Particles based on element
    const count = 35;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 5.5;

      let color = '#ffffff';
      let shape: Particle['shape'] = 'circle';

      if (type === 'arcane') {
        color = ['#c084fc', '#a855f7', '#e879f9', '#ffffff'][i % 4];
        shape = 'spark';
      } else if (type === 'fire') {
        color = ['#f97316', '#ef4444', '#facc15', '#b91c1c'][i % 4];
        shape = 'spark';
      } else if (type === 'void') {
        color = ['#6366f1', '#4338ca', '#818cf8', '#a855f7'][i % 4];
        shape = 'circle';
      } else if (type === 'frost') {
        color = ['#67e8f9', '#38bdf8', '#e0f2fe', '#ffffff'][i % 4];
        shape = 'shard';
      } else if (type === 'wind') {
        color = ['#34d399', '#6ee7b7', '#a7f3d0', '#ffffff'][i % 4];
        shape = 'shard';
      } else {
        // starlight
        color = ['#fde047', '#facc15', '#fef08a', '#ffffff'][i % 4];
        shape = 'star';
      }

      pList.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'fire' ? 1.5 : 0),
        size: shape === 'star' ? 6 : 3.5 + Math.random() * 3.5,
        color,
        alpha: 1.0,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 10,
        shape,
      });
    }
  }, [burst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let lastT = performance.now();

    const loop = (t: number) => {
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and update expanding magic rings
      const rings = blastRingsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += (r.maxR - r.r) * dt * 10;
        r.alpha -= dt * 2.5;

        if (r.alpha <= 0 || r.r >= r.maxR - 2) {
          rings.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.lineWidth = 3.5 * r.alpha;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Extra inner lightning or star spokes
        if (r.type === 'starlight' || r.type === 'arcane') {
          for (let k = 0; k < 6; k++) {
            const spokeAngle = (k / 6) * Math.PI * 2 + r.r * 0.05;
            const sx1 = r.x + Math.cos(spokeAngle) * (r.r * 0.4);
            const sy1 = r.y + Math.sin(spokeAngle) * (r.r * 0.4);
            const sx2 = r.x + Math.cos(spokeAngle) * r.r;
            const sy2 = r.y + Math.sin(spokeAngle) * r.r;
            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy2);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 2. Draw and update particles
      const pList = particlesRef.current;
      for (let i = pList.length - 1; i >= 0; i--) {
        const p = pList[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          pList.splice(i, 1);
          continue;
        }

        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.rotation += p.rotSpeed * dt;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        if (p.shape === 'star') {
          // 4-pointed sparkle star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.25, -s * 0.25);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.25, s * 0.25);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.25, s * 0.25);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.25, -s * 0.25);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'shard') {
          // Diamond crystal shard
          const w = p.size * 0.6;
          const h = p.size * 1.4;
          ctx.beginPath();
          ctx.moveTo(0, -h);
          ctx.lineTo(w, 0);
          ctx.lineTo(0, h);
          ctx.lineTo(-w, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'spark') {
          // Elongated spark
          ctx.fillRect(-p.size * 0.4, -p.size * 1.5, p.size * 0.8, p.size * 3.0);
        } else {
          // Soft circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
};
