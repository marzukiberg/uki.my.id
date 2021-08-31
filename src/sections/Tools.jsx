import React from 'react';

const Tools = () => {
  return (
    <section id="tools">
      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <h2
          className="text-2xl md:text-4xl font-semibold font-poppins mb-6 text-center"
          data-aos="fade-in"
        >
          Tools
        </h2>
        <div className="flex flex-wrap gap-12 justify-center">
          <img
            src="/img/logos/visual-studio-code.png"
            alt="VS Code"
            className="w-16 h-16"
            data-aos="fade-up"
          />
          <img
            src="/img/logos/npm.svg"
            alt="NPM"
            className="w-32"
            data-aos="fade-up"
          />
          <img
            src="/img/logos/github.png"
            alt="Github"
            className="w-16 h-16"
            data-aos="fade-up"
          />
        </div>
      </div>
    </section>
  );
};

export default Tools;
