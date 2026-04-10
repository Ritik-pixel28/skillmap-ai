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

    logger.info(f"Generating Groq roadmap: {profile.career_goal}")

    prompt = f"""
    Create a detailed, week-by-week learning roadmap for a user with these details:
    - Career Goal: {profile.career_goal}
    - Current Skill Level: {profile.skill_level}
    - Commitment: {profile.weekly_hours} hours per week
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
              "duration": "e.g. 2 days",
              "subtopics": ["Subtopic A", "Subtopic B", "Subtopic C"]
            }}
          ]
        }}
      ]
    }}
 
    Rules:
    1. Provide between 4 to {min(profile.timeline, 8)} weeks.
    2. Tasks must be practical, actionable, and include a realistic duration.
    3. Include 3-5 subtopics for every task to guide the user.
    4. JSON output ONLY. No conversational filler or markdown backticks.
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
                        "duration": "2 days",
                        "subtopics": ["Industry overview", "Key terminology", "Market trends"]
                    },
                    { 
                        "title": "Set up the necessary development environment", 
                        "duration": "1 day",
                        "subtopics": ["Install IDE", "Configure version control", "Dependency management"]
                    },
                    { 
                        "title": "Complete a basic hello-world project", 
                        "duration": "2 days",
                        "subtopics": ["Basic syntax", "Variable declarations", "Compilation/Running"]
                    }
                ]
            },
            {
                "week": 2,
                "title": "Deep Dive into Fundamentals",
                "tasks": [
                    { 
                        "title": "Study key syntax and libraries", 
                        "duration": "3 days",
                        "subtopics": ["Core library functions", "Optimization patterns", "Error handling"]
                    },
                    { 
                        "title": "Build a small practical component", 
                        "duration": "2 days",
                        "subtopics": ["Modular design", "Data flow", "UI integration"]
                    },
                    { 
                        "title": "Read top-rated articles on best practices", 
                        "duration": "1 day",
                        "subtopics": ["Design patterns", "Testing strategies", "Documentation"]
                    }
                ]
            }
        ]
    }
