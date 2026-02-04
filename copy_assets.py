import shutil
import os

src_logo = r"C:\Users\M I Co\.gemini\antigravity\brain\66ef082a-8e70-49ee-af00-d6c75b136dc2\athar_logo_circular_lightbulb_1770201460103.png"
src_splash = r"C:\Users\M I Co\.gemini\antigravity\brain\66ef082a-8e70-49ee-af00-d6c75b136dc2\athar_splash_screen_logo_1770201474757.png"

dst_dir = r"c:\Users\M I Co\Desktop\athar\ather-Appacella\assets\images"

try:
    shutil.copy(src_logo, os.path.join(dst_dir, "icon.png"))
    shutil.copy(src_splash, os.path.join(dst_dir, "splash-icon.png"))
    shutil.copy(src_logo, os.path.join(dst_dir, "adaptive-icon.png"))
    print("Successfully copied files.")
except Exception as e:
    print(f"Error: {e}")
