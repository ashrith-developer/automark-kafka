import zipfile
import xml.etree.ElementTree as ET
import re
import os

def extract_pptx_text(pptx_path):
    if not os.path.exists(pptx_path):
        print(f"File not found: {pptx_path}")
        return
    
    # Namespaces
    ns = {
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
    }
    
    try:
        with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
            # List all slide files
            namelist = zip_ref.namelist()
            slide_files = sorted(
                [f for f in namelist if re.match(r'ppt/slides/slide\d+\.xml', f)],
                key=lambda x: int(re.findall(r'\d+', x)[0])
            )
            
            print(f"Found {len(slide_files)} slides in the presentation template.\n")
            
            for slide_file in slide_files:
                slide_num = re.findall(r'\d+', slide_file)[0]
                print(f"--- Slide {slide_num} ---")
                
                slide_xml = zip_ref.read(slide_file)
                root = ET.fromstring(slide_xml)
                
                # Find all text body elements
                tx_bodies = root.findall('.//p:txBody', ns)
                for tx_body in tx_bodies:
                    paragraphs = tx_body.findall('.//a:p', ns)
                    for p in paragraphs:
                        text_runs = p.findall('.//a:t', ns)
                        text = "".join([t.text for t in text_runs if t.text])
                        if text.strip():
                            print(f"  {text.strip()}")
                print()
    except Exception as e:
        print(f"Error parsing PPTX: {e}")

if __name__ == "__main__":
    extract_pptx_text("PPT Template-final.pptx 1.pptx")
