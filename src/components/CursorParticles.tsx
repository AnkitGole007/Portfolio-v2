'use client';

import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
}

const colors = ['#0a84ff', '#5e5ce6', '#bf5af2', '#30d158'];

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const animationId = useRef<number | null>(null);
  const lastSparkTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      prevMouse.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Only create sparks on movement with throttling
      if (speed > 3 && now - lastSparkTime.current > 50) {
        lastSparkTime.current = now;

        // Create 1-2 subtle electric sparks
        const sparkCount = Math.min(2, Math.floor(speed / 15) + 1);

        for (let i = 0; i < sparkCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 60 + 30;

          sparks.current.push({
            x: mouse.current.x,
            y: mouse.current.y,
            targetX: mouse.current.x + Math.cos(angle) * distance,
            targetY: mouse.current.y + Math.sin(angle) * distance,
            life: 1,
            maxLife: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            width: Math.random() * 1.5 + 0.5,
          });
        }

        // Limit sparks
        if (sparks.current.length > 15) {
          sparks.current = sparks.current.slice(-15);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const drawLightning = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
      opacity: number,
      lineWidth: number
    ) => {
      const segments = 5;
      const jitter = 8;

      ctx.beginPath();
      ctx.moveTo(x1, y1);

      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter;
        const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 * opacity;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparks.current = sparks.current.filter((spark) => {
        spark.life -= 0.04;

        if (spark.life <= 0) return false;

        const progress = 1 - spark.life / spark.maxLife;
        const currentX = spark.x + (spark.targetX - spark.x) * progress;
        const currentY = spark.y + (spark.targetY - spark.y) * progress;

        // Draw tesla coil style lightning
        drawLightning(
          ctx,
          spark.x,
          spark.y,
          currentX,
          currentY,
          spark.color,
          spark.life * 0.7,
          spark.width
        );

        // Small branching effect
        if (Math.random() > 0.7 && spark.life > 0.5) {
          const branchAngle = Math.random() * Math.PI - Math.PI / 2;
          const branchLength = 15 * spark.life;
          drawLightning(
            ctx,
            currentX,
            currentY,
            currentX + Math.cos(branchAngle) * branchLength,
            currentY + Math.sin(branchAngle) * branchLength,
            spark.color,
            spark.life * 0.4,
            spark.width * 0.5
          );
        }

        return true;
      });

      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
