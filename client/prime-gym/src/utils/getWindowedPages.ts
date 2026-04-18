export default function getWindowedPages(
  currentPage: number,
  totalPages: number
) {
  if (!Number.isFinite(totalPages) || totalPages < 1) return [1];

  const pages: number[] = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}