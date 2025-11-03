import { Search } from "lucide-react";
import { BaseInput } from "../v2/BaseInput";
import { IconButton } from "../v2/IconButton";

/**
 * Reusable form component for downloader pages
 * @param {object} props
 * @param {string} props.url - Current URL value
 * @param {function} props.setUrl - URL setter function
 * @param {boolean} props.loading - Loading state
 * @param {function} props.onSubmit - Form submit handler
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.className - Additional CSS classes
 */
const DownloaderForm = ({
  url,
  setUrl,
  loading,
  onSubmit,
  placeholder = "Enter URL...",
  className = "",
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      <div className="mx-auto flex max-w-md items-center space-x-4">
        <BaseInput
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          required
        />
        <IconButton type="submit" loading={loading}>
          <Search className="h-5 w-5 text-gray-600" />
        </IconButton>
      </div>
    </form>
  );
};

export default DownloaderForm;
