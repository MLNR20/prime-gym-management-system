interface RequestStructure<T = any> {
  headerData?: T[];
}

export default function retrieveHeaderData({ headerData }: RequestStructure) {
  if (!Array.isArray(headerData)) return [];

  const uniqueKeys = new Set<string>();

  for (const item of headerData) {
    if (!item || typeof item !== "object") continue;

    Object.keys(item).forEach((key) => {
      uniqueKeys.add(key);
    });
  }

  return Array.from(uniqueKeys);
}