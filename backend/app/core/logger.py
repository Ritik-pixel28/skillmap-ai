import logging
import sys
from datetime import datetime

def setup_logger():
    """Configure enhanced centralized logging for the application."""
    logger = logging.getLogger("skillmap")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        # Better formatting with timestamp and level name
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )

        # stdout handler
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger

logger = setup_logger()
