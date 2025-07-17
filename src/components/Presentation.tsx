import React from 'react';

export const Presentation: React.FC = () => {
  return (
    <section className=" flex w-full py-20 px-4 text-center bg-gradient-to-b from-blue-700 via-blue-700 to-blue-300">
      <div className='w-1/2 bg-white rounded-l-lg '></div>
      <div className='w-1/2 h-full flex item-center justify-center bg-white shadow-xl rounded-r-lg'>
      <h1 className="text-4xl font-bold mb-4 text-right">Welcome to LandingCo</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-right">
        We help businesses create stunning landing pages that convert visitors into customers.
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-lg">
        Learn More
      </button>
      </div>
    </section>
  );
};
