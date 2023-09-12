import React from "react";
import PortfolioCard from "./PortfolioCard";

const randomId = () => Math.random().toString(36).substr(2, 9);
const KaryaIlmiahs = [
  {
    title:
      "Penerapan Algoritma K-Means dan K-Medoid untuk Pengelompokkan Data Pasien Covid-19",
    year: "2021",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=_QYUvKsAAAAJ&citation_for_view=_QYUvKsAAAAJ:u5HHmVD_uO8C",
    author: "UR Gurning, M Mustakim",
    journal:
      "Building of Informatics, Technology and Science (BITS) 3 (1), 48-55",
  },
  {
    title:
      "Comparison of Naïve Bayes, C4. 5 and K-Nearest Neighbor for Covid-19 Data Classification",
    year: "2022",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=_QYUvKsAAAAJ&citation_for_view=_QYUvKsAAAAJ:UeHWp8X0CEIC",
    author: "UR Gurning, ST Rizaldi, H Syukron",
    journal:
      "2022 International Symposium on Information Technology and Digital Innovation (ISITDI)",
  },
  {
    title:
      "Comparison of MOORA and PROMETHEE Method in Smartphone Selection Decision Making Perbandingan Metode MOORA dan ROMETHEE Pada Pengambilan Keputusan Pemilihan Smartphone",
    year: "2022",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=_QYUvKsAAAAJ&citation_for_view=_QYUvKsAAAAJ:9yKSN-GCB0IC",
    author: "UR Gurning, MIAI Mustakim, R Asrianto",
  },
  {
    title:
      "Perbandingan Algoritma NBC dan C4. 5 Dalam Analisa Sentimen Pemilihan Presiden 2024 Pada Twitter: Comparison of the NBC and C4. 5 Algorithms in Sentiment Analysis for the 2024 …",
    year: "2023",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=_QYUvKsAAAAJ&citation_for_view=_QYUvKsAAAAJ:eQOLeE2rZwMC",
    author: "B Delvika, N Abror, UR Gurning",
    journal:
      "SENTIMAS: Seminar Nasional Penelitian dan Pengabdian Masyarakat, 41-48",
  },
  {
    title:
      "Support Vector Machine Algorithm Optimization Using Particle Swarm Optimization for Prosperous Family Card Recipients: Optimasi Algoritma Support Vector Machine Menggunakan …",
    year: "2023",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=_QYUvKsAAAAJ&citation_for_view=_QYUvKsAAAAJ:eQOLeE2rZwMC",
    author: "AG Yuda, AM Karomah, DTP Ramadhan, SI Putri, UR Gurning",
    journal:
      "SENTIMAS: Seminar Nasional Penelitian dan Pengabdian Masyarakat, 64-69",
  },
  {
    title:
      "Chi-Square Features Selection in Unsupervised Learning Algorithm for Measuring Key Performance Indicators in Riau Province",
    year: "2023",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=_QYUvKsAAAAJ&citation_for_view=_QYUvKsAAAAJ:Y0pCki6q_DkC",
    author: "UR Gurning, I Permana, I Maita",
    journal:
      "2023 International Conference on Computer Science, Information Technology and Engineering (ICCoSITE)",
  },
];
const Portfolio = () => {
  return (
    <section id="portfolio">
      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <h2
          className="font-poppins mb-6 text-2xl font-semibold md:text-4xl"
          data-aos="fade-in"
        >
          Karya Ilmiah Saya
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          {KaryaIlmiahs.map((item, index) => (
            <div className="border bg-white p-3 shadow-lg" key={randomId()}>
              <a
                target="_blank"
                rel="noreferrer"
                href={item.url}
                className="title font-qs font-bold text-blue-400"
              >
                {item.title}
              </a>
              {/* year */}
              <div className="text-xs text-gray-400">{item.year}</div>
              {/* author */}
              <div className="text-xs text-gray-400">{item.author}</div>
              {/* description */}
              <div className="text-sm text-gray-600">{item.journal}</div>
            </div>
          ))}
        </div>
        <div className="p-6 text-center">
          <a
            href="https://scholar.google.com/citations?user=_QYUvKsAAAAJ&hl=en"
            target="_blank"
            rel="noreferrer"
            className="font-qs rounded-lg bg-blue-400 px-6 py-3 text-white"
          >
            <span>Lihat Selengkapnya Di Scholar</span>
            <i className="fa fa-external-link ml-2" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
