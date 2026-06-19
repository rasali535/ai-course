try:
    import google.generativeai as genai
except ImportError:
    genai = None

import os
import json
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ai", tags=["ai"])
logger = logging.getLogger(__name__)

# Configure Gemini if available
api_key = os.getenv("GEMINI_API_KEY")
if genai and api_key:
    genai.configure(api_key=api_key)

class GenerateCourseRequest(BaseModel):
    topic: str
    target_audience: Optional[str] = "Beginners"

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class ModuleContent(BaseModel):
    type: str  # text, video, quiz, file
    title: str # Short lesson title
    text: str  # Long educational content or description
    icon: str

class Module(BaseModel):
    title: str
    content: List[ModuleContent]
    quiz: Optional[List[QuizQuestion]] = []

class CourseStructure(BaseModel):
    title: str
    description: str
    modules: List[Module]
    final_exam: Optional[List[QuizQuestion]] = []

def get_suggested_image(topic: str) -> str:
    topic_lower = topic.lower()
    
    # Curated high-quality educational cover images from Unsplash
    mappings = {
        ("python", "django", "flask"): "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", # Python code on screen
        ("javascript", "react", "node", "html", "css", "web", "frontend", "backend"): "https://images.unsplash.com/photo-1547082299-de196ea013d6", # Web development
        ("code", "programming", "developer", "software", "git"): "https://images.unsplash.com/photo-1555066931-4365d14bab8c", # IDE screen
        ("ai", "artificial", "intelligence", "machine", "neural", "deep learning", "robot"): "https://images.unsplash.com/photo-1677442136019-21780ecad995", # AI art abstract
        ("data", "sql", "excel", "analysis", "pandas", "numpy"): "https://images.unsplash.com/photo-1551288049-bebda4e38f71", # Data chart
        ("cyber", "security", "hack", "network"): "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", # Cybersecurity microchip
        ("cloud", "aws", "azure", "docker", "kubernetes"): "https://images.unsplash.com/photo-1544197150-b99a580bb7a8", # Server room
        ("design", "ui", "ux", "figma", "graphic", "art", "creative"): "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8", # Designer desk
        ("finance", "crypto", "bitcoin", "money", "stock", "trade", "business", "market"): "https://images.unsplash.com/photo-1559526324-4b87b5e36e44", # Financial charts
        ("music", "song", "audio", "sound", "guitar", "piano"): "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4", # Studio microphone
        ("photo", "camera", "video", "film", "editor"): "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", # Camera lens
        ("science", "physics", "chemistry", "biology", "math", "space", "astronomy"): "https://images.unsplash.com/photo-1507668077129-56e32842fceb", # Abstract space/science
        ("health", "fitness", "yoga", "diet", "doctor", "medical"): "https://images.unsplash.com/photo-1506126613408-eca07ce68773", # Yoga / wellness
        ("cook", "recipe", "food", "chef", "bake"): "https://images.unsplash.com/photo-1556910103-1c02745aae4d", # Cooking kitchen
    }
    
    for keywords, url in mappings.items():
        if any(keyword in topic_lower for keyword in keywords):
            return url
            
    # Default high-quality abstract image
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"


