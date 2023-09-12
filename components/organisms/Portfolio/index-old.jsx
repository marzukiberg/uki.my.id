import React from "react";
import PortfolioCard from "./PortfolioCard";

const Portfolio = () => {
  return (
    <section id="portfolio">
      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <h2
          className="font-poppins mb-6 text-2xl font-semibold md:text-4xl"
          data-aos="fade-in"
        >
          Portfolio
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <PortfolioCard
            title="Hadits Harian"
            text="Terima Notfikiasi Hadits Random Harian Langsung dari Web"
            img="hadits-harian-v2.png"
            localImage
            stacks={["reactjs.png", "tailwindcss.svg"]}
            link="https://hadits-harian-v2.vercel.app/"
          />
          <PortfolioCard
            title="Bagi Ilmu Landing Page"
            text="A Landing Page of Civil Servant Candidate Online Test"
            img="/c_scale,w_400/v1630251588/uki.my.id/portfolio/bagi-ilmu.png"
            stacks={[
              "html5.png",
              "css3.png",
              "javascript.png",
              "bootstrap-5.png",
            ]}
            link="//bagi-ilmu.com"
          />
          <PortfolioCard
            title="Kompetisi SKD Landing Page"
            text="A Civil Servant Candidate Online Test provided by Olymps"
            img="/c_scale,w_400/v1630252740/uki.my.id/portfolio/kompetisi-skd.png"
            stacks={[
              "html5.png",
              "css3.png",
              "javascript.png",
              "tailwindcss.svg",
            ]}
            link="https://kompetisi-skd.netlify.app/"
          />
          <PortfolioCard
            title="Amazon Web Clone"
            text="A Cloned Version of Amazon Web Store"
            img="/c_scale,w_400/v1602297082/uki.my.id/portfolio/amazon-clone_fslfos.png"
            stacks={["reactjs.png", "redux.svg"]}
            link="/#"
          />
          <PortfolioCard
            title="Agent Prudential Landing Page"
            text="Agent Prudential Landing Page"
            img="/v1630400155/uki.my.id/portfolio/agenpru.png"
            stacks={[
              "html5.png",
              "css3.png",
              "javascript.png",
              "bootstrap-5.png",
            ]}
            link="https://al-ikhsanprusyariah.vercel.app/"
          />
          <PortfolioCard
            title="Wedding Invitation Service"
            text="A website that provides wedding invitation template."
            img="/v1630400606/uki.my.id/portfolio/Screenshot_50_ebfmzj.png"
            stacks={["nextjs.png", "bootstrap-5.png"]}
            link="https://undig.id/"
          />
          <PortfolioCard
            title="Whatsapp UI Clone"
            text="Just a Whatsapp UI cloned version"
            img="/v1602297081/uki.my.id/portfolio/whatsapp-clone_zfbef3.png"
            stacks={["reactjs.png"]}
            link="/#"
          />
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
