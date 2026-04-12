import React, { useState, useEffect } from 'react';
import { Droplets, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
  }`;

  const textClasses = isScrolled ? 'text-slate-800' : 'text-white';
  const buttonClasses = isScrolled 
    ? 'bg-leaf-600 text-white hover:bg-leaf-700' 
    : 'bg-white text-leaf-700 hover:bg-gray-100';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
          <Droplets className={`h-8 w-8 mr-2 ${isScrolled ? 'text-sky-500' : 'text-sky-300'}`} />
          <span className={`text-xl font-bold ${textClasses}`}>EcoTranspire</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => scrollToSection('explanation')} className={`font-medium hover:opacity-75 ${textClasses}`}>
            Il Processo
          </button>
          <button onClick={() => scrollToSection('simulator')} className={`font-medium hover:opacity-75 ${textClasses}`}>
            Simulatore
          </button>
          <button onClick={() => scrollToSection('irrigation-advisor')} className={`font-medium hover:opacity-75 ${textClasses}`}>
            Calcolo Irrigazione
          </button>
          <button onClick={() => scrollToSection('sector-design')} className={`font-medium hover:opacity-75 ${textClasses}`}>
            Progettazione settori irrigui
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={textClasses}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 border-t">
          <button onClick={() => scrollToSection('explanation')} className="text-slate-700 font-medium py-2">
            Il Processo
          </button>
          <button onClick={() => scrollToSection('simulator')} className="text-slate-700 font-medium py-2">
            Simulatore
          </button>
          <button onClick={() => scrollToSection('irrigation-advisor')} className="text-slate-700 font-medium py-2">
            Calcolo Irrigazione
          </button>
          <button onClick={() => scrollToSection('sector-design')} className="text-slate-700 font-medium py-2">
            Progettazione settori irrigui
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;