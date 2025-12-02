import { useEffect, useRef } from 'react';

interface ConfettiRainProps {
  isActive: boolean;
  sourceElement: HTMLElement | null;
}

interface Particle {
  element: HTMLDivElement;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startRotation: number;
  endRotation: number;
  duration: number;
  startTime: number;
  delay: number;
}

const confettiColors = [
  '#fbbf24', // yellow-400
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#facc15', // yellow-400
  '#fde047', // yellow-300
  '#fef08a' // yellow-200
];

const ConfettiRain: React.FC<ConfettiRainProps> = ({
  isActive,
  sourceElement
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastParticleTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !containerRef.current || !sourceElement) {
      // Clean up particles when inactive
      if (containerRef.current) {
        particlesRef.current.forEach((particle) => {
          if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
          }
        });
        particlesRef.current = [];
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = containerRef.current;

    const createParticle = (fromCorner: 'left' | 'right'): Particle | null => {
      const rect = sourceElement.getBoundingClientRect();
      // Bottom left or bottom right corner
      const startX = fromCorner === 'left' ? rect.left : rect.right;
      const startY = rect.bottom;

      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4; // 4-12px
      const color =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const rotation = Math.random() * 360;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 2 + 3; // 3-5 seconds
      // Spread outward from the corner
      const horizontalSpread =
        fromCorner === 'left'
          ? Math.random() * 200 - 50 // spread right and slightly left
          : Math.random() * 200 - 150; // spread left and slightly right
      const endX = horizontalSpread;
      const endY = window.innerHeight - startY + 100;
      const endRotation = rotation + 720;

      particle.style.position = 'fixed';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
      particle.style.opacity = '1';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '20';
      particle.style.willChange = 'transform, opacity';
      particle.style.transform = `translate(0, 0) rotate(${rotation}deg)`;

      container.appendChild(particle);

      return {
        element: particle,
        startX: 0, // translate starts at 0
        startY: 0, // translate starts at 0
        endX: endX, // final translate X
        endY: endY, // final translate Y
        startRotation: rotation,
        endRotation: endRotation,
        duration: duration * 1000,
        startTime: Date.now() + delay * 1000,
        delay: delay * 1000
      };
    };

    const animate = () => {
      const now = Date.now();

      // Create new particles from both corners
      if (now - lastParticleTimeRef.current >= 80) {
        // Create particle from bottom left
        const leftParticle = createParticle('left');
        if (leftParticle) {
          particlesRef.current.push(leftParticle);
        }
        // Create particle from bottom right
        const rightParticle = createParticle('right');
        if (rightParticle) {
          particlesRef.current.push(rightParticle);
        }
        lastParticleTimeRef.current = now;
      }

      // Animate existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        const elapsed = now - particle.startTime;

        if (elapsed < 0) {
          // Particle hasn't started yet
          return true;
        }

        const progress = Math.min(elapsed / particle.duration, 1);
        const currentX =
          particle.startX + (particle.endX - particle.startX) * progress;
        const currentY =
          particle.startY + (particle.endY - particle.startY) * progress;
        const currentRotation =
          particle.startRotation +
          (particle.endRotation - particle.startRotation) * progress;

        particle.element.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
        particle.element.style.opacity = String(1 - progress);

        if (progress >= 1) {
          // Animation complete, remove particle
          if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
          }
          return false;
        }

        return true;
      });

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      particlesRef.current.forEach((particle) => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      particlesRef.current = [];
    };
  }, [isActive, sourceElement]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 20 }}
    />
  );
};

export default ConfettiRain;
