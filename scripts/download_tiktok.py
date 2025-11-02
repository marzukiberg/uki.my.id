#!/usr/bin/env python3
"""
TikTok Downloader Script using yt-dlp - Streams video directly to stdout
Proxy support: DISABLED (commented out)
"""

import sys
import os
import subprocess
import json
import re
# import random

# def load_proxies():
#     """
#     Load proxy list from proxies.txt file

#     Returns:
#         list: List of proxy URLs
#     """
#     proxy_file = os.path.join(os.path.dirname(__file__), 'proxies.txt')
#     proxies = []

#     try:
#         with open(proxy_file, 'r') as f:
#             for line in f:
#                 line = line.strip()
#                 if line and not line.startswith('#'):
#                     proxies.append(line)
#     except FileNotFoundError:
#         print("Warning: proxies.txt not found, continuing without proxy", file=sys.stderr)
#     except Exception as e:
#         print(f"Warning: Error loading proxies: {e}, continuing without proxy", file=sys.stderr)

#     return proxies

def get_video_info(url):
    """
    Get video/photo information including formats and sizes

    Args:
        url (str): TikTok video/photo URL

    Returns:
        dict: Video/photo information with formats and sizes
    """
    try:
        # Try dump-json on the original URL first
        cmd = [
            'yt-dlp',
            '--no-warnings',
            '--dump-json',
            '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            '--add-header', 'Referer: https://www.tiktok.com/',
            url
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            return json.loads(result.stdout)

        # If dump-json failed and this is a /photo/ URL, try converting to a /video/ URL as a fallback
        if '/photo/' in url:
            try_url = url.replace('/photo/', '/video/')
            print(f"Primary dump-json failed for photo URL, trying converted URL: {try_url}", file=sys.stderr)
            cmd2 = cmd[:-1] + [try_url]
            result2 = subprocess.run(cmd2, capture_output=True, text=True)
            if result2.returncode == 0:
                return json.loads(result2.stdout)

        # If we reach here, both attempts failed
        print(f"Failed to get media info: {result.stderr}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error getting media info: {e}", file=sys.stderr)
        return None

def format_file_size(bytes_size):
    """
    Format file size in human readable format

    Args:
        bytes_size (int): Size in bytes

    Returns:
        str: Formatted size string
    """
    if bytes_size == 0:
        return "0 B"

    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while bytes_size >= 1024 and i < len(size_names) - 1:
        bytes_size /= 1024.0
        i += 1
    # Return with up to 2 decimal places
    return f"{bytes_size:.2f} {size_names[i]}"

def stream_tiktok_video(url, quality="best"):
    """
    Stream TikTok video/photo using yt-dlp directly to stdout

    Args:
        url (str): TikTok video/photo URL
        quality (str): Quality option ('best' or 'worst')
    """
    # max_retries = 2  # DISABLED

    try:
        print(f"Streaming TikTok media from: {url} (quality: {quality})", file=sys.stderr)

        # Load and select random proxy - DISABLED
        # proxies = load_proxies()
        # proxy_arg = []
        # use_proxy = len(proxies) > 0 and retry_count < max_retries

        # if use_proxy:
        #     selected_proxy = random.choice(proxies)
        #     proxy_arg = ['--proxy', selected_proxy]
        #     print(f"Using proxy: {selected_proxy}", file=sys.stderr)
        # else:
        #     if retry_count >= max_retries:
        #         print("Max retries reached, trying without proxy", file=sys.stderr)
        #     else:
        #         print("No proxies available, downloading without proxy", file=sys.stderr)

        # Use yt-dlp to download the media and output to stdout
        # If the URL is a photo, adjust behavior to fetch the direct image instead of relying solely on yt-dlp
        is_photo = '/photo/' in url

        if is_photo:
            # For photos, attempt to find the direct image URL and stream it with curl
            try:
                image_url = None
                print("Fetching photo page HTML...", file=sys.stderr)
                # Try to extract image URL from the page
                page = subprocess.run(['curl', '-L', '-s', url], capture_output=True, text=True)
                html = page.stdout or ''
                
                # Try og:image
                m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
                if m:
                    image_url = m.group(1)
                    print(f"Found image URL from og:image: {image_url}", file=sys.stderr)
                
                # If not found, try Next.js __NEXT_DATA__ JSON
                if not image_url:
                    m2 = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.S)
                    if m2:
                        try:
                            nd = json.loads(m2.group(1))
                            # search recursively for image URLs in JSON
                            def find_image(obj):
                                if isinstance(obj, dict):
                                    for k, v in obj.items():
                                        if isinstance(v, str) and v.startswith('http') and ('.jpg' in v or '.png' in v or '.webp' in v or '.jpeg' in v):
                                            return v
                                        res = find_image(v)
                                        if res:
                                            return res
                                elif isinstance(obj, list):
                                    for it in obj:
                                        res = find_image(it)
                                        if res:
                                            return res
                                return None
                            image_url = find_image(nd)
                            if image_url:
                                print(f"Found image URL from __NEXT_DATA__: {image_url}", file=sys.stderr)
                        except Exception as e:
                            print(f"Error parsing __NEXT_DATA__: {e}", file=sys.stderr)
                            image_url = None

                if image_url:
                    print(f"Streaming photo from: {image_url}", file=sys.stderr)
                    # Stream image bytes to stdout
                    curl_proc = subprocess.run(['curl', '-L', '-s', image_url], stdout=sys.stdout.buffer)
                    if curl_proc.returncode == 0:
                        print("Photo streamed successfully", file=sys.stderr)
                        return True
                    else:
                        print(f"Failed to stream photo, curl returned: {curl_proc.returncode}", file=sys.stderr)
                        return False
                else:
                    print("Could not find image URL in page HTML", file=sys.stderr)
                    return False
            except Exception as e:
                print(f"Error streaming photo: {e}", file=sys.stderr)
                return False
        
        # For videos, use yt-dlp
        cmd = [
            'yt-dlp',
            '--no-warnings',
            '--no-progress',
            '--format', quality,  # Use specified quality
            '--output', '-',  # Output to stdout
            '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            '--add-header', 'Referer: https://www.tiktok.com/',
            '--add-header', 'Sec-Fetch-Dest: video',
            '--add-header', 'Sec-Fetch-Mode: no-cors',
            '--add-header', 'Sec-Fetch-Site: cross-site',
        ] + [url]

        print("Starting stream with yt-dlp...", file=sys.stderr)
        result = subprocess.run(cmd, stdout=sys.stdout, stderr=sys.stderr)

        if result.returncode == 0:
            print("Video streamed successfully", file=sys.stderr)
            return True
        else:
            print(f"yt-dlp failed with return code: {result.returncode}", file=sys.stderr)

            # Retry logic - DISABLED
            # if use_proxy and retry_count < max_retries:
            #     print(f"Retrying with different proxy (attempt {retry_count + 1}/{max_retries})", file=sys.stderr)
            #     return stream_tiktok_video(url, quality, retry_count + 1)
            # elif use_proxy and retry_count >= max_retries:
            #     # Try without proxy as last resort
            #     print("All proxy attempts failed, trying without proxy", file=sys.stderr)
            #     return stream_tiktok_video(url, quality, max_retries + 1)
            # else:
            #     return False

            return False

    except Exception as e:
        print(f"Error streaming video: {e}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 3:
        print("Usage: python download_tiktok.py <tiktok_url> <quality>", file=sys.stderr)
        print("Quality options: best, worst, info", file=sys.stderr)
        print("Example: python download_tiktok.py https://www.tiktok.com/@user/video/1234567890 best", file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]
    quality = sys.argv[2]

    # Check if original URL was a photo
    is_original_photo = '/photo/' in url

    if quality == 'info':
        # Get video/photo information and return as JSON
        print(f"Getting media info for: {url}", file=sys.stderr)
        media_info = get_video_info(url)

        if media_info:
            # Check if it's a photo (original /photo/ URLs are treated as photos)
            is_photo = is_original_photo or media_info.get('duration', 0) == 0

            print(f"is_original_photo: {is_original_photo}, duration: {media_info.get('duration', 0)}, is_photo: {is_photo}", file=sys.stderr)

            # Extract relevant information
            info = {
                'title': media_info.get('title', 'TikTok Media'),
                'author': media_info.get('uploader', 'Unknown'),
                'duration': media_info.get('duration'),
                'view_count': media_info.get('view_count'),
                'like_count': media_info.get('like_count'),
                'is_photo': is_photo
            }

            if is_photo:
                # For photos, try to get the best available image format
                formats = media_info.get('formats', [])
                print(f"Photo formats: {len(formats)}", file=sys.stderr)
                for i, fmt in enumerate(formats):
                    print(f"Photo format {i}: ext={fmt.get('ext')}, size={fmt.get('filesize')}, id={fmt.get('format_id')}", file=sys.stderr)

                best_format = None

                for fmt in formats:
                    if fmt.get('ext') in ['jpg', 'jpeg', 'png', 'webp', 'heic']:
                        if not best_format or (fmt.get('filesize') or 0) > (best_format.get('filesize') or 0):
                            best_format = fmt

                # If we have a best image format, set its size
                if best_format and (best_format.get('filesize') or best_format.get('filesize_approx')):
                    size_val = best_format.get('filesize') or best_format.get('filesize_approx')
                    info['best_size'] = size_val
                    info['worst_size'] = size_val

                print("Photo info retrieved successfully", file=sys.stderr)
            else:
                # For videos, extract file sizes
                formats = media_info.get('formats', [])
                print(f"Available formats: {len(formats)}", file=sys.stderr)
                for i, fmt in enumerate(formats[:5]):  # Show first 5 formats
                    print(f"Format {i}: id={fmt.get('format_id')}, ext={fmt.get('ext')}, size={fmt.get('filesize')}, note={fmt.get('format_note')}", file=sys.stderr)

                # Find best and worst formats by filesize (or filesize_approx)
                video_formats = []
                audio_formats = []

                # Check if there's a filesize_approx at the top level
                top_level_size = media_info.get('filesize_approx')
                if top_level_size:
                    info['best_size'] = top_level_size
                    info['worst_size'] = top_level_size
                else:
                    for fmt in formats:
                        # Accept formats with actual filesize or approximation
                        size = fmt.get('filesize') or fmt.get('filesize_approx')
                        if size:
                            if fmt.get('vcodec') and fmt.get('vcodec') != 'none':
                                # Video format
                                video_formats.append(fmt)
                            else:
                                # Audio format or unknown
                                audio_formats.append(fmt)

                    # Prefer video formats, but fall back to audio if no video available
                    target_formats = video_formats if video_formats else audio_formats

                    if target_formats:
                        best_format = max(target_formats, key=lambda x: x.get('filesize') or x.get('filesize_approx') or 0)
                        worst_format = min(target_formats, key=lambda x: x.get('filesize') or x.get('filesize_approx') or 0)

                        # Get size information
                        best_size = best_format.get('filesize') or best_format.get('filesize_approx')
                        worst_size = worst_format.get('filesize') or worst_format.get('filesize_approx')

                        if best_size:
                            info['best_size'] = best_size
                        if worst_size:
                            info['worst_size'] = worst_size

                print("Video info retrieved successfully", file=sys.stderr)

            # Output JSON to stdout
            print(json.dumps(info))
            sys.exit(0)
        else:
            print("Failed to get media info", file=sys.stderr)
            sys.exit(1)
    else:
        # Stream the video/photo
        success = stream_tiktok_video(url, quality)
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()