import FadeInUp from "../../atoms/FadeInUp";
import Blobs from "./Blobs";
import TechStackItem from "./TechStackItem";
import dataTechStacks from "../../../data/techstack.json";

const TechStack = () => {
  return (
    <section className="relative py-16 sm:py-24" id="skills">
      <Blobs />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          <FadeInUp>
            <h2 className="font-poppins text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
              Tech Stack
            </h2>
          </FadeInUp>

          <FadeInUp>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {dataTechStacks.map((item, index) => (
                <TechStackItem
                  key={index.toString()}
                  img={item.img}
                  text={item.text}
                />
              ))}
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
