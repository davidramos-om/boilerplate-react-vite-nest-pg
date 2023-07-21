
const slug = require("limax")

export const Slugify = (text: string): string => {
  if (!text)
    return "";
  const transform = slug(text, { lang: "en", separateNumbers: true, maintainCase: false, });
  return transform;
}
