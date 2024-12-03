#!/usr/bin/env python3
import os
import shutil

# Define the source and target directories
source_dir = 'src/days/day04'
base_dir = 'src/days'

# Create folders for days 5 to 25
for day in range(5, 26):
    new_dir = os.path.join(base_dir, f'day{day:02}')
    shutil.copytree(source_dir, new_dir)

    # Update day number in files
    for root, dirs, files in os.walk(new_dir):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, 'r') as f:
                content = f.read()
            # Replace occurrences of '