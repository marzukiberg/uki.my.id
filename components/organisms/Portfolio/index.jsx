import PortfolioCard from "./PortfolioCard";
import portfolioData from "../../../data/portfolio.json";

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
          {portfolioData.projects.map((project, index) => (
            <PortfolioCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
