export const getContentParts = (n) => {
  const entries = Object.entries(n).filter(
    ([key]) =>
      key !== "children" && key !== "id" && key !== "previous" && key !== "next"
  );

  if (entries.length === 0) {
    return {
      title: "(empty)",
      subtitle: null,
      metaEntries: [],
    };
  }

  const preferredTitleKeys = ["label", "title", "name"];
  const titleEntry =
    entries.find(([key]) => preferredTitleKeys.includes(key)) || entries[0];
  const [titleKey, rawTitle] = titleEntry;
  const title = String(rawTitle);
  let remaining = entries.filter(([key]) => key !== titleKey);

  const preferredSubtitleKeys = ["description", "role", "type", "status"];
  const subtitleEntry =
    remaining.find(([key]) => preferredSubtitleKeys.includes(key)) || null;

  let subtitle = null;
  if (subtitleEntry) {
    const [subtitleKey, raw] = subtitleEntry;
    subtitle = String(raw);
    remaining = remaining.filter(([key]) => key !== subtitleKey);
  }

  const metaEntries = remaining
    .filter(([, value]) => {
      const t = typeof value;
      return (
        (t === "string" || t === "number" || t === "boolean") &&
        value !== "" &&
        value !== null
      );
    })
    .map(([k, v]) => [k, v]);

  return { title, subtitle, metaEntries };
};
