import { toast } from "sonner";
import { getCircularReplacer } from "./helpers";
import FieldBuilder from "../../FieldBuilder";

// Tech Stack Handlers
const createTechStackHandlers = (
  handleOpen,
  handleClose,
  techStackFields,
  techStackValidationSchema,
  setTechStacks, // New prop
  setShowDeleteConfirm,
  setItemToDelete,
  setIsDeleting
) => {
  const handleAddTechStack = async () => {
    const onSubmit = async (values) => {
      try {
        const logoValue =
          values.logo instanceof File ? values.logo.name : values.logo;
        const logoFilename = logoValue ? logoValue.split("/").pop() : "";

        const response = await fetch("/api/techstack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add",
            data: {
              name: values.name,
              logo: logoFilename,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success(`Tech stack added successfully: ${values.name}`);
          setTechStacks((prev) => [
            ...prev,
            { img: logoFilename, text: values.name },
          ]); // Update state
          // window.location.reload(); // Removed
          handleClose();
        } else {
          toast.error(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error saving techstack:", error);
        toast.error("Error saving techstack. Please try again.");
      }
    };

    handleOpen(
      <FieldBuilder
        fields={techStackFields}
        withFormik={false}
        validationSchema={techStackValidationSchema}
        showButtons={true}
        onSubmit={onSubmit}
        onClose={handleClose}
      />,
      {
        title: "Add New Tech Stack",
        subtitle: "Enter details for the new technology.",
      }
    );
  };

  const handleEditTechStack = (item) => {
    const onSubmit = async (values) => {
      try {
        const logoValue =
          values.logo instanceof File ? values.logo.name : values.logo;
        const logoFilename = logoValue ? logoValue.split("/").pop() : item.img;

        const response = await fetch("/api/techstack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update",
            data: {
              oldName: item.text,
              name: values.name,
              logo: logoFilename,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success(`Tech stack updated successfully: ${values.name}`);
          setTechStacks((prev) =>
            prev.map((ts) =>
              ts.text === item.text
                ? { img: logoFilename, text: values.name }
                : ts
            )
          ); // Update state
          // window.location.reload(); // Removed
          handleClose();
        } else {
          toast.error(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error updating techstack:", error);
        toast.error("Error updating techstack. Please try again.");
      }
    };

    handleOpen(
      <FieldBuilder
        fields={techStackFields}
        initialData={{ name: item.text, logo: item.img }}
        withFormik={false}
        validationSchema={techStackValidationSchema}
        showButtons={true}
        onSubmit={onSubmit}
        onClose={handleClose}
      />,
      {
        title: `Edit Tech Stack: ${item.text}`,
        subtitle: "Modify the details for this technology.",
      }
    );
  };

  const handleDeleteTechStack = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const executeDeleteTechStack = async (item) => {
    if (!item) return;
    setIsDeleting(true);
    try {
      const response = await fetch("/api/techstack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          data: {
            name: item.text,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Tech stack deleted successfully: ${item.text}`);
        setTechStacks((prev) => prev.filter((ts) => ts.text !== item.text)); // Update state
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting techstack:", error);
      toast.error("Error deleting techstack. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleAddTechStack,
    handleEditTechStack,
    handleDeleteTechStack,
    executeDeleteTechStack,
  };
};

export { createTechStackHandlers };
