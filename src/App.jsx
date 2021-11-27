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
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SifdevsCreative from "./components/pages/SifdevsCreative";
import WebTemplates from "./components/pages/SifdevsCreative/[web]";
import UcupDL from "./components/pages/UcupDL";
import Helmet from "react-helmet";

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
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/sifdevs-creative/:web">
          <WebTemplates />
        </Route>
        <Route path="/sifdevs-creative">
          <SifdevsCreative />
        </Route>
        <Route path="/UcupDL">
          <Helmet>
            <title>UcupDL - Pengunduh YouTube sederhana | uki.thedev.id</title>
          </Helmet>
          <UcupDL />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
