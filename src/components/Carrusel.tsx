import { useEffect, useRef ,} from "react";
import React from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HorizontalCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
  
    if (!container || !section) return;
  
    const numPanels = container.children.length;
    const totalScroll = container.scrollWidth - window.innerWidth;
  
    const ctx = gsap.context(() => {
      gsap.to(container, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          snap: 1 / (numPanels - 1),
          end: () => `+=${totalScroll}`,
        },
      });
    }, sectionRef);
  
    return () => ctx.revert();
  }, []);
  

  return (
    <>
      <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
        <div ref={containerRef} className="flex h-full w-[400vw]">
          <div className="w-screen h-full flex items-center justify-center bg-red-300 text-white text-4xl font-bold">Card 1</div>
          <div className="w-screen h-full flex items-center justify-center bg-blue-300 text-white text-4xl font-bold">Card 2</div>
          <div className="w-screen h-full flex items-center justify-center bg-green-300 text-white text-4xl font-bold">Card 3</div>
          <div className="w-screen h-full flex items-center justify-center bg-yellow-300 text-white text-4xl font-bold">Card 4</div>
        </div>
      </section>

    </>
  );
};

export default HorizontalCarousel;