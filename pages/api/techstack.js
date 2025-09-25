import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { action, data } = req.body;

    if (!action || !data) {
      return res.status(400).json({ message: "Missing action or data" });
    }

    const techstackPath = path.join(process.cwd(), "data", "techstack.json");

    // Read current techstack data
    let techstackData = [];
    if (fs.existsSync(techstackPath)) {
      const fileContent = fs.readFileSync(techstackPath, "utf8");
      techstackData = JSON.parse(fileContent);
    }

    let result = { success: true };

    switch (action) {
      case "add":
        // Add new tech stack item
        const newItem = {
          img: data.logo || "",
          text: data.name,
        };
        techstackData.push(newItem);
        result.message = "Tech stack item added successfully";
        result.data = newItem;
        break;

      case "update":
        // Update existing tech stack item
        const updateIndex = techstackData.findIndex(
          (item) => item.text === data.oldName
        );
        if (updateIndex !== -1) {
          techstackData[updateIndex] = {
            img: data.logo || techstackData[updateIndex].img,
            text: data.name,
          };
          result.message = "Tech stack item updated successfully";
          result.data = techstackData[updateIndex];
        } else {
          return res.status(404).json({ message: "Tech stack item not found" });
        }
        break;

      case "delete":
        // Delete tech stack item
        const deleteIndex = techstackData.findIndex(
          (item) => item.text === data.name
        );
        if (deleteIndex !== -1) {
          const deletedItem = techstackData.splice(deleteIndex, 1)[0];
          result.message = "Tech stack item deleted successfully";
          result.data = deletedItem;
        } else {
          return res.status(404).json({ message: "Tech stack item not found" });
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    // Write updated data back to file
    fs.writeFileSync(techstackPath, JSON.stringify(techstackData, null, 2));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error saving techstack:", error);
    res.status(500).json({
      success: false,
      message: "Error saving techstack data",
      error: error.message,
    });
  }
}
