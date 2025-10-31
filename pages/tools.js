import Head from "next/head";
import { useState } from "react";
import SearchLayout from "../components/SearchLayout";

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState("Tools");

  return (
    <>
      <Head>
        <title>Ukay.dev | Tools</title>
      </Head>
      <SearchLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-light text-gray-400 mb-4">Coming Soon</h1>
            <p className="text-lg text-gray-600">We are working on something awesome. Stay tuned!</p>
          </div>
        </div>
      </SearchLayout>
    </>
  );
};

export default ToolsPage;