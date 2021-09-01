import Aos from 'aos';
import React, { useEffect } from 'react';
import {
  About,
  Footer,
  Header,
  Hero,
  Navbar,
  Portfolio,
  TechStack,
  ThankYou,
  Tools,
} from './components/organisms';

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
      <ThankYou />
      <Footer />
    </>
  );
};

export default App;
