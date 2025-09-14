import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Image,
  Link,
  Code,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Modal from "../../../components/organisms/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Yup validation schema
const portfolioSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  text: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  stacks: Yup.array()
    .of(Yup.string().required("Stack item cannot be empty"))
    .min(1, "At least one stack is required")
    .transform((value, originalValue) => {
      // Ensure it's always an array, even if input is a string
      if (typeof originalValue === "string") {
        return originalValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return value;
    }),
  link: Yup.string().url("Must be a valid URL").required("Link is required"),
});

// Mock data for initial portfolio items
// In a real app, this would come from an API or database
// Available stack options for react-select
const availableStackOptions = [
  { value: "reactjs.png", label: "ReactJS" },
  { value: "tailwindcss.svg", label: "TailwindCSS" },
  { value: "openai.png", label: "OpenAI" },
  { value: "nextjs.png", label: "NextJS" },
  { value: "bootstrap-5.png", label: "Bootstrap 5" },
  { value: "css3.png", label: "CSS3" },
  { value: "html5.png", label: "HTML5" },
  { value: "javascript.png", label: "JavaScript" },
  { value: "nodejs.png", label: "NodeJS" },
  { value: "php.png", label: "PHP" },
  { value: "mysql.png", label: "MySQL" },
  { value: "git.png", label: "Git" },
  { value: "github.png", label: "GitHub" },
  { value: "vercel.png", label: "Vercel" },
  { value: "firebase.png", label: "Firebase" },
  { value: "redux.svg", label: "Redux" },
  { value: "typescript.png", label: "TypeScript" },
  { value: "vite.svg", label: "Vite" },
  { value: "vuejs.png", label: "VueJS" },
];

const initialPortfolioData = [
  {
    id: 1,
    title: "Studio8.AI",
    text: "Create stunning AI-generated images using state-of-the-art models",
    img: "https://res.cloudinary.com/uki14/image/upload/v1731835917/frontendonesia/projects/studio8/poovkwgxcfjuucu89u4n.png",
    stacks: ["reactjs.png", "tailwindcss.svg", "openai.png"],
    link: "https://studio8.ai",
  },
  {
    id: 2,
    title: "KodeGPT",
    text: "Generate complete websites using AI without writing code (In Development)",
    img: "https://res.cloudinary.com/uki14/image/upload/v1747901111/frontendonesia/projects/kodeGPT/mifmt1uzulxfg5dvsxwr.png",
    stacks: ["reactjs.png", "tailwindcss.svg", "openai.png"],
    link: "/#",
  },
];

