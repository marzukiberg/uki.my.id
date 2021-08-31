import Aos from 'aos';
import React, { useEffect } from 'react';
import { Header, Navbar } from './components';
import { About, Hero, Portfolio, TechStack, Tools } from './sections';

const App = () => {
  useEffect(() => {
    Aos.init({
      easing: 'ease',
      duration: 700,
    });
  }, [Aos]);
  return (
    <>
      <Header />
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Tools />
      <Portfolio />
    </>
  );
};

export default App;
