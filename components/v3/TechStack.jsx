import techstackData from "../../data/techstack.json";

// Category membership keyed by tech name from data/techstack.json
const CATEGORY_LABELS = [
  {
    id: "frontend",
    label: "Frontend",
    names: ["HTML5", "CSS3", "JavaScript", "ReactJS", "NextJS", "TailwindCSS"],
  },
  {
    id: "backend",
    label: "Backend",
    names: ["NodeJS", "PHP", "MySQL"],
  },
  {
    id: "tools",
    label: "Tools",
    names: ["Git"],
  },
];

const TechStack = () => {
  const groups = CATEGORY_LABELS.map(({ id, label, names }) => ({
    id,
    label,
    items: techstackData.filter((tech) => names.includes(tech.text)),
  }));

  return (
    <section id="tech-stack" className="py-20 px-6 bg-white border-t border-zinc-100">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Tech Stack
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Tools &amp; technologies I work with
            </p>
          </div>

          {/* Count stat */}
          <div className="flex items-center text-sm font-mono">
            <span className="text-zinc-900 font-semibold">{techstackData.length}</span>
            <span className="text-zinc-400 ml-2 uppercase text-xs tracking-wider">tools</span>
          </div>
        </div>

        {/* Categorized stacks */}
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              {/* Category label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {group.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-300">
                  ({String(group.items.length).padStart(2, "0")})
                </span>
                <span aria-hidden="true" className="flex-1 h-px bg-zinc-200" />
              </div>

              {/* Stack grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {group.items.map((tech) => (
                  <div
                    key={tech.text}
                    className="bg-white border border-zinc-200 hover:border-zinc-400 px-4 py-3.5 font-mono text-xs uppercase tracking-wider text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {tech.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
