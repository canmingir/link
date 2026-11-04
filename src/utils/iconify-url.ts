export function getIconifyUrl(icon?: string, params = ""): string {
  const normalized = icon?.replace(/^:|:$/g, "").replace(":", "/");
  return `https://api.iconify.design/${normalized}.svg${params}`;
}
