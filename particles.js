const canvas = document.querySelector("#particles");
const context = canvas.getContext("2d");
const pointer = {
  active: false,
  x: 0,
  y: 0
};

const particles = [];
const colors = ["#d8dee9", "#e5e9f0", "#eceff4"];

function particleCount() {
  return Math.max(34, Math.min(72, Math.floor(window.innerWidth / 22)));
}

function resize() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticle(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.18 + Math.random() * 0.44;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 1 + Math.random() * 1.4,
    alpha: 0.24 + Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function fillParticles() {
  while (particles.length < particleCount()) {
    particles.push(createParticle());
  }

  particles.length = particleCount();
}

function moveParticle(particle) {
  if (pointer.active) {
    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 120 && distance > 0.01) {
      const force = (120 - distance) / 120;
      particle.vx += (dx / distance) * force * 0.08;
      particle.vy += (dy / distance) * force * 0.08;
    }
  }

  particle.vx *= 0.985;
  particle.vy *= 0.985;
  particle.x += particle.vx;
  particle.y += particle.vy;

  if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
  if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

  particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
  particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
}

function drawParticle(particle) {
  context.globalAlpha = particle.alpha;
  context.fillStyle = particle.color;
  context.beginPath();
  context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  context.fill();
}

function drawConnections() {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const first = particles[i];
      const second = particles[j];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);

      if (distance > 140) continue;

      context.globalAlpha = (1 - distance / 140) * 0.12;
      context.strokeStyle = "#e5e9f0";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.stroke();
    }
  }
}

function frame() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(moveParticle);
  drawConnections();
  particles.forEach(drawParticle);
  context.globalAlpha = 1;
  requestAnimationFrame(frame);
}

window.addEventListener("resize", () => {
  resize();
  fillParticles();
});

window.addEventListener("pointermove", (event) => {
  pointer.active = true;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

window.addEventListener("click", (event) => {
  for (let i = 0; i < 4; i += 1) {
    particles.push(createParticle(event.clientX, event.clientY));
  }
});

resize();
fillParticles();
frame();
