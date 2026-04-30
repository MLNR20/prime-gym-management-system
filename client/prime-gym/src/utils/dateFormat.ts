export default function formatIsoDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}