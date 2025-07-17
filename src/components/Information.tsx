import React from 'react';
import { Icon } from "@iconify/react";

const features = [
  { icon: "lucide:zap", title: "Fast", description: "Lightning-quick load times" },
  { icon: "lucide:shield", title: "Secure", description: "Top-notch security measures" },
  { icon: "lucide:smartphone", title: "Responsive", description: "Looks great on all devices" },
];

export const Information: React.FC = () => {
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
