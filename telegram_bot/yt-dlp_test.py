from yt_dlp import YoutubeDL
import os
# ----------- CONFIGURATION -----------
fathom_url = "https://fathom.video/share/SEsgeh2gUZjktyiMi1N6a5a7VU3YE5WC"  # <-- replace this
output_dir = "/Users/chowchow/Programming/PN Codes/fathom_downloads"
os.makedirs(output_dir, exist_ok=True)

# ----------- STEP 1: Download the video -----------
def download_video(url, output_dir):
    ydl_opts = {
        'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
        'format': 'mp4/best',
        'quiet': False,
    }
    with YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(result)
        # Replace extension if necessary
        if not filename.endswith('.mp4'):
            filename = filename.rsplit('.', 1)[0] + '.mp4'
        return filename

print("Downloading video...")
video_path = download_video(fathom_url, output_dir)
print(f"Video downloaded: {video_path}")