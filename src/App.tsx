import React from 'react';
import { Navbar } from './components/Navbar';
import { Presentation } from './components/Presentation';
import { Carousel } from './components/Carousel';
import { Information } from './components/Information';
import { Footer } from './components/Footer';
import HorizontalCarousel from './components/Carrusel';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-grow">
        <Presentation />
        <Carousel />
        <Information />
        <HorizontalCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default App;
