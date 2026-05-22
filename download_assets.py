import urllib.request
import urllib.parse
import os

base_url = "https://medichettilikith.github.io/"
target_dir = r"C:\Users\likit\.gemini\antigravity\scratch\portfoliodashboard"

files = [
    "Certificate.pdf",
    "offerletter.pdf",
    "pwcpbi.pdf",
    "cognizant agile.pdf",
    "Pythong8.pdf",
    "Cg8.pdf",
    "CCodechef.pdf",
    "chatgptg8.pdf",
    "seog8.pdf",
    "b10x ai.pdf",
    "Medichetti_Likith_certificate.pdf",
    "image.png",
    "76cf87553cdbfc24c36a4b926ecd4b58.pdf",
    "WhatsApp Image 2026-02-05 at 5.44.53 PM.jpeg"
]

os.makedirs(target_dir, exist_ok=True)

print("Starting asset downloads...")

for file_name in files:
    encoded_name = urllib.parse.quote(file_name)
    url = base_url + encoded_name
    dest_path = os.path.join(target_dir, file_name)
    print(f"Downloading {url}...")
    try:
        # Use a User-Agent header to avoid potential bot blocks
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Successfully saved to {dest_path}")
    except Exception as e:
        print(f"Error downloading {file_name}: {e}")

print("Asset downloads completed!")
