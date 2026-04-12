import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Explanation from './components/Explanation';
import Calculator from './components/Calculator';
import IrrigationAdvisor from './components/IrrigationAdvisor';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Explanation />
        <Calculator />
        <IrrigationAdvisor />
      </main>
      <Footer />
    </div>
  );
};

export default App;