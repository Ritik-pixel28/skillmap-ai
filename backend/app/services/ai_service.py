import os
import json
from groq import Groq
from app.core.logger import logger

def get_ai_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY is not set in environment variables.")
        return None
    return Groq(api_key=api_key)

def generate_ai_roadmap(profile):
    client = get_ai_client()
    if not client:
        return get_fallback_roadmap(profile)

    intensity = "Light"
    if profile.weekly_hours > 20:
        intensity = "Intensive"
    elif profile.weekly_hours >= 10:
        intensity = "Medium"

    logger.info(f"Generating {intensity} Groq roadmap: {profile.career_goal} for {profile.timeline} weeks")

    prompt = f"""
    Create a highly actionable, week-by-week learning roadmap for a user:
    - Career Goal: {profile.career_goal}
    - Current Skill Level: {profile.skill_level}
    - Intensity Level: {intensity} ({profile.weekly_hours} hours/week)
    - Education Background: {profile.education}
    - Desired Timeline: {profile.timeline} weeks
 
    The roadmap MUST be a valid JSON object with the following structure:
    {{
      "title": "A professional title for the roadmap",
      "weeks": [
        {{
          "week": 1,
          "title": "Week theme/topic",
          "tasks": [
            {{ 
              "title": "Specific task 1", 
              "description": "Clear explanation of what the user will learn and why it matters.",
              "duration": "e.g. 2 days",
              "estimated_days": 2,
              "subtopics": ["Subtopic A", "Subtopic B", "Subtopic C"],
              "actions": ["Watch tutorial", "Practice exercise", "Build prototype"]
            }}
          ]
        }}
      ]
    }}
 
    Rules:
    1. Provide exactly {profile.timeline} weeks of structured learning.
    2. Intensity Check: {intensity} mode requires {"dense, challenging" if intensity == "Intensive" else "manageable, steady"} pacing.
    3. Each week must have 2-5 practical tasks.
    4. Each task must include "estimated_days" (between 1 to 4 days).
    5. Include 3-5 subtopics for every task to guide the user.
    6. Include an "actions" list for each task with 2-3 specific action items.
    7. Include a 1-2 sentence "description" for every task.
    8. JSON output ONLY. No conversational filler or markdown backticks.
    """
 
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a technical mentor who outputs only valid JSON roadmaps with structured task objects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
 
        raw_content = response.choices[0].message.content
        if not raw_content:
            raise ValueError("Empty response from Groq")
 
        clean_content = raw_content.strip()
        if clean_content.startswith("```"):
            clean_content = clean_content.split("```json")[-1].split("```")[0].strip()
 
        roadmap_data = json.loads(clean_content)
        
        if "weeks" not in roadmap_data or not isinstance(roadmap_data["weeks"], list):
            raise ValueError("AI response missing 'weeks' array")

        return roadmap_data
 
    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}")
        return get_fallback_roadmap(profile)
 
def get_fallback_roadmap(profile):
    logger.info("Serving fallback roadmap")
    return {
        "title": f"{profile.career_goal} Learning Journey",
        "weeks": [
            {
                "week": 1,
                "title": "Getting Started & Essentials",
                "tasks": [
                    { 
                        "title": f"Research core concepts of {profile.career_goal}", 
                        "description": "Examine the industry landscape, key tools, and current market requirements.",
                        "duration": "2 days",
                        "subtopics": ["Industry overview", "Key terminology", "Market trends"],
                        "actions": ["Read industry blogs", "Watch intro videos", "Take notes on terminology"]
                    },
                    { 
                        "title": "Set up the necessary development environment", 
                        "description": "Configure your workspace with the essential software and extensions.",
                        "duration": "1 day",
                        "subtopics": ["Install IDE", "Configure version control", "Dependency management"],
                        "actions": ["Install VS Code", "Set up Git", "Install project dependencies"]
                    },
                    { 
                        "title": "Complete a basic hello-world project", 
                        "description": "Get hands-on experience by building your first small implementation.",
                        "duration": "2 days",
                        "subtopics": ["Basic syntax", "Variable declarations", "Compilation/Running"],
                        "actions": ["Write first code snippet", "Debug errors", "Run successful build"]
                    }
                ]
            },
            {
                "week": 2,
                "title": "Deep Dive into Fundamentals",
                "tasks": [
                    { 
                        "title": "Study key syntax and libraries", 
                        "description": "Master the core building blocks and standard libraries of the technology.",
                        "duration": "3 days",
                        "subtopics": ["Core library functions", "Optimization patterns", "Error handling"],
                        "actions": ["Read documentation", "Complete coding challenges", "Watch advanced tutorial"]
                    },
                    { 
                        "title": "Build a small practical component", 
                        "description": "Apply your knowledge to create a reusable part of an application.",
                        "duration": "2 days",
                        "subtopics": ["Modular design", "Data flow", "UI integration"],
                        "actions": ["Design component logic", "Implement functionality", "Style the UI"]
                    },
                    { 
                        "title": "Read top-rated articles on best practices", 
                        "description": "Learn from industry experts to write clean, professional-grade code.",
                        "duration": "1 day",
                        "subtopics": ["Design patterns", "Testing strategies", "Documentation"],
                        "actions": ["Read 3 technical articles", "Review open source code", "Summarize learnings"]
                    }
                ]
            }
        ]
    }
