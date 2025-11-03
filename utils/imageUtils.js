const getPortfolioImageUrl = (item) => {
  if (!item || !item.img) return null; // Handle null/undefined item or empty img

  if (item.localImage) {
    return `/img/${item.img}`;
  } else if (item.img.startsWith("/")) {
    // Assume it's a relative Cloudinary path
    return `https://res.cloudinary.com/uki14/image/upload${item.img}`;
  }
  return item.img; // Assume it's a full absolute URL
};

export { getPortfolioImageUrl };
