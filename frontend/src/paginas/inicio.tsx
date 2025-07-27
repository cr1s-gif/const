import React, { useEffect, useRef } from 'react';
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../index.css';

// Registrar el plugin de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Componentes individuales
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Icon icon="lucide:layout" className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-bold text-xl">LandingCo</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Features
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Customers
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Pricing
            </a>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Presentation = () => {
  return (
    <section className="flex w-full py-20 px-4  item-center justify-center bg-gradient-to-b from-blue-700 via-blue-700 to-blue-300">
      <div className='w-96 bg-white rounded-l-lg shadow-xl/30'></div>
      <div className='w-96 h-96 display-flex bg-white shadow-xl/30 rounded-r-lg relative'>
        <p className='m-8 max-w-2xl mx-auto text-center cherry-font text-5xl'>
          We help businesses create stunning landing pages that convert visitors into customers.
        </p>
        <a href='/dashboard' className="absolute bottom-20 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-lg">
          Learn More
        </a>
      </div>
    </section>
  );
};

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
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="flex h-full w-[400vw]">
        <div className="w-screen h-full flex items-center justify-center bg-blue-300 text-white text-4xl font-bold">Card 1</div>
        <div className="w-screen h-full flex items-center justify-center bg-blue-300 text-white text-4xl font-bold">Card 2</div>
        <div className="w-screen h-full flex items-center justify-center bg-blue-300 text-white text-4xl font-bold">Card 3</div>
        <div className="w-screen h-full flex items-center justify-center bg-blue-300 text-white text-4xl font-bold">Card 4</div>
      </div>
    </section>
  );
};

const Information = () => {
  const features = [
    { icon: "lucide:zap", title: "Fast", description: "Lightning-quick load times" },
    { icon: "lucide:shield", title: "Secure", description: "Top-notch security measures" },
    { icon: "lucide:smartphone", title: "Responsive", description: "Looks great on all devices" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-t from-blue-700 to-blue-300">
      <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6 text-center shadow-md">
            <Icon icon={feature.icon} className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-blue-700 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-600">&copy; 2024 LandingCo. All rights reserved.</p>
        </div>
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-gray-800">
            <Icon icon="logos:facebook" className="text-2xl" />
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-gray-800">
            <Icon icon="logos:twitter" className="text-2xl" />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-gray-800">
            <Icon icon="logos:instagram-icon" className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
};

// Componente principal que une todo
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Presentation />
      <HorizontalCarousel />
      <Information />
      <Footer />
    </div>
  );
};

export default LandingPage;