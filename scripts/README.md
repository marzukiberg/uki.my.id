# TikTok Downloader Scripts

This directory contains Python scripts for downloading TikTok videos.

## Setup

1. **Virtual Environment**: A Python virtual environment is already created in `scripts/venv/`
2. **Dependencies**: The `tiktok-downloader` library is installed (currently using mock implementation for testing)

## Usage

### Activate Virtual Environment

```bash
cd scripts
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### Run the Downloader Script

```bash
python download_tiktok.py "https://www.tiktok.com/@username/video/1234567890" [output_filename]
```

Example:
```bash
python download_tiktok.py "https://www.tiktok.com/@user/video/1234567890" my_video.mp4
```

## API Integration

The script is designed to work with the Next.js API route at `/api/tiktok-download`. The API:

1. Accepts POST requests with a `url` field
2. Executes this Python script with the provided URL
3. Returns download status and file URL

## Current Implementation

- **Working Download**: Uses `yt-dlp` for reliable TikTok video downloading
- **File Storage**: Downloads are saved to `public/downloads/` directory
- **Web Access**: Downloaded files are accessible at `/downloads/filename.mp4`
- **Format**: Downloads best available quality video

## Testing

Test with this URL:
```
https://www.tiktok.com/@ukay.js/video/7567039685730503943
```

## Future Improvements

- Add video thumbnail preview before download
- Support for different video qualities
- Batch download functionality
- Video metadata extraction

## Requirements

- Python 3.6+
- Virtual environment with tiktok-downloader installed

## Notes

- Make sure to activate the virtual environment before running the script
- Downloaded videos will be saved in the `public/downloads/` directory
- Files are accessible via web at `/downloads/filename.mp4`
- Check TikTok's terms of service before downloading content