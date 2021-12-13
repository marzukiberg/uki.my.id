import Aos from "aos";
import React, { useEffect } from "react";
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
} from "./components/organisms";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SifdevsCreative from "./components/pages/SifdevsCreative";
import WebTemplates from "./components/pages/SifdevsCreative/[web]";
import UcupDL from "./components/pages/UcupDL";
import Helmet from "react-helmet";
import HaditsHarian from "./components/pages/HaditsHarian";

const Home = () => (
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

const App = () => {
  useEffect(() => {
    Aos.init({
      easing: "ease",
      duration: 700,
    });
  }, [Aos]);
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/sifdevs-creative/:web" element={<WebTemplates />} />
        <Route path="/sifdevs-creative" element={<SifdevsCreative />} />
        <Route
          path="/UcupDL"
          element={
            <>
              <Helmet>
                <title>
                  UcupDL - Pengunduh YouTube sederhana | uki.thedev.id
                </title>
              </Helmet>
              <UcupDL />
            </>
          }
        />
        <Route
          path="/hadits-harian"
          element={
            <>
              <Helmet>
                <title>Dapatkan Notifikasi Hadits Harian | uki.thedev.id</title>
              </Helmet>
              <HaditsHarian />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
