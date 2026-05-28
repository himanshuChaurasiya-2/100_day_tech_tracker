import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trailPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const renderLoop = () => {

      const ease = 0.15;
      trailPos.x += (mouse.x - trailPos.x) * ease;
      trailPos.y += (mouse.y - trailPos.y) * ease;

      trail.style.transform = `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#00e5ff] rounded-full pointer-events-none z-[9999] mix-blend-screen will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-8 h-8 border-[1px] border-[#00e5ff]/35 rounded-full pointer-events-none z-[9998] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
    </>
  );
}
