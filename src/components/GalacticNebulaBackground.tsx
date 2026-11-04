import React, { useEffect, useRef } from 'react';
import { LEVEL_THEMES } from '../types/levelTheme';

interface GalacticNebulaBackgroundProps {
  level: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export const GalacticNebulaBackground: React.FC<GalacticNebulaBackgroundProps> = ({ level }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = LEVEL_THEMES[level] || LEVEL_THEMES[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate Nebula Clouds based on level palette
    const colors = theme.nebulaColors;
    const clouds: NebulaCloud[] = Array.from({ length: 6 }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.min(width, height) * (0.35 + Math.random() * 0.35),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[i % colors.length],
      alpha: 0.12 + Math.random() * 0.1,
    }));

    // Generate Stardust field
    const stars: StarParticle[] = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.6,
      alpha: 0.2 + Math.random() * 0.8,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.015;

      // Base cosmic gradient
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Radial deep core glow
      const radial = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.75
      );
      radial.addColorStop(0, colors[0] + '33');
      radial.addColorStop(0.5, colors[1 % colors.length] + '18');
      radial.addColorStop(1, '#020617');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render Drifting Galactic Nebula Clouds with 'screen' blend
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (const cloud of clouds) {
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;

        // Wrap edges gently
        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;

        const g = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.radius
        );
        g.addColorStop(0, cloud.color);
        g.addColorStop(0.4, cloud.color);
        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;
        ctx.globalAlpha = cloud.alpha;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Render Twinkling Cosmic Stars
      ctx.save();
      for (const star of stars) {
        star.y -= 0.15; // Slow upward drift
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const currentAlpha =
          star.alpha * (0.6 + 0.4 * Math.sin(t * star.twinkleSpeed * 60 + star.twinklePhase));

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.max(0.1, currentAlpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Little cross glint on bigger stars
        if (star.radius > 1.8 && currentAlpha > 0.7) {
          ctx.strokeStyle = colors[0];
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(star.x - 3, star.y);
          ctx.lineTo(star.x + 3, star.y);
          ctx.moveTo(star.x, star.y - 3);
          ctx.lineTo(star.x, star.y + 3);
          ctx.stroke();
        }
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [level, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
};
