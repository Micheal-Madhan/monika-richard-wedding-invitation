import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gift } from 'lucide-react';

interface CountdownProps {
  weddingDate: Date;
}

export default function Countdown({ weddingDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fireworksRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);
  const fireworkIntervalRef = useRef<any>(null);

  // 1. Countdown timer calculation
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = weddingDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // 2. Canvas Fireworks Implementation
  const startCelebration = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      distanceToTarget: number;
      distanceTraveled: number;
      coordinates: Array<[number, number]>;
      coordinateCount: number;
      angle: number;
      speed: number;
      acceleration: number;
      brightness: number;
      hue: number;

      constructor(sx: number, sy: number, tx: number, ty: number, h: number) {
        this.x = sx;
        this.y = sy;
        this.targetX = tx;
        this.targetY = ty;
        this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
        this.distanceTraveled = 0;
        this.coordinateCount = 3;
        this.coordinates = [];
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2.5;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 30 + 50;
        this.hue = h;
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.hypot(this.x + vx - this.x, this.y + vy - this.y) + this.distanceTraveled;

        if (this.distanceTraveled >= this.distanceToTarget) {
          createExplosion(this.targetX, this.targetY, this.hue);
          fireworksRef.current.splice(index, 1);
        } else {
          this.x += vx;
          this.y += vy;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 0.8)`;
        ctx.stroke();
      }
    }

    class Particle {
      x: number;
      y: number;
      coordinates: Array<[number, number]>;
      coordinateCount: number;
      angle: number;
      speed: number;
      friction: number;
      gravity: number;
      hue: number;
      brightness: number;
      alpha: number;
      decay: number;

      constructor(x: number, y: number, h: number) {
        this.x = x;
        this.y = y;
        this.coordinateCount = 5;
        this.coordinates = [];
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 8 + 3;
        this.friction = 0.95;
        this.gravity = 0.08;
        this.hue = h + (Math.random() * 30 - 15); // Slight deviation off color
        this.brightness = Math.random() * 20 + 75; // Gold and bright blush tones
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particlesRef.current.splice(index, 1);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
      }
    }

    const createExplosion = (x: number, y: number, hue: number) => {
      let count = 60;
      while (count--) {
        particlesRef.current.push(new Particle(x, y, hue));
      }
    };

    const colors = [40, 340, 15, 30, 350]; // Gold, Blush/Fuchsia, Peach, Pale Gold, Soft Pink

    const launchFirework = () => {
      const sx = Math.random() * canvas.width;
      const sy = canvas.height;
      const tx = Math.random() * canvas.width;
      const ty = Math.random() * (canvas.height * 0.6);
      const h = colors[Math.floor(Math.random() * colors.length)];
      fireworksRef.current.push(new Firework(sx, sy, tx, ty, h));
    };

    // Periodically launch a firework
    if (fireworkIntervalRef.current) clearInterval(fireworkIntervalRef.current);
    fireworkIntervalRef.current = setInterval(launchFirework, 700);

    // Run animation frames
    const tick = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Slow trail fading
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      let i = fireworksRef.current.length;
      while (i--) {
        fireworksRef.current[i].draw();
        fireworksRef.current[i].update(i);
      }

      let j = particlesRef.current.length;
      while (j--) {
        particlesRef.current[j].draw();
        particlesRef.current[j].update(j);
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  useEffect(() => {
    // If wedding countdown reaches zero or is over, auto start fireworks loop
    if (timeLeft.isOver) {
      startCelebration();
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (fireworkIntervalRef.current) clearInterval(fireworkIntervalRef.current);
    };
  }, [timeLeft.isOver]);

  // Clean resize helper
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerTestCelebration = () => {
    startCelebration();
    // Launch initial cluster of fireworks instantly!
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (canvasRef.current) {
          const sx = Math.random() * canvasRef.current.width;
          const sy = canvasRef.current.height;
          const tx = Math.random() * canvasRef.current.width;
          const ty = Math.random() * (canvasRef.current.height * 0.5);
          const colors = [40, 340, 15, 30, 350];
          const h = colors[Math.floor(Math.random() * colors.length)];
          fireworksRef.current.push({
            x: sx, y: sy, targetX: tx, targetY: ty, distanceToTarget: Math.hypot(tx - sx, ty - sy),
            distanceTraveled: 0, coordinateCount: 3, coordinates: Array(3).fill([sx, sy]),
            angle: Math.atan2(ty - sy, tx - sx), speed: 2.5, acceleration: 1.05, brightness: Math.random() * 30 + 50, hue: h,
            update: function(index: number) {
              this.coordinates.pop();
              this.coordinates.unshift([this.x, this.y]);
              this.speed *= this.acceleration;
              const vx = Math.cos(this.angle) * this.speed;
              const vy = Math.sin(this.angle) * this.speed;
              this.distanceTraveled = Math.hypot(this.x + vx - this.x, this.y + vy - this.y) + this.distanceTraveled;
              if (this.distanceTraveled >= this.distanceToTarget) {
                // Trigger explosion
                let count = 45;
                while (count--) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = Math.random() * 6 + 2;
                  particlesRef.current.push({
                    x: this.targetX, y: this.targetY, coordinateCount: 5, coordinates: Array(5).fill([this.targetX, this.targetY]),
                    angle, speed, friction: 0.95, gravity: 0.08, hue: this.hue + (Math.random() * 20 - 10), brightness: Math.random() * 20 + 75,
                    alpha: 1, decay: Math.random() * 0.015 + 0.008,
                    update: function(pIdx: number) {
                      this.coordinates.pop();
                      this.coordinates.unshift([this.x, this.y]);
                      this.speed *= this.friction;
                      this.x += Math.cos(this.angle) * this.speed;
                      this.y += Math.sin(this.angle) * this.speed + this.gravity;
                      this.alpha -= this.decay;
                      if (this.alpha <= this.decay) particlesRef.current.splice(pIdx, 1);
                    },
                    draw: function() {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const ctxCtx = canvas.getContext('2d');
                      if (!ctxCtx) return;
                      ctxCtx.beginPath();
                      ctxCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                      ctxCtx.lineTo(this.x, this.y);
                      ctxCtx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
                      ctxCtx.stroke();
                    }
                  });
                }
                fireworksRef.current.splice(index, 1);
              } else {
                this.x += vx; this.y += vy;
              }
            },
            draw: function() {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const ctxCtx = canvas.getContext('2d');
              if (!ctxCtx) return;
              ctxCtx.beginPath();
              ctxCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
              ctxCtx.lineTo(this.x, this.y);
              ctxCtx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 0.8)`;
              ctxCtx.stroke();
            }
          });
        }
      }, i * 300);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Absolute fullscreen overlay canvas for fireworks */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full mix-blend-screen"
      />

      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-yellow-600 dark:text-yellow-400" />
          The Holy Countdown
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md w-full">
        {/* Days Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory-50/80 dark:bg-neutral-800/80 backdrop-blur-md border border-yellow-500/15 shadow-md hover:border-yellow-500/35 transition-all duration-300">
          <span className="text-2xl sm:text-3xl font-serif font-semibold text-yellow-750 dark:text-yellow-400">
            {timeLeft.days.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-sans text-neutral-500 dark:text-neutral-400 mt-1">Days</span>
        </div>

        {/* Hours Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory-50/80 dark:bg-neutral-800/80 backdrop-blur-md border border-yellow-500/15 shadow-md hover:border-yellow-500/35 transition-all duration-300">
          <span className="text-2xl sm:text-3xl font-serif font-semibold text-yellow-750 dark:text-yellow-400">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-sans text-neutral-500 dark:text-neutral-400 mt-1">Hours</span>
        </div>

        {/* Minutes Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory-50/80 dark:bg-neutral-800/80 backdrop-blur-md border border-yellow-500/15 shadow-md hover:border-yellow-500/35 transition-all duration-300">
          <span className="text-2xl sm:text-3xl font-serif font-semibold text-yellow-750 dark:text-yellow-400">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-sans text-neutral-500 dark:text-neutral-400 mt-1">Mins</span>
        </div>

        {/* Seconds Card */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory-50/80 dark:bg-neutral-800/80 backdrop-blur-md border border-yellow-500/15 shadow-md hover:border-yellow-500/35 transition-all duration-300 animate-pulse">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-rose-700 dark:text-rose-400">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-sans text-neutral-500 dark:text-neutral-400 mt-1">Secs</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <button
          id="btn_test_celebrate"
          onClick={triggerTestCelebration}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif uppercase tracking-widest text-white bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto"
        >
          <Sparkles className="w-3.5 h-3.5 animate-bounce" />
          Test Fireworks Celebration ✨
        </button>
        {timeLeft.isOver && (
          <p className="text-sm font-serif italic text-yellow-700 dark:text-yellow-400 mt-3 flex items-center gap-1.5 animate-pulse">
            <Gift className="w-4 h-4 text-rose-500" />
            The Special Day is Here!
          </p>
        )}
      </div>
    </div>
  );
}
