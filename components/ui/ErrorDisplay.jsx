/**
 * Reusable error display component for downloader pages
 * @param {object} props
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 */
const ErrorDisplay = ({ error, className = "" }) => {
  if (!error) return null;

  return (
    <div
      className={`mx-auto mt-6 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 ${className}`}
    >
      <p className="text-sm text-red-800">{error}</p>
    </div>
  );
};

export default ErrorDisplay;
