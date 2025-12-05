import os
import shutil
import random

# --- SETTINGS ---
source_folder = r"dataset/4"        # e.g. "C:\\Users\\You\\Pictures\\Source"
destination_folder = r"model/4"  # e.g. "C:\\Users\\You\\Pictures\\Destination"
transfer_count = 300                            # Number of images to move

# --- MAIN SCRIPT ---
# Create destination folder if it doesn't exist
os.makedirs(destination_folder, exist_ok=True)

# Get all image files from the source folder
image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff')
image_files = [f for f in os.listdir(source_folder) if f.lower().endswith(image_extensions)]

# Randomly select up to 300 images
images_to_move = random.sample(image_files, min(transfer_count, len(image_files)))

# Move each image
for i, filename in enumerate(images_to_move, 1):
    src = os.path.join(source_folder, filename)
    dst = os.path.join(destination_folder, filename)
    shutil.move(src, dst)
    print(f"{i}/{len(images_to_move)} - Moved: {filename}")

print(f"\n✅ Successfully moved {len(images_to_move)} images to '{destination_folder}'.")
