import React from 'react';
import Blobs from './Blobs';
import TechStackItem from './TechStackItem';

const dataTechStacks = [
  {
    img: 'html5.png',
    text: 'HTML5',
  },
  {
    img: 'css3.png',
    text: 'CSS3',
  },
  {
    img: 'javascript.png',
    text: 'JavaScript',
  },
  {
    img: 'nodejs.png',
    text: 'NodeJS',
  },
  {
    img: 'reactjs.png',
    text: 'ReactJS',
  },
  {
    img: 'nextjs.png',
    text: 'NextJS',
  },
  {
    img: 'tailwindcss.svg',
    text: 'TailwindCSS',
  },
  {
    img: 'php.png',
    text: 'PHP',
  },
  {
    img: 'mysql.png',
    text: 'MySQL',
  },
  {
    img: 'git.png',
    text: 'Git',
  },
];
const TechStack = () => {
  return (
    <section className="relative" id="skills">
      <Blobs />

      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <div className="space-y-6 text-center">
          <h2
            className="text-2xl md:text-4xl font-semibold font-poppins"
            data-aos="fade-in"
          >
            Tech Stack
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {dataTechStacks.map((item, index) => (
              <TechStackItem
                key={index.toString()}
                img={item.img}
                text={item.text}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
