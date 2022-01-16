import Aos from "aos";
import Head from "next/head";
import Script from "next/script";
import React, { useEffect } from "react";
import {
  About,
  Footer,
  Hero,
  Navbar,
  Portfolio,
  TechStack,
  ThankYou,
  Tools,
} from "/components/organisms";

const App = () => {
  useEffect(() => {
    Aos.init({
      easing: "ease",
      duration: 700,
    });
  }, []);
  return (
    <>
      <Head>
        <title>Marzuki | Frontend Engineer</title>
      </Head>
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Tools />
      <Portfolio />
      <ThankYou />
      <Footer />

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js" />
      {/* <Router>
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
    </Router> */}
    </>
  );
};

export default App;
