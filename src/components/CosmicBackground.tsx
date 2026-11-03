import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Generate static stars + twinkle offsets
    const starCount = 140;
    const stars: { x: number; y: number; r: number; alpha: number; speed: number; color: string }[] = [];
    const colors = ['#ffffff', '#bae6fd', '#fef08a', '#e9d5ff', '#c7d2fe'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() < 0.2 ? 1.8 : Math.random() < 0.6 ? 1.2 : 0.8,
        alpha: Math.random() * 0.8 + 0.2,
        speed: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#030712'); // Deep obsidian void
      bgGrad.addColorStop(0.5, '#0b0f1e');
      bgGrad.addColorStop(1, '#08051a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cosmic Nebulae (soft glowing orbs)
      const g1 = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.25,
        10,
        canvas.width * 0.2,
        canvas.height * 0.25,
        canvas.width * 0.4
      );
      g1.addColorStop(0, 'rgba(99, 102, 241, 0.18)'); // Indigo nebula
      g1.addColorStop(0.6, 'rgba(139, 92, 246, 0.08)');
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.7,
        10,
        canvas.width * 0.8,
        canvas.height * 0.7,
        canvas.width * 0.45
      );
      g2.addColorStop(0, 'rgba(236, 72, 153, 0.14)'); // Magenta stardust
      g2.addColorStop(0.7, 'rgba(6, 182, 212, 0.06)');
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Twinkling Stars
      for (const s of stars) {
        const twinkle = Math.sin(time * s.speed + s.x) * 0.35 + 0.65;
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, s.alpha * twinkle);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.r > 1.2 ? 6 : 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 w-full h-full" />;
};
