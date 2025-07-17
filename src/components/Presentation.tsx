import React from 'react';
import '/home/cr1s-gif/const/src/index.css';


export const Presentation: React.FC = () => {
  return (
    <section className=" flex w-full py-20 px-4 flex item-center justify-center bg-gradient-to-b from-blue-700 via-blue-700 to-blue-300">
      <div className='w-96 bg-white rounded-l-lg shadow-xl/30'></div>
      <div className='w-96 h-96 display-flex bg-white shadow-xl/30 rounded-r-lg relative'>
      <p className='text-xl m-8 max-w-2xl mx-auto text-center cherry-font'>
        We help businesses create stunning landing pages that convert visitors into customers.
      </p>
      <button className="absolute bottom-20 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-lg">
        Learn More
      </button>
      </div>
    </section>
  );
};
