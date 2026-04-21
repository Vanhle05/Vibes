import React, { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const getAccentColor = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--vibe-accent').trim() || '#fbbf24';
    };

    const particles = [];
    const count = 50; // Increased count
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 1.2, // Faster
        vy: (Math.random() - 0.5) * 1.2,
        r: Math.random() * 3 + 1, // Larger
        alpha: Math.random() * 0.6 + 0.2, // Brighter
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, W, H);
      const accent = getAccentColor();
      
      // Dynamic ambient glow
      const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/1.1);
      bgGrad.addColorStop(0, `${accent}18`); 
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        const pulse = Math.sin(time * 0.002 + p.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2);
        const pAlpha = Math.floor((p.alpha + pulse) * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = `${accent}${pAlpha}`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = accent;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for lines

        // Stronger, more visible connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (dist < 220) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / 220) * 0.3;
            ctx.strokeStyle = `${accent}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };
    
    animId = requestAnimationFrame(draw);

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'transparent', display: 'block' }} />;
};

export default ParticleCanvas;
