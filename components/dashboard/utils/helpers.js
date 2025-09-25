// Utility functions
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

export { getCircularReplacer, getPortfolioImageUrl };
