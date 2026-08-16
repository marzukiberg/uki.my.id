import Head from "next/head";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../components/AppLayout";
import { About } from "../components/organisms";
import Portfolio from "../components/organisms/Portfolio";
import PortfolioSearchResultItem from "../components/organisms/Portfolio/PortfolioSearchResultItem";
import portfolioData from "../data/portfolio.json";
import { workExperience } from "../data/works";
import * as Icons from "lucide-react";

const MainPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const router = useRouter();
  const query = typeof router.query.q === "string" ? router.query.q.trim() : "";

  // Filter Portfolio Projects
  const matchedProjects = useMemo(() => {
    if (!query) return portfolioData.projects.filter((p) => p.title);
    const q = query.toLowerCase();
    return portfolioData.projects.filter((p) => {
      const matchTitle = p.title && p.title.toLowerCase().includes(q);
      const matchText = p.text && p.text.toLowerCase().includes(q);
      const matchDesc = p.description && p.description.toLowerCase().includes(q);
      const matchStacks = p.stacks && p.stacks.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchText || matchDesc || matchStacks;
    });
  }, [query]);

  // Filter Works / Experience
  const matchedWorks = useMemo(() => {
    if (!query) return workExperience;
    const q = query.toLowerCase();
    return workExperience.filter((w) => {
      const matchCompany = w.company && w.company.toLowerCase().includes(q);
      const matchPos = w.position && w.position.toLowerCase().includes(q);
      const matchDesc = w.description && w.description.toLowerCase().includes(q);
      const matchTech = w.technologies && w.technologies.some((t) => t.toLowerCase().includes(q));
      const matchAchieve = w.achievements && w.achievements.some((a) => a.toLowerCase().includes(q));
      return matchCompany || matchPos || matchDesc || matchTech || matchAchieve;
    });
  }, [query]);

  // Check if About / Bio matches
  const isAboutMatched = useMemo(() => {
    if (!query) return true;
    const q = query.toLowerCase();
    const aboutKeywords = [
      "marzuki", "ukay", "about", "bio", "frontend", "fullstack", "react", "next",
      "javascript", "typescript", "tailwind", "node", "laravel", "pekanbaru", "indonesia"
    ];
    return aboutKeywords.some((kw) => kw.includes(q) || q.includes(kw));
  }, [query]);

  const totalResultsCount =
    (isAboutMatched ? 1 : 0) + matchedWorks.length + matchedProjects.length;

  const isZeroResults = query.length > 0 && totalResultsCount === 0;

  return (
    <>
      <Head>
        <title>
          {query
            ? `${query} - Google Search | Marzuki`
            : "Marzuki | Frontend Developer & Fullstack Developer"}
        </title>
      </Head>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {/* Google Results Stats */}
        {query ? (
          <div className="mb-6 text-xs text-[#70757a]">
            About {totalResultsCount} results for &quot;<span className="font-medium text-[#202124]">{query}</span>&quot; (0.18 seconds)
          </div>
        ) : null}

        {/* Zero Results Google Empty State */}
        {isZeroResults ? (
          <div className="py-8 max-w-2xl space-y-4">
            <p className="text-base text-[#202124]">
              Your search &mdash; <strong className="text-black">{query}</strong> &mdash; did not match any portfolio, works, or about items.
            </p>
            <div className="pt-2 text-sm text-[#4d5156] space-y-1.5">
              <p className="font-medium text-[#202124]">Suggestions:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#5f6368]">
                <li>Make sure that all words are spelled correctly.</li>
                <li>Try different keywords (e.g. &ldquo;React&rdquo;, &ldquo;Next.js&rdquo;, &ldquo;PDFmu&rdquo;, &ldquo;Assist.id&rdquo;).</li>
                <li>Try more general keywords.</li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-[#1a73e8] hover:bg-gray-50 shadow-xs transition"
              >
                Reset Search / View All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Section 1: About (If matched or default view) */}
            {isAboutMatched && (
              <div>
                <About hideResultCount={Boolean(query)} />
              </div>
            )}

            {/* Section 2: Works / Career Experience */}
            {matchedWorks.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h2 className="text-xl font-normal text-[#202124]">
                      Work Experience &amp; Career
                    </h2>
                    <p className="mt-0.5 text-xs text-[#70757a]">
                      Showing {matchedWorks.length} work experience entries
                    </p>
                  </div>
                  <Link
                    href="/works"
                    className="text-xs text-[#1a73e8] hover:underline"
                  >
                    View in Works tab &rarr;
                  </Link>
                </div>

                <div className="max-w-3xl space-y-6">
                  {matchedWorks.map((work) => (
                    <div key={work.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <a
                            href={work.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium text-[#1a0dab] hover:underline inline-flex items-center gap-1.5"
                          >
                            <span>{work.company}</span>
                            <Icons.ExternalLink className="h-3.5 w-3.5 opacity-60" />
                          </a>
                          <p className="text-xs font-medium text-[#202124] mt-0.5">
                            {work.position} &bull; <span className="text-[#5f6368] font-normal">{work.location}</span>
                          </p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                          {work.period}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[#4d5156]">
                        {work.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {work.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-gray-100 bg-[#f8f9fa] px-2 py-0.5 text-[11px] text-[#3c4043]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Portfolio Projects */}
            {matchedProjects.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <Portfolio projects={matchedProjects} />
              </div>
            )}
          </div>
        )}
      </AppLayout>
    </>
  );
};

export default MainPage;
