import React, { useEffect, useRef } from 'react';
export function TechParticles({
  className = ''
}: {
  className?: string;
}) {
  return <div className={`tech-particles-container ${className}`}>
      {[...Array(40)].map((_, i) => <div key={i} className="tech-particle" style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 10 + 10}s`
    }} />)}
    </div>;
}
export function TechGrid({
  className = ''
}: {
  className?: string;
}) {
  return <div className={`tech-grid ${className}`} />;
}
export function TechGlow({
  className = ''
}: {
  className?: string;
}) {
  return <div className={`tech-glow ${className}`}>
      <div className="glow-circle glow-circle-1"></div>
      <div className="glow-circle glow-circle-2"></div>
      <div className="glow-circle glow-circle-3"></div>
    </div>;
}
export function TechCircuitLines({
  className = ''
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    // Create circuit paths
    const drawCircuits = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      // Draw horizontal and vertical lines
      for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        ctx.beginPath();
        // Horizontal or vertical line
        if (Math.random() > 0.5) {
          const length = Math.random() * 100 + 50;
          ctx.moveTo(x, y);
          ctx.lineTo(x + length, y);
          // Add a branch
          if (Math.random() > 0.7) {
            ctx.moveTo(x + length / 2, y);
            ctx.lineTo(x + length / 2, y + (Math.random() > 0.5 ? 30 : -30));
          }
        } else {
          const length = Math.random() * 100 + 50;
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + length);
          // Add a branch
          if (Math.random() > 0.7) {
            ctx.moveTo(x, y + length / 2);
            ctx.lineTo(x + (Math.random() > 0.5 ? 30 : -30), y + length / 2);
          }
        }
        ctx.stroke();
        // Draw node
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    drawCircuits();
    const intervalId = setInterval(drawCircuits, 5000);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(intervalId);
    };
  }, []);
  return <canvas ref={canvasRef} className={`tech-circuit-lines ${className}`} />;
}
export function TechDataStream({
  className = ''
}: {
  className?: string;
}) {
  return <div className={`tech-data-stream ${className}`}>
      {[...Array(15)].map((_, i) => <div key={i} className="data-bit" style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 5 + 3}s`,
      height: `${Math.random() * 40 + 10}px`
    }} />)}
    </div>;
}
export function TechCursor({
  className = ''
}: {
  className?: string;
}) {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const moveCursor = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        if (cursor) {
          cursor.style.left = `${e.clientX}px`;
          cursor.style.top = `${e.clientY}px`;
        }
      });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);
  return <div ref={cursorRef} className={`tech-cursor ${className}`} />;
}
export function TechBackground() {
  return <div className="tech-background">
      <TechGrid className="absolute inset-0 opacity-10" />
      <TechParticles className="absolute inset-0" />
      <TechGlow className="absolute inset-0 pointer-events-none" />
    </div>;
}