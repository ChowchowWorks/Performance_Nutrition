from yt_dlp import YoutubeDL
import whisper
import fpdf
import os
from helper import handle_new_file

class PDF(fpdf.FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        self.add_page()
        self.set_font("Arial", size=12)
    
    def add_text(self, text):
        lines = text.split('\n')
        for line in lines: 
            self.multi_cell(0, 10, line)

def url_checker(url: str) -> bool:
    if url.lower().endswith('.mp4'):
        print("---Is a .mp4 file---")
        return True
    else:
        print("---Not a .mp4 file---")
        return False

def download_video(url: str, output_dir: str = "/Users/chowchow/Programming/PN Codes/fathom_downloads") -> str:
    os.makedirs(output_dir, exist_ok=True)
    ydl_opts = {
        'format': 'mp4/best',
        'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
        'quiet': False,
    }
    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            file_path = ydl.prepare_filename(info)
        return file_path
    except Exception as e:
        print("---Error downloading video--- \n Reason:", e)
        return None

def transcribe_video(file_path: str, language: str = 'en') -> str:
    filename = os.path.basename(file_path)
    filename_without_ext = os.path.splitext(filename)[0]
    model = whisper.load_model('medium')
    try:
        result = model.transcribe(file_path, language=language, task='transcribe')
        return result['text'], filename_without_ext
    except Exception as e:
        print("---Error transcribing video--- \n Reason:", e)
        return None
def save_transcript_to_pdf(transcript: str, filename: str ,output_dir: str = "/Users/chowchow/Programming/PN Codes/transcripts") -> str:
    os.makedirs(output_dir, exist_ok=True)
    pdf = PDF()
    pdf.add_text(transcript)
    output_path = os.path.join(output_dir, filename + '.pdf')
    pdf.output(output_path)
    return output_path
    
def receive_video_link( video_link: str) -> str:
    if not url_checker(video_link):
        print("---Downloading Video---")
        video_path = download_video(video_link)
        if video_path == None:
            raise Exception("Failed to download video.")
    else: video_path = video_link
    print("---Transcribing Video---")
    transcript, filename = transcribe_video(video_path)
    if transcript is None:
        raise Exception("Failed to transcribe video.")
    print("---Saving Transcript to PDF---")
    pdf_path = save_transcript_to_pdf(transcript, filename)
    print("---Handling New PDF File---")
    uploaded, rejected = handle_new_file(pdf_path)
    print(f"---Uploaded {len(uploaded)} files, Rejected files: {rejected}---")
    return

def receive_video_path( video_path: str) -> str:
    print("---Transcribing Video---")
    transcript, filename = transcribe_video(video_path)
    if transcript is None:
        raise Exception("Failed to transcribe video.")
    print("---Saving Transcript to PDF---")
    pdf_path = save_transcript_to_pdf(transcript, filename)
    print("---Handling New PDF File---")
    uploaded, rejected = handle_new_file(pdf_path)
    print(f"---Uploaded {len(uploaded)} files, Rejected files: {rejected}---")
    return

receive_video_path("/Users/chowchow/Programming/PN Codes/Discovery Call/Confirmed Modern Day Solutions (Discovery Call) with Yeo Yi Quan - Jun 25 2025.mp4")
receive_video_path("/Users/chowchow/Programming/PN Codes/Discovery Call/Confirmed Modern Day Solutions (Discovery Call) with Yeo Yi Quan - May 14 2025.mp4")
receive_video_path("/Users/chowchow/Programming/PN Codes/Discovery Call/James Paton - Nutrition Discovery Call - Jul 4 2025.mp4")