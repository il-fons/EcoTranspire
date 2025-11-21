import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Explanation from './components/Explanation';
import Calculator from './components/Calculator';
import IrrigationAdvisor from './components/IrrigationAdvisor';
import AiAdvisor from './components/AiAdvisor';
import Footer from './components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    // Automatically scroll to the irrigation-advisor section when the app loads
    const section = document.getElementById('irrigation-advisor');
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Small delay to ensure rendering is complete and provide a visual transition
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Explanation />
        <Calculator />
        <IrrigationAdvisor />
        <AiAdvisor />
      </main>
      <Footer />
    </div>
  );
};

export default App;