import React from 'react';
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
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