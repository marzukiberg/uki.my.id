export const imgLoader = ({ src, width, quality }) => {
  return `http://localhost:3000${src}?w=${width}&q=${quality || 75}`;
};

export const externalImgLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};
