import React from 'react';

const carouselItems = [
  { id: 1, title: "Product 1", image: "https://img.heroui.chat/image/dashboard?w=400&h=300&u=1" },
  { id: 2, title: "Product 2", image: "https://img.heroui.chat/image/dashboard?w=400&h=300&u=2" },
  { id: 3, title: "Product 3", image: "https://img.heroui.chat/image/dashboard?w=400&h=300&u=3" },
];

export const Carousel: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-blue-300">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {carouselItems.map((item) => (
          <div key={item.id} className="w-64 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <p className="text-lg font-semibold">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};