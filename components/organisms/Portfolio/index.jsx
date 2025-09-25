import PortfolioCard from "./PortfolioCard";
import portfolioData from "../../../data/portfolio.json";
import { getPortfolioImageUrl } from "../../../utils/imageUtils"; // Import helper

const Portfolio = () => {
  // Filter out projects with invalid or empty image URLs
  const validProjects = portfolioData.projects.filter(project => getPortfolioImageUrl(project));

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
          {validProjects.map((project, index) => (
            <PortfolioCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
