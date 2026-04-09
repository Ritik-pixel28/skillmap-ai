import os
import json
from groq import Groq
from app.core.logger import logger

def get_ai_client():
    """Lazily initialize the Groq client."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY is not set in environment variables.")
        return None
    return Groq(api_key=api_key)

def generate_ai_roadmap(profile):
    """
    Generates a structured roadmap based on user profile using Groq.
    """
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
          "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"]
        }}
      ]
    }}

    Rules:
    1. Provide between 4 to {min(profile.timeline, 8)} weeks.
    2. Tasks must be practical and actionable.
    3. JSON output ONLY. No conversational filler or markdown backticks.
    """

    try:
        # Groq call using LLaMA3
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a technical mentor who outputs only valid JSON roadmaps."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            # Ensuring structured output if supported by the specific model endpoint
            response_format={"type": "json_object"}
        )

        raw_content = response.choices[0].message.content
        if not raw_content:
            raise ValueError("Empty response from Groq")

        # Clean potential markdown backticks if AI ignores instructions
        clean_content = raw_content.strip()
        if clean_content.startswith("```"):
            clean_content = clean_content.split("```json")[-1].split("```")[0].strip()

        # Parse JSON safely
        roadmap_data = json.loads(clean_content)
        
        # Validation
        if "weeks" not in roadmap_data or not isinstance(roadmap_data["weeks"], list):
            raise ValueError("AI response missing 'weeks' array")

        return roadmap_data

    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}")
        return get_fallback_roadmap(profile)

def get_fallback_roadmap(profile):
    """
    Provides a basic fallback roadmap when the AI service is unavailable.
    """
    logger.info("Serving fallback roadmap")
    return {
        "title": f"{profile.career_goal} Learning Journey",
        "weeks": [
            {
                "week": 1,
                "title": "Getting Started & Essentials",
                "tasks": [
                    f"Research core concepts of {profile.career_goal}",
                    "Set up the necessary development environment",
                    "Complete a basic hello-world project"
                ]
            },
            {
                "week": 2,
                "title": "Deep Dive into Fundamentals",
                "tasks": [
                    "Study key syntax and libraries",
                    "Build a small practical component",
                    "Read top-rated articles on best practices"
                ]
            }
        ]
    }
