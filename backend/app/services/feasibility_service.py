from app.core.logger import logger

def calculate_feasibility(weekly_hours: int):
    """
    Logic to check if career goal is feasible.
    Logic: 
    - required = 1000 total hours
    - available = weekly_hours * 12 (approx 3 months)
    """
    logger.info(f"Calculating feasibility for {weekly_hours} weekly hours")
    
    required_hours = 1000
    available_hours = weekly_hours * 12
    
    if available_hours >= required_hours:
        result = "Feasible"
    elif available_hours >= required_hours * 0.6:
        result = "Risky"
    else:
        result = "Not Feasible"
        
    logger.info(f"Feasibility result: {result}")
    return {
        "weekly_hours": weekly_hours,
        "available_hours_12_weeks": available_hours,
        "required_hours": required_hours,
        "status": result
    }
