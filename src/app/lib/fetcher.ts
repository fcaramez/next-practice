export const fetcher = async <T>(
  ...args: Parameters<typeof fetch>
): Promise<T> => {
  const res = await fetch(...args);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