export default function AdminPortfolio() {
  const [portfolioItems, setPortfolioItems] = useState(initialPortfolioData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    img: "", // Will store the first image URL for backward compatibility
    images: [], // Will store all image URLs
    stacks: [],
    link: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio data");
        }
        const data = await response.json();
        setPortfolioItems(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };
    fetchPortfolioData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStacksChange = (selectedOptions) => {
    // react-select returns an array of selected options or null if none
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData((prev) => ({ ...prev, stacks: selectedValues }));
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadPromises = acceptedFiles.map(async (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = async () => {
          const base64String = reader.result;
          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ file: base64String }),
            });
            const data = await response.json();
            if (response.ok) {
              resolve(data.url); // Resolve with the Cloudinary URL
            } else {
              console.error("Error uploading image:", data.message);
              resolve(null); // Resolve with null on error
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            resolve(null); // Resolve with null on error
          }
        };
      });
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(Boolean); // Filter out nulls

    setFormData((prev) => {
      const updatedImages = [...prev.images, ...validUrls];
      const primaryImg = updatedImages.length > 0 ? updatedImages[0] : prev.img;
      return {
        ...prev,
        img: primaryImg,
        images: updatedImages,
      };
    });

    // Create previews from the original files for immediate feedback
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true, // Allow multiple files
  });

  const removeImage = (indexToRemove) => {
    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedPreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );

    setFormData((prev) => ({
      ...prev,
      img: updatedImages.length > 0 ? updatedImages[0] : "", // Update primary image
      images: updatedImages,
    }));
    setImagePreviews(updatedPreviews);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };

  const handleSubmit = async (values, formikHelpers) => {
    const { setSubmitting, resetForm } = formikHelpers;
    try {
      const method = isEditing ? "PUT" : "POST";
      // For now, we'll send only the primary image URL in the API body
      // The API might need to be updated to handle multiple images
      const dataToSend = {
        ...values,
        img: formData.img, // Primary image from state (managed by dropzone)
        // images: formData.images // If API supports multiple images
      };
      const response = await fetch("/api/portfolio", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio item");
      }

      const result = await response.json();
      console.log(result.message);

      // Refresh the list after successful save
      const fetchPortfolioData = async () => {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        setPortfolioItems(data);
      };
      fetchPortfolioData();

      // Clean up object URLs
      imagePreviews.forEach(URL.revokeObjectURL);
      setImagePreviews([]);
      resetForm(); // Reset Formik form
      resetFormState(); // Reset custom state
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      alert("Error saving portfolio item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: formData.title || "",
      text: formData.text || "",
      stacks: formData.stacks || [],
      link: formData.link || "",
    },
    validationSchema: portfolioSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true, // Re-initialize form if formData changes (e.g. on edit)
  });

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    // For editing, we might only have the primary image URL initially
    // If the item had multiple images, they would need to be fetched or stored
    setFormData({
      ...item,
      images: item.img ? [item.img] : [], // Assuming 'img' is the primary image
    });
    // For previews, if only primary image is available:
    setImagePreviews(item.img ? [item.img] : []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this portfolio item?")
    ) {
      try {
        const response = await fetch(`/api/portfolio?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete portfolio item");
        }

        const result = await response.json();
        console.log(result.message);

        // Refresh the list after successful deletion
        const fetchPortfolioData = async () => {
          const res = await fetch("/api/portfolio");
          const data = await res.json();
          setPortfolioItems(data);
        };
        fetchPortfolioData();
      } catch (error) {
        console.error("Error deleting portfolio item:", error);
        alert("Error deleting portfolio item. Please try again.");
      }
    }
  };

  const resetFormState = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({
      title: "",
      text: "",
      img: "",
      images: [],
      stacks: [],
      link: "",
    });
    // Clean up object URLs
    imagePreviews.forEach(URL.revokeObjectURL);
    setImagePreviews([]);
  };

  const resetForm = () => {
    // This will be called by Formik's resetForm
    resetFormState();
  };

  const handleModalClose = () => {
    // Clean up object URLs if modal is closed without submitting
    imagePreviews.forEach(URL.revokeObjectURL);
    setImagePreviews([]);
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div>
      <Head>
        <title>Admin Portfolio</title>
        <meta
          name="description"
          content="Admin panel for managing portfolio items"
        />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Admin Portfolio</h1>

        {/* Portfolio Items List */}
        <div className="rounded-lg border bg-white">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-semibold">Portfolio Items</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Portfolio
            </Button>
          </div>
          {portfolioItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No portfolio items found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Stacks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.text}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <img
                        src={item.img}
                        alt={item.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.stacks.map((stack, index) => (
                          <span
                            key={index}
                            className="rounded bg-gray-100 px-2 py-1 text-xs"
                          >
                            {stack}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="mr-2 h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={isEditing ? "Edit Portfolio Item" : "Add New Portfolio Item"}
          actionButtonText={isEditing ? "Update Item" : "Add Item"}
          onSubmit={formik.handleSubmit}
          cancelButtonText={isEditing ? "Cancel" : undefined}
          onCancel={isEditing ? handleModalClose : undefined}
        >
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  size={16}
                />
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter title"
                  className="pl-10"
                />
              </div>
              {formik.errors.title && formik.touched.title && (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.title}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="text"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="text"
                name="text"
                value={formik.values.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter description"
                className="resize-none"
                rows={3}
              />
              {formik.errors.text && formik.touched.text && (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.text}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <Image className="mx-auto h-12 w-12 text-gray-400" size={48} />
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the images here ..."
                    : "Drag 'n' drop some images here, or click to select images"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  (PNG, JPG, GIF, WEBP)
                </p>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Image Previews:
                  </h4>
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="stacks"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Stacks
              </label>
              <div className="mb-2">
                <label
                  htmlFor="stacks"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Stacks
                </label>
                <Select
                  id="stacks"
                  name="stacks"
                  options={availableStackOptions}
                  isMulti
                  value={availableStackOptions.filter((option) =>
                    formik.values.stacks.includes(option.value)
                  )}
                  onChange={handleStacksChange}
                  onBlur={formik.handleBlur}
                  placeholder="Select stacks..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              {formik.errors.stacks && formik.touched.stacks && (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.stacks}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="link"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Link
              </label>
              <div className="relative">
                <Link
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  size={16}
                />
                <Input
                  id="link"
                  name="link"
                  value={formik.values.link}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter link URL"
                  className="pl-10"
                />
              </div>
              {formik.errors.link && formik.touched.link && (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.link}
                </div>
              )}
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
