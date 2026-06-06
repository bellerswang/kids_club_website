import pypdf
import os
import sys

def extract_pdf_info(pdf_path, out_file):
    out_file.write(f"=== {pdf_path} ===\n")
    if not os.path.exists(pdf_path):
        out_file.write(f"Error: {pdf_path} does not exist!\n")
        return
    reader = pypdf.PdfReader(pdf_path)
    out_file.write(f"Number of pages: {len(reader.pages)}\n")
    
    # Metadata
    meta = reader.metadata
    if meta:
        out_file.write("Metadata:\n")
        for key, val in meta.items():
            out_file.write(f"  {key}: {val}\n")
    
    # Text content
    for idx, page in enumerate(reader.pages):
        out_file.write(f"\n--- Page {idx + 1} Text ---\n")
        text = page.extract_text()
        out_file.write(text + "\n")
        
        # Check images
        images = page.images
        out_file.write(f"Number of images on page {idx + 1}: {len(images)}\n")
        for img_idx, img in enumerate(images):
            out_file.write(f"  Image {img_idx + 1}: name={img.name}, size={len(img.data)} bytes\n")

if __name__ == "__main__":
    with open("scratch/extracted_text.txt", "w", encoding="utf-8") as out:
        extract_pdf_info("sample/Badminton.pdf", out)
        out.write("\n" + "="*50 + "\n\n")
        extract_pdf_info("sample/Holiday Camp.pdf", out)
    print("Done! Extracted text written to scratch/extracted_text.txt")
