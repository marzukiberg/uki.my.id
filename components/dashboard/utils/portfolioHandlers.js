import { toast } from "sonner";
import { getCircularReplacer } from "./helpers";
import FieldBuilder from "../../FieldBuilder";

// Portfolio Handlers
const createPortfolioHandlers = (
  handleOpen,
  handleClose,
  portfolioFields,
  portfolioValidationSchema,
  setPortfolio // New prop
) => {
  const handleAddPortfolio = () => {
    const onSubmit = async (values) => {
      // Made async
      const sanitizedValues = {
        ...values,
        image: values.image instanceof File ? values.image.name : values.image,
      };
      toast.info(
        `Saving new Portfolio: ${JSON.stringify(
          sanitizedValues,
          getCircularReplacer()
        )}`
      );
      // Assuming API call for portfolio add
      // const response = await fetch("/api/portfolio", { ... });
      // const result = await response.json();
      // if (result.success) {
      //   setPortfolio((prev) => [...prev, result.data]);
      //   toast.success("Portfolio item added successfully");
      // } else {
      //   toast.error("Error adding portfolio item");
      // }
      handleClose();
    };

    handleOpen(
      <FieldBuilder
        fields={portfolioFields}
        withFormik={true}
        validationSchema={portfolioValidationSchema}
        showButtons={true}
        onSubmit={onSubmit}
        onClose={handleClose}
      />,
      {
        title: "Add New Portfolio Item",
        subtitle: "Enter details for the new project.",
      }
    );
  };

  const handleEditPortfolio = (item) => {
    const onSubmit = async (values) => {
      // Made async
      const sanitizedValues = {
        ...values,
        image: values.image instanceof File ? values.image.name : values.image,
      };
      toast.info(
        `Saving changes for ${item.title}: ${JSON.stringify(
          sanitizedValues,
          getCircularReplacer()
        )}`
      );
      // Assuming API call for portfolio update
      // const response = await fetch("/api/portfolio", { ... });
      // const result = await response.json();
      // if (result.success) {
      //   setPortfolio((prev) => prev.map((p) => (p.title === item.title ? result.data : p)));
      //   toast.success("Portfolio item updated successfully");
      // } else {
      //   toast.error("Error updating portfolio item");
      // }
      handleClose();
    };

    handleOpen(
      <FieldBuilder
        fields={portfolioFields}
        initialData={{
          title: item.title,
          description: item.text,
          link: item.link,
        }}
        withFormik={true}
        validationSchema={portfolioValidationSchema}
        showButtons={true}
        onSubmit={onSubmit}
        onClose={handleClose}
      />,
      {
        title: `Edit Portfolio: ${item.title}`,
        subtitle: "Modify the details for this project.",
      }
    );
  };

  const handleDeletePortfolio = (item) => {
    toast.info(`Delete Portfolio: ${item.title}`);
    // Assuming API call for portfolio delete
    // const response = await fetch("/api/portfolio", { ... });
    // const result = await response.json();
    // if (result.success) {
    //   setPortfolio((prev) => prev.filter((p) => p.title !== item.title));
    //   toast.success("Portfolio item deleted successfully");
    // } else {
    //   toast.error("Error deleting portfolio item");
    // }
  };

  return {
    handleAddPortfolio,
    handleEditPortfolio,
    handleDeletePortfolio,
  };
};

export { createPortfolioHandlers };
