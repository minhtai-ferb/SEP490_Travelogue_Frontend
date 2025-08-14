export const normalizeText = (s?: string | null) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

export const matchKeyword = (keyword: string, ...targets: Array<string | null | undefined>) => {
  const q = normalizeText(keyword);
  if (!q) return true;
  return targets.some(t => normalizeText(t).includes(q));
};
