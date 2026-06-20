import os
import re

files = [
    r"c:\Users\user\OneDrive\Desktop\AI COURSE\ai-course-1\frontend\src\pages\MentorshipDashboard.jsx",
    r"c:\Users\user\OneDrive\Desktop\AI COURSE\ai-course-1\frontend\src\pages\ClientMentorship.jsx",
    r"c:\Users\user\OneDrive\Desktop\AI COURSE\ai-course-1\frontend\src\pages\Community.jsx"
]

def apply_kajabi_style(content):
    # Remove excessive typography
    content = re.sub(r'\bfont-black\b', 'font-semibold', content)
    content = re.sub(r'\bitalic\b', '', content)
    content = re.sub(r'\bitalic-\d+\b', '', content)
    content = re.sub(r'\btracking-tighter\b', 'tracking-tight', content)
    content = re.sub(r'\btracking-widest\b', 'tracking-normal', content)
    content = re.sub(r'\buppercase\b', '', content)
    
    # Soften borders and rounded corners to Kajabi style (usually md/lg/xl, not 2xl/3xl)
    content = re.sub(r'\brounded-2xl\b', 'rounded-xl', content)
    content = re.sub(r'\brounded-3xl\b', 'rounded-xl', content)
    content = re.sub(r'\brounded-\[2rem\]\b', 'rounded-xl', content)
    content = re.sub(r'\brounded-\[3rem\]\b', 'rounded-xl', content)
    
    # Fix spacing issues left by regex (double spaces)
    content = re.sub(r' {2,}', ' ', content)
    content = re.sub(r' className=" "', '', content)
    
    return content

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = apply_kajabi_style(content)
    
    # Specific file fixes
    if "Community.jsx" in file_path:
        # Remove background blobs
        new_content = re.sub(r'<div className="absolute[^>]+blur[^>]+></div>', '', new_content)
        # Fix the Hero section
        new_content = new_content.replace('bg-gray-900 text-white', 'bg-white text-gray-900 border-b border-gray-100')
        new_content = new_content.replace('text-blue-500', 'text-blue-600')
        new_content = new_content.replace('text-gray-400 leading-relaxed', 'text-gray-600 leading-relaxed')
        new_content = new_content.replace('from-blue-600 to-blue-800', 'from-gray-50 to-gray-100 border border-gray-200')
        new_content = new_content.replace('text-blue-100', 'text-gray-600')
        new_content = new_content.replace('bg-white text-gray-900 px-12 py-5', 'bg-blue-600 text-white px-8 py-4')
        new_content = new_content.replace('shadow-blue-900/20', 'shadow-blue-600/20')
        # Remove the weird extra white text
        new_content = new_content.replace('text-white shadow-2xl', 'text-gray-900 shadow-xl')
        
    if "MentorshipDashboard.jsx" in file_path or "ClientMentorship.jsx" in file_path:
        # Clean up card borders and badges
        new_content = new_content.replace('border-l-8 border-l-blue-600', '')
        new_content = new_content.replace('bg-gray-900', 'bg-gray-800')
        new_content = new_content.replace('decoration-blue-600 decoration-4 underline-offset-8', '')
        new_content = new_content.replace('text-[10px]', 'text-xs')
        new_content = new_content.replace('text-[11px]', 'text-xs')
        new_content = new_content.replace('text-[9px]', 'text-xs')
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {os.path.basename(file_path)}")
