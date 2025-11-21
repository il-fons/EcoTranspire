import React from 'react';
import { Github, Droplets } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <Droplets className="h-6 w-6 text-leaf-500 mr-2" />
            <span className="text-xl font-bold text-white">EcoTranspire</span>
          </div>
          
          <div className="text-sm text-slate-500 text-center md:text-right">
            <p className="mb-2">Un progetto educativo per comprendere il ciclo dell'acqua.</p>
            <p>&copy; {new Date().getFullYear()} EcoTranspire. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;