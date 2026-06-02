import React, { useEffect, useRef } from 'react';

export default function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Use ResizeObserver as strictly mandated by the guidelines
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        // Debounce or directly apply sizing
        canvas.width = newW || window.innerWidth;
        canvas.height = newH || window.innerHeight;
        width = canvas.width;
        height = canvas.height;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      resizeObserver.observe(document.body);
    }

    // Two types of particles: Jasmine Petals (Creamy White/Yellow), Blush Rose Petals (soft pink), Gold Particles (sparkling stars)
    interface Petal {
      x: number;
      y: number;
      size: number;
      type: 'jasmine' | 'rose' | 'sparkle';
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      oscillation: number;
      oscillationSpeed: number;
    }

    const flowerPool: Petal[] = [];
    const maxPetals = 45;

    const createPetal = (isInitial: boolean = false): Petal => {
      const types: ('jasmine' | 'rose' | 'sparkle')[] = ['jasmine', 'rose', 'sparkle', 'jasmine'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let size = 0;
      if (type === 'jasmine') size = Math.random() * 8 + 8;
      else if (type === 'rose') size = Math.random() * 10 + 10;
      else size = Math.random() * 3 + 1.5;

      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -20,
        size,
        type,
        speedY: type === 'sparkle' ? Math.random() * 0.5 + 0.3 : Math.random() * 0.8 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.4,
        oscillation: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.02 + 0.005,
      };
    };

    // Populate initial petals
    for (let i = 0; i < maxPetals; i++) {
      flowerPool.push(createPetal(true));
    }

    const drawJasmine = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation + Math.sin(p.oscillation) * 0.5);
      c.globalAlpha = p.opacity;

      // Draw South Indian Jasmin ("Malli poo") - 5 delicate pointed cream white petals radiating from a gold center
      const petalCount = 5;
      c.fillStyle = '#fefefa'; // Cream off-white
      c.strokeStyle = '#fef08a'; // Golden yellow edges
      c.lineWidth = 0.5;

      for (let i = 0; i < petalCount; i++) {
        c.rotate((Math.PI * 2) / petalCount);
        c.beginPath();
        // Pointy tear drop petal shape
        c.moveTo(0, 0);
        c.quadraticCurveTo(-p.size / 2.5, -p.size / 1.5, 0, -p.size);
        c.quadraticCurveTo(p.size / 2.5, -p.size / 1.5, 0, 0);
        c.fill();
        c.stroke();
      }

      // Golden warm center
      c.beginPath();
      c.arc(0, 0, p.size / 5, 0, Math.PI * 2);
      c.fillStyle = '#eab308'; // Gold center
      c.fill();

      c.restore();
    };

    const drawRose = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation + Math.sin(p.oscillation) * 0.3);
      c.globalAlpha = p.opacity;

      // Draw soft organic rose petal (curved heart shape)
      c.fillStyle = 'rgba(251, 207, 232, 0.9)'; // Sweet blush pink
      c.strokeStyle = 'rgba(244, 114, 182, 0.4)'; // Deeper outline outline
      c.lineWidth = 0.5;

      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-p.size, -p.size / 2, -p.size / 2, -p.size * 1.2, 0, -p.size);
      c.bezierCurveTo(p.size / 2, -p.size * 1.2, p.size, -p.size / 2, 0, 0);
      c.fill();
      c.stroke();

      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, p: Petal) => {
      c.save();
      c.translate(p.x, p.y);
      c.globalAlpha = p.opacity * (0.5 + Math.abs(Math.sin(p.oscillation)) * 0.5); // Twinkling effect

      // Gold fuzzy particle
      const gradient = c.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, 'rgba(234, 179, 8, 1)'); // Vibrant gold
      gradient.addColorStop(0.3, 'rgba(253, 224, 71, 0.6)'); // Yellow aura
      gradient.addColorStop(1, 'rgba(253, 224, 71, 0)');
      
      c.fillStyle = gradient;
      c.beginPath();
      c.arc(0, 0, p.size, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flowerPool.length; i++) {
        const p = flowerPool[i];

        // Physics: slow drifting down with soft horizontal sway
        p.y += p.speedY;
        p.oscillation += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillation) * 0.4;
        p.rotation += p.rotationSpeed;

        // Draw depending on type
        if (p.type === 'jasmine') drawJasmine(ctx, p);
        else if (p.type === 'rose') drawRose(ctx, p);
        else drawSparkle(ctx, p);

        // Recycle if goes off boundaries
        if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          flowerPool[i] = createPetal(false);
        }
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
