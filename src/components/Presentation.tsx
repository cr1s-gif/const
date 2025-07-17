import React from 'react';

export const Presentation: React.FC = () => {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-blue-700 via-blue-700 to-blue-300">
      <div className='bg-white'>
      <h1 className="text-4xl font-bold mb-4">Welcome to LandingCo</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        We help businesses create stunning landing pages that convert visitors into customers.
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-lg">
        Learn More
      </button>
      </div>
    </section>
  );
};
