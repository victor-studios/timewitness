/* ============================================
   TimeWitness — Ethereal Particle System
   Luminous orbs floating across the hero section
   ============================================ */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animId;

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.offsetWidth;
    height = canvas.height = parent.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.2 - 0.1;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
      // Soft blue/cyan color
      this.hue = 195 + Math.random() * 20;
      this.saturation = 60 + Math.random() * 30;
      this.lightness = 70 + Math.random() * 20;
    }

    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Gentle sine wave motion
      this.x += Math.sin(time * 0.001 + this.pulsePhase) * 0.15;

      // Pulsing opacity
      const pulse = Math.sin(time * this.pulseSpeed + this.pulsePhase);
      this.currentOpacity = this.opacity * (0.6 + pulse * 0.4);

      // Wrap around
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.currentOpacity;

      // Glow effect
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 4
      );
      gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.8)`);
      gradient.addColorStop(0.4, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.2)`);
      gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 90%, 0.9)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(width * height / 15000), 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = `rgba(126, 200, 227, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update(time);
      p.draw();
    });

    drawConnections();

    animId = requestAnimationFrame(animate);
  }

  // Observe visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animId) animId = requestAnimationFrame(animate);
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.1 });

  init();
  observer.observe(canvas);

  window.addEventListener('resize', () => {
    resize();
    // Re-calculate particle count
    const targetCount = Math.min(Math.floor(width * height / 15000), 60);
    while (particles.length < targetCount) particles.push(new Particle());
    while (particles.length > targetCount) particles.pop();
  });
})();
