import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "next/head";
import React, { useCallback, useState } from "react";
import * as Yup from "yup";
import {
  createPortfolioHandlers,
  createTechStackHandlers,
  PortfolioTab,
  TechStackTab,
} from "../components/dashboard/index";
import ConfirmDialog from "../components/ui/confirm-dialog"; // Import ConfirmDialog
import initialPortfolio from "../data/portfolio.json"; // Import initial data
import initialTechStacks from "../data/techstack.json"; // Import initial data

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tech-stack");
  const [iframeSrc, setIframeSrc] = useState("http://localhost:3000/#skills");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [techStacks, setTechStacks] = useState(initialTechStacks); // State for tech stacks
  const [portfolio, setPortfolio] = useState(initialPortfolio.projects); // State for portfolio

  // State for delete confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = useCallback((content, options) => {
    setDialogContent({ content, options });
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setDialogContent(null);
  }, []);

  React.useEffect(() => {
    if (activeTab === "tech-stack") {
      setIframeSrc("http://localhost:3000/#skills");
    } else if (activeTab === "portfolio") {
      setIframeSrc("http://localhost:3000/#portfolio");
    }
  }, [activeTab]);

  const techStackFields = React.useMemo(
    () => [
      {
        name: "logo",
        label: "Logo",
        type: "dropzone",
        accept: "image/*",
        multiple: false,
      },
      { name: "name", label: "Technology Name", type: "text" },
    ],
    []
  );

  const techStackValidationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required("Technology Name is required"),
        logo: Yup.mixed().required("Logo is required"),
      }),
    []
  );

  const portfolioFields = React.useMemo(
    () => [
      { name: "image", label: "Image", type: "dropzone", accept: "image/*" },
      { name: "title", label: "Project Title", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "link", label: "Link", type: "text" },
    ],
    []
  );

  const portfolioValidationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        title: Yup.string().required("Project Title is required"),
        description: Yup.string().required("Description is required"),
        link: Yup.string()
          .url("Must be a valid URL")
          .required("Link is required"),
        image: Yup.mixed().required("Image is required"),
      }),
    []
  );

  const techStackHandlers = createTechStackHandlers(
    handleOpen,
    handleClose,
    techStackFields,
    techStackValidationSchema,
    setTechStacks, // Pass setTechStacks
    setShowDeleteConfirm, // Pass setShowDeleteConfirm
    setItemToDelete, // Pass setItemToDelete
    setIsDeleting // Pass setIsDeleting
  );

  const portfolioHandlers = createPortfolioHandlers(
    handleOpen,
    handleClose,
    portfolioFields,
    portfolioValidationSchema,
    setPortfolio // Pass setPortfolio
  );

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      if (value instanceof File) {
        return {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
        };
      }
      return value;
    };
  };

  const getPortfolioImageUrl = (item) => {
    if (!item.img) return null;
    if (item.localImage) {
      return `/img/portfolios/${item.img}`;
    } else if (item.img.startsWith("/")) {
      return `https://res.cloudinary.com/uki14/image/upload${item.img}`;
    }
    return item.img;
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-100 p-4 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
        <div className="flex h-[calc(100vh-32px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg lg:w-9/12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList>
              <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            <TabsContent value="tech-stack">
              <TechStackTab
                handlers={techStackHandlers}
                dataTechStacks={techStacks}
              />
            </TabsContent>
            <TabsContent value="portfolio">
              <PortfolioTab
                handlers={portfolioHandlers}
                dataPortfolio={portfolio}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="relative flex h-[667px] w-[375px] flex-col overflow-hidden rounded-3xl bg-gray-800 p-2 shadow-lg">
          <div className="absolute left-1/2 top-0 z-10 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-gray-700"></div>
          <div className="absolute bottom-2 left-1/2 z-10 h-1 w-16 -translate-x-1/2 rounded-full bg-gray-700"></div>
          <iframe
            src={iframeSrc}
            className="h-full w-full rounded-2xl border-none bg-white"
            title="Website Preview"
          ></iframe>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.options?.title}</DialogTitle>
            <DialogDescription>
              {dialogContent?.options?.subtitle}
            </DialogDescription>
          </DialogHeader>
          {dialogContent?.content}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => techStackHandlers.executeDeleteTechStack(itemToDelete)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${itemToDelete?.text}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};

export default DashboardPage;
