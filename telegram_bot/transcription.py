import whisper
import fpdf

model = whisper.load_model("medium")

result = model.transcribe("/Users/chowchow/Programming/PN Codes/fathom_downloads/Junaidah & James - Nutrition Clarity Call.mp4", 
                          language = 'en', 
                          task = 'transcribe')
transcript = result['text']
print(transcript)

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

pdf = PDF()
pdf.add_text(transcript)
output_path = "/Users/chowchow/Programming/PN Codes/Junaidah_transcript.pdf"
pdf.output(output_path)