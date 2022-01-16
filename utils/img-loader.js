export const imgLoader = ({ src, width, quality }) => {
  return `http://uki.thedev.id${src}?w=${width}&q=${quality || 75}`;
};

export const externalImgLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};
