import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "portfolio.json");

// Helper function to read portfolio data
const readPortfolioData = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return { projects: [] };
  }
};

// Helper function to write portfolio data
const writePortfolioData = async (data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing portfolio data:", error);
    return false;
  }
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Get all portfolio items
      readPortfolioData()
        .then((data) => {
          res.status(200).json(data.projects);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Error fetching portfolio items", error });
        });
      break;

    case "POST":
      // Add a new portfolio item
      const newItem = req.body;
      readPortfolioData()
        .then((data) => {
          const newId =
            data.projects.length > 0
              ? Math.max(...data.projects.map((p) => p.id)) + 1
              : 1;
          const updatedProjects = [...data.projects, { ...newItem, id: newId }];
          const updatedData = { ...data, projects: updatedProjects };

          return writePortfolioData(updatedData);
        })
        .then((success) => {
          if (success) {
            res
              .status(201)
              .json({
                message: "Portfolio item added successfully",
                item: newItem,
              });
          } else {
            res.status(500).json({ message: "Error adding portfolio item" });
          }
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Error adding portfolio item", error });
        });
      break;

    case "PUT":
      // Update an existing portfolio item
      const { id, ...updatedItem } = req.body;
      if (!id) {
        return res.status(400).json({ message: "ID is required for update" });
      }

      readPortfolioData()
        .then((data) => {
          const updatedProjects = data.projects.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          );
          const updatedData = { ...data, projects: updatedProjects };

          return writePortfolioData(updatedData);
        })
        .then((success) => {
          if (success) {
            res
              .status(200)
              .json({
                message: "Portfolio item updated successfully",
                item: { id, ...updatedItem },
              });
          } else {
            res.status(500).json({ message: "Error updating portfolio item" });
          }
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Error updating portfolio item", error });
        });
      break;

    case "DELETE":
      // Delete a portfolio item
      const { id: deleteId } = req.query;
      if (!deleteId) {
        return res.status(400).json({ message: "ID is required for deletion" });
      }

      readPortfolioData()
        .then((data) => {
          const filteredProjects = data.projects.filter(
            (item) => item.id !== parseInt(deleteId)
          );
          const updatedData = { ...data, projects: filteredProjects };

          return writePortfolioData(updatedData);
        })
        .then((success) => {
          if (success) {
            res
              .status(200)
              .json({ message: "Portfolio item deleted successfully" });
          } else {
            res.status(500).json({ message: "Error deleting portfolio item" });
          }
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Error deleting portfolio item", error });
        });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
