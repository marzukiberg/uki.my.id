import React from "react";
import Blobs from "./Blobs";
import TechStackItem from "./TechStackItem";

const dataTechStacks = [
  {
    img: "https://img.icons8.com/color/48/python--v1.png",
    imgAttributtionURL: "https://icons8.com/icon/13441/python",
    text: "Python",
  },
  {
    img: "html5.png",
    text: "HTML",
  },
  {
    img: "css3.png",
    text: "CSS3",
  },
  {
    img: "javascript.png",
    text: "JavaScript",
  },
  {
    img: "php.png",
    text: "PHP",
  },
  {
    img: "mysql.png",
    text: "MySQL",
  },
];
const TechStack = () => {
  return (
    <section className="relative" id="skills">
      <Blobs />

      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <div className="space-y-6 text-center">
          <h2
            className="font-poppins text-2xl font-semibold md:text-4xl"
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
                imgAttributtionURL={item.imgAttributtionURL}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