@router.post("/generate-course")
async def generate_course(request: GenerateCourseRequest):
    """
    Generate a full course structure using Google Gemini.
    """
    if not genai:
         raise HTTPException(status_code=500, detail="Gemini AI Library not installed on server (ImportError)")

    # Reload key from env just in case it was set after startup
    current_api_key = os.getenv("GEMINI_API_KEY")
    if not current_api_key:
         # Fallback to the module level one if env var is missing or not reloaded
         current_api_key = api_key
    
    if not current_api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    genai.configure(api_key=current_api_key)

    try:
        # Try to find the best available model in 2026 environment
        # We try 2.0-flash first as it's the stable high-performance choice
        model_name = 'gemini-2.0-flash'
        model = None
        
        # List of models to try in order of preference (including 2026 stable names)
        models_to_try = [
            'gemini-2.5-flash',
            'gemini-flash-latest',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-pro'
        ]
        
        for name in models_to_try:
            try:
                model = genai.GenerativeModel(name)
                # Test validity by calling a very simple property or just logging
                model_name = name
                logger.info(f"Successfully initialized model: {model_name}")
                break
            except Exception as e:
                logger.warning(f"Model {name} not available: {e}")
                continue
        
        if not model:
            raise HTTPException(status_code=500, detail="No suitable Gemini model found. Check API key permissions.")
        
        prompt = f"""
        Act as an expert educational curriculum designer and subject matter expert.
        Create a comprehensive, deeply educational course for the topic: "{request.topic}".
        Target Audience: {request.target_audience}.
        
        The output MUST be valid, parseable JSON with the following structure:
        {{
            "title": "A Professional and Engaging Course Title",
            "description": "A compelling 2-3 sentence overview that explains what the student will achieve.",
            "modules": [
                {{
                    "title": "Module 1: Clear and Descriptive Title",
                    "content": [
                        {{ 
                            "type": "text", 
                            "title": "Short Lesson Title",
                            "text": "Detailed educational lesson content (2-3 paragraphs)...", 
                            "icon": "📄" 
                        }},
                        {{ 
                            "type": "video", 
                            "title": "Video Lecture Title",
                            "text": "Brief description of what this video covers.", 
                            "icon": "📽️" 
                        }}
                    ],
                    "quiz": [
                        {{
                            "question": "What is...?",
                            "options": ["Option A", "Option B", "Option C", "Option D"],
                            "correct_answer": "Option A"
                        }}
                    ]
                }}
            ],
            "final_exam": [
                {{
                    "question": "Comprehensive course question...?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "Option B"
                }}
            ]
        }}
        
        CRITICAL REQUIREMENTS:
        1. Create exactly 4-6 high-quality modules.
        2. Each module MUST have 3-5 content items (including at least one 'video' type content where the 'text' field is a full, detailed, multi-paragraph educational lecture script to be read out loud, and 2-3 'text' type items) AND a quiz with 2-3 questions.
        3. For all content items (both 'text' and 'video' types), provide actual comprehensive educational content/scripts in the 'text' field.
        4. Include a "final_exam" with 5-10 questions covering all modules.
        5. Ensure the JSON is valid and does not contain any Markdown code blocks or extra text.
        """
        
        # Retry logic with exponential backoff
        max_retries = 3
        import asyncio
        response = None
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                break # Success, exit loop
            except Exception as e:
                if "429" in str(e) or "Too Many Requests" in str(e):
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt
                        logger.warning(f"Rate limit hit. Retrying in {wait_time}s...")
                        await asyncio.sleep(wait_time)
                    else:
                        raise HTTPException(status_code=429, detail="System busy (Rate Limit). Please try again later.")
                else:
                    raise e # Re-raise if it's not a rate limit error
        
        if not response:
             raise HTTPException(status_code=500, detail="Failed to get valid response from AI after retries")

        # Robust JSON extraction using regex
        text_response = response.text.strip()
        import re
        
        # Find everything between the first { and the last }
        json_match = re.search(r'(\{.*\})', text_response, re.DOTALL)
        if json_match:
            try:
                course_data = json.loads(json_match.group(1))
            except json.JSONDecodeError:
                # Fallback to original strip logic if regex-extracted JSON is also bad
                course_data = json.loads(text_response)
        else:
            # Try to load raw text if no braces found (unlikely for valid JSON)
            course_data = json.loads(text_response)
        
        if not isinstance(course_data, dict):
            # If the AI returned a list or just a string, wrap it
            course_data = {"title": request.topic, "modules": course_data if isinstance(course_data, list) else []}

        # Add IDs and validate structure
        import time
        base_id = int(time.time())
        
        # Ensure 'modules' exists and is a list
        if 'modules' not in course_data or not isinstance(course_data['modules'], list):
            # Try to find modules if it was nested or named differently
            for key in ['Modules', 'course_modules', 'lessons', 'sections']:
                if key in course_data and isinstance(course_data[key], list):
                    course_data['modules'] = course_data.pop(key)
                    break
            else:
                course_data['modules'] = []

        final_modules = []
        for m_idx, module in enumerate(course_data.get('modules', [])):
            if not isinstance(module, dict): continue
            
            clean_module = {
                "id": f"mod-{base_id}-{m_idx}",
                "title": module.get("title", f"Module {m_idx + 1}"),
                "content": [],
                "quiz": module.get("quiz", [])
            }
            
            # Map content items
            for item in module.get("content", []):
                if not isinstance(item, dict): continue
                clean_module["content"].append({
                    "type": item.get("type", "text"),
                    "title": item.get("title", item.get("text", "New Lesson")[:50]),
                    "text": item.get("text", "Lesson Content"),
                    "icon": item.get("icon", "📄")
                })
            
            if clean_module["title"]:
                final_modules.append(clean_module)
            
        return {
            "title": course_data.get("title", request.topic),
            "description": course_data.get("description", f"Course about {request.topic}"),
            "image": get_suggested_image(course_data.get("title", request.topic)),
            "modules": final_modules,
            "final_exam": course_data.get("final_exam", [])
        }

    except ImportError:
        logger.error("google.generativeai library not found")
        raise HTTPException(status_code=500, detail="Gemini AI Library not installed on server")
    except Exception as e:
        logger.error(f"AI Generation failed: {e}")
        # Return the actual error string to frontend for easier debugging
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
