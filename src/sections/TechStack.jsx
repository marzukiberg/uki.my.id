import React from 'react';
import styles from './TechStack.module.css';

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
    <section className="relative">
      <img
        src="/img/blob5.png"
        alt="Overlay"
        className="absolute left-0 bottom-0 h-full transform translate-y-24"
        style={{ zIndex: -1 }}
      />

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
              <div
                className={`flex items-center border space-x-3 rounded-md overflow-hidden group hover:drop-shadow-xl duration-300 ${styles.card}`}
                key={index.toString()}
                data-aos="fade-up"
              >
                <div className="w-1/3 p-2">
                  <img src={`/img/logos/${item.img}`} alt="logo" />
                </div>
                <div className="py-2">
                  <h4 className="text-lg md:text-xl group-hover:text-white duration-300 font-quicksand">
                    {item.text}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
