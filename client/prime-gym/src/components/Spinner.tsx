type SpinnerProps = {
  size?: number;
  className?: string;
};

export default function Spinner({
  size = 20,
  className = "",
}: SpinnerProps): React.ReactElement {
  return (
    <span
      className={`inline-block animate-spin rounded-full ${
        className || "border-2 border-gray-300 border-t-primary"
      }`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
