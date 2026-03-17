from app.core.logger import logger

def generate_dummy_roadmap():
    """Returns a dummy structured roadmap."""
    logger.info("Generating dummy roadmap")
    return {
        "week1": "Learn fundamentals and setup workspace",
        "week2": "Advanced concepts and practice projects",
        "week3": "Building portfolio projects",
        "week4": "Final review and mock interviews"
    }
