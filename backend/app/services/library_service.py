from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.models.library import Resource, SavedResource, RoadmapResource
from app.models.profile import Profile
from app.core.logger import logger


# --------------------------------------------------------------------------- #
#  Seed data — called at startup if the resources table is empty              #
# --------------------------------------------------------------------------- #
SEED_RESOURCES = [
    # ---------- Frontend Developer ----------
    dict(title="React Official Docs", type="article", url="https://react.dev", description="The official React documentation covering all core concepts from components to hooks and advanced patterns.", difficulty="beginner", duration="Self-paced", source="React", tags="react,javascript,frontend", career_goals="Frontend Developer,Full Stack Engineer"),
    dict(title="CSS Grid & Flexbox Mastery", type="video", url="https://www.youtube.com/watch?v=jV8B24rSN5o", description="A comprehensive video guide to modern CSS layouts using Grid and Flexbox.", difficulty="beginner", duration="2h 30m", source="YouTube", tags="css,frontend,layout", career_goals="Frontend Developer,UI/UX Designer"),
    dict(title="JavaScript: The Hard Parts", type="course", url="https://frontendmasters.com/courses/javascript-hard-parts-v2/", description="Deep dive into closures, async, prototypes, and the JS engine.", difficulty="intermediate", duration="9h", source="Frontend Masters", tags="javascript,closures,async", career_goals="Frontend Developer,Full Stack Engineer"),
    dict(title="TypeScript Deep Dive", type="article", url="https://basarat.gitbook.io/typescript/", description="A free online book that covers TypeScript from basics to advanced generics and utility types.", difficulty="intermediate", duration="Self-paced", source="Gitbook", tags="typescript,javascript,types", career_goals="Frontend Developer,Full Stack Engineer"),
    dict(title="Next.js App Router Guide", type="article", url="https://nextjs.org/docs/app", description="Official Next.js documentation for the App Router, server components, layouts, and data fetching.", difficulty="intermediate", duration="Self-paced", source="Vercel", tags="nextjs,react,ssr", career_goals="Frontend Developer,Full Stack Engineer"),
    dict(title="Accessibility in Web Dev", type="video", url="https://www.youtube.com/watch?v=z8xUCzToff8", description="Learn WCAG guidelines and how to build accessible interfaces from the ground up.", difficulty="beginner", duration="1h 15m", source="YouTube", tags="a11y,html,ux", career_goals="Frontend Developer,UI/UX Designer"),

    # ---------- Backend Developer ----------
    dict(title="FastAPI Official Tutorial", type="article", url="https://fastapi.tiangolo.com/tutorial/", description="The official step-by-step guide to building APIs with FastAPI, Pydantic, and SQLAlchemy.", difficulty="beginner", duration="Self-paced", source="FastAPI", tags="fastapi,python,api", career_goals="Backend Developer,Full Stack Engineer"),
    dict(title="PostgreSQL for Beginners", type="course", url="https://www.postgresqltutorial.com/", description="Complete beginner tutorial for PostgreSQL covering DDL, DML, joins, indexes and performance.", difficulty="beginner", duration="12h", source="PostgreSQLTutorial", tags="postgresql,sql,database", career_goals="Backend Developer,Full Stack Engineer,Data Scientist"),
    dict(title="System Design Fundamentals", type="video", url="https://www.youtube.com/watch?v=xpDnVSmNFX0", description="Learn how to design scalable distributed systems — load balancers, caching, queues, and more.", difficulty="intermediate", duration="45m", source="YouTube", tags="system-design,scalability,architecture", career_goals="Backend Developer,Full Stack Engineer,DevOps Engineer"),
    dict(title="Redis Crash Course", type="video", url="https://www.youtube.com/watch?v=jgpVdJB2sKQ", description="A practical introduction to Redis for caching, pub/sub, and session management.", difficulty="intermediate", duration="1h 10m", source="YouTube", tags="redis,caching,backend", career_goals="Backend Developer,DevOps Engineer"),
    dict(title="RESTful API Design Best Practices", type="article", url="https://restfulapi.net/", description="A comprehensive guide to designing clean, consistent REST APIs with proper status codes and patterns.", difficulty="intermediate", duration="45 min read", source="RESTfulAPI.net", tags="rest,api,backend", career_goals="Backend Developer,Full Stack Engineer"),
    dict(title="Docker & Containers Explained", type="course", url="https://www.youtube.com/watch?v=pTFZFxd5hOI", description="Introduction to Docker, containerization, images, volumes and docker-compose from scratch.", difficulty="beginner", duration="3h", source="YouTube", tags="docker,devops,containers", career_goals="Backend Developer,DevOps Engineer"),

    # ---------- Full Stack Engineer ----------
    dict(title="Full Stack Open 2024", type="course", url="https://fullstackopen.com/en/", description="University of Helsinki's free fullstack course covering React, Node, TypeScript, GraphQL and testing.", difficulty="intermediate", duration="Self-paced", source="University of Helsinki", tags="react,nodejs,typescript,fullstack", career_goals="Full Stack Engineer,Frontend Developer,Backend Developer"),
    dict(title="Prisma ORM Guide", type="article", url="https://www.prisma.io/docs/getting-started", description="Official Prisma documentation for type-safe database access with automatic migrations.", difficulty="intermediate", duration="Self-paced", source="Prisma", tags="prisma,orm,database,typescript", career_goals="Full Stack Engineer,Backend Developer"),

    # ---------- Data Scientist ----------
    dict(title="Python for Data Science Handbook", type="article", url="https://jakevdp.github.io/PythonDataScienceHandbook/", description="A free online textbook covering NumPy, Pandas, Matplotlib and Scikit-Learn for data science.", difficulty="beginner", duration="Self-paced", source="GitHub", tags="python,pandas,numpy,data-science", career_goals="Data Scientist"),
    dict(title="Machine Learning Crash Course", type="course", url="https://developers.google.com/machine-learning/crash-course", description="Google's free ML course covering regression, classification, neural networks and more using TensorFlow.", difficulty="intermediate", duration="15h", source="Google", tags="ml,tensorflow,machine-learning", career_goals="Data Scientist"),
    dict(title="Statistics for Data Science", type="video", url="https://www.youtube.com/watch?v=xxpc-HPKN28", description="A practical statistics refresher covering probability, distributions, hypothesis testing and regression.", difficulty="beginner", duration="2h", source="YouTube", tags="statistics,probability,data-science", career_goals="Data Scientist"),
    dict(title="Pandas Complete Tutorial", type="video", url="https://www.youtube.com/watch?v=vmEHCJofslg", description="Master Pandas for data manipulation, cleaning, groupby operations and data visualization.", difficulty="beginner", duration="1h 30m", source="YouTube", tags="pandas,python,data-science", career_goals="Data Scientist"),

    # ---------- DevOps Engineer ----------
    dict(title="Kubernetes Official Tutorial", type="article", url="https://kubernetes.io/docs/tutorials/", description="Official Kubernetes tutorial — learn pods, deployments, services, ingress and config maps.", difficulty="advanced", duration="Self-paced", source="Kubernetes", tags="kubernetes,k8s,devops", career_goals="DevOps Engineer"),
    dict(title="CI/CD with GitHub Actions", type="video", url="https://www.youtube.com/watch?v=R8_veQiYBjI", description="Build automated CI/CD pipelines with GitHub Actions for testing, building and deploying apps.", difficulty="intermediate", duration="1h 20m", source="YouTube", tags="github-actions,cicd,devops", career_goals="DevOps Engineer,Backend Developer"),

    # ---------- Mobile Developer ----------
    dict(title="React Native Crash Course", type="video", url="https://www.youtube.com/watch?v=0-S5a0eXPoc", description="Build your first iOS and Android app with React Native — components, navigation and APIs.", difficulty="beginner", duration="2h", source="YouTube", tags="react-native,mobile,javascript", career_goals="Mobile Developer"),
    dict(title="Flutter Documentation", type="article", url="https://docs.flutter.dev/", description="Official Flutter docs covering widgets, state management, routing and platform integration.", difficulty="beginner", duration="Self-paced", source="Flutter", tags="flutter,dart,mobile", career_goals="Mobile Developer"),

    # ---------- UI/UX Designer ----------
    dict(title="Figma Crash Course", type="video", url="https://www.youtube.com/watch?v=FTFaQWZBqQ8", description="Learn Figma from scratch — frames, components, auto-layout, prototyping and design systems.", difficulty="beginner", duration="1h", source="YouTube", tags="figma,design,ui,ux", career_goals="UI/UX Designer"),
    dict(title="Design Systems with Tokens", type="article", url="https://www.smashingmagazine.com/2022/08/tokens-design-systems/", description="A deep guide to using design tokens for consistent, scalable design systems across platforms.", difficulty="intermediate", duration="20 min read", source="Smashing Magazine", tags="design-system,tokens,ui", career_goals="UI/UX Designer,Frontend Developer"),

    # ---------- Product Manager ----------
    dict(title="Product Management Fundamentals", type="course", url="https://www.coursera.org/specializations/product-management", description="Google's PM certification course covering product strategy, roadmaps, metrics and stakeholder management.", difficulty="beginner", duration="6 months", source="Coursera", tags="product-management,strategy,roadmap", career_goals="Product Manager"),
    dict(title="Writing Great PRDs", type="article", url="https://www.svpg.com/inspired-book/", description="How to write product requirement documents that engineering teams love to implement.", difficulty="intermediate", duration="30 min read", source="SVPG", tags="prd,product-management,documentation", career_goals="Product Manager"),

    # ---------- Data Structures & Algorithms ----------
    dict(title="NeetCode 150 Roadmap", type="article", url="https://neetcode.io/roadmap", description="A curated list of 150 LeetCode problems organized by pattern — the most efficient way to prepare for coding interviews.", difficulty="intermediate", duration="Self-paced", source="NeetCode", tags="dsa,leetcode,algorithms,interview", career_goals="Frontend Developer,Backend Developer,Full Stack Engineer,Data Scientist"),
    dict(title="Visualizing Algorithms", type="article", url="https://visualgo.net/en", description="Interactive visualizations for sorting, graph traversal, BST, hashing and more — see algorithms in action.", difficulty="beginner", duration="Self-paced", source="VisuAlgo", tags="dsa,sorting,graphs,visualization", career_goals="Frontend Developer,Backend Developer,Full Stack Engineer"),
    dict(title="Striver's A2Z DSA Sheet", type="course", url="https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", description="A comprehensive DSA course with 450+ problems from arrays to dynamic programming, widely followed in India.", difficulty="intermediate", duration="Self-paced", source="Take U Forward", tags="dsa,dynamic-programming,arrays,interview", career_goals="Frontend Developer,Backend Developer,Full Stack Engineer"),

    # ---------- AI / Machine Learning (Advanced) ----------
    dict(title="fast.ai Practical Deep Learning", type="course", url="https://course.fast.ai/", description="A free, top-down approach to deep learning — build real models before theory. Covers CNNs, NLP, and tabular data.", difficulty="intermediate", duration="30h", source="fast.ai", tags="deep-learning,pytorch,cnn,nlp", career_goals="Data Scientist"),
    dict(title="Andrej Karpathy: Neural Networks Zero to Hero", type="video", url="https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", description="Build neural networks from scratch in Python — backpropagation, transformers, and GPT explained by ex-Tesla AI director.", difficulty="advanced", duration="12h", source="YouTube", tags="neural-networks,transformers,gpt,deep-learning", career_goals="Data Scientist"),
    dict(title="Hugging Face NLP Course", type="course", url="https://huggingface.co/learn/nlp-course", description="Free course on NLP with Transformers — tokenization, fine-tuning BERT, and building NLP pipelines.", difficulty="intermediate", duration="20h", source="Hugging Face", tags="nlp,transformers,bert,huggingface", career_goals="Data Scientist"),
    dict(title="Kaggle Learn: Intro to Machine Learning", type="course", url="https://www.kaggle.com/learn/intro-to-machine-learning", description="Hands-on ML tutorial with real datasets — decision trees, random forests, and model validation.", difficulty="beginner", duration="4h", source="Kaggle", tags="machine-learning,scikit-learn,kaggle", career_goals="Data Scientist"),

    # ---------- Cloud & AWS ----------
    dict(title="AWS Cloud Practitioner Essentials", type="course", url="https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", description="Official AWS free course covering cloud concepts, AWS services, security, pricing and support.", difficulty="beginner", duration="6h", source="AWS", tags="aws,cloud,certification", career_goals="DevOps Engineer,Backend Developer,Full Stack Engineer"),
    dict(title="Terraform in 2 Hours", type="video", url="https://www.youtube.com/watch?v=SLB_c_ayRMo", description="Infrastructure as Code with Terraform — providers, resources, modules, and state management.", difficulty="intermediate", duration="2h", source="YouTube", tags="terraform,iac,devops,cloud", career_goals="DevOps Engineer"),
    dict(title="Linux Command Line Basics", type="course", url="https://www.youtube.com/watch?v=ZtqBQ68cfJc", description="Essential Linux commands every developer needs — file system, permissions, processes, networking and shell scripting.", difficulty="beginner", duration="3h", source="YouTube", tags="linux,terminal,bash,devops", career_goals="DevOps Engineer,Backend Developer,Full Stack Engineer"),

    # ---------- Cybersecurity ----------
    dict(title="OWASP Top 10 Explained", type="article", url="https://owasp.org/www-project-top-ten/", description="The 10 most critical web application security risks — SQL injection, XSS, CSRF, and how to prevent them.", difficulty="intermediate", duration="45 min read", source="OWASP", tags="security,owasp,xss,sql-injection", career_goals="Backend Developer,Full Stack Engineer,DevOps Engineer"),
    dict(title="TryHackMe: Complete Beginner Path", type="course", url="https://tryhackme.com/path/outline/beginner", description="Interactive cybersecurity labs — learn hacking fundamentals, networking, web exploitation, and privilege escalation.", difficulty="beginner", duration="40h", source="TryHackMe", tags="cybersecurity,hacking,pentesting", career_goals="DevOps Engineer,Backend Developer"),

    # ---------- Git & Version Control ----------
    dict(title="Git & GitHub for Beginners", type="video", url="https://www.youtube.com/watch?v=RGOj5yH7evk", description="Complete Git tutorial — repositories, branching, merging, pull requests, and collaboration workflows.", difficulty="beginner", duration="1h", source="YouTube", tags="git,github,version-control", career_goals="Frontend Developer,Backend Developer,Full Stack Engineer,DevOps Engineer,Data Scientist"),
    dict(title="Advanced Git Workflows", type="article", url="https://www.atlassian.com/git/tutorials/comparing-workflows", description="Gitflow, GitHub Flow, and trunk-based development — choose the right branching strategy for your team.", difficulty="intermediate", duration="30 min read", source="Atlassian", tags="git,branching,workflows,collaboration", career_goals="Full Stack Engineer,Backend Developer,DevOps Engineer"),

    # ---------- Testing ----------
    dict(title="Testing JavaScript with Jest", type="video", url="https://www.youtube.com/watch?v=FgnxcUQ5vho", description="Unit testing, mocking, and test-driven development with Jest for React and Node.js applications.", difficulty="intermediate", duration="1h 30m", source="YouTube", tags="jest,testing,tdd,javascript", career_goals="Frontend Developer,Full Stack Engineer"),
    dict(title="Pytest Tutorial for Python", type="article", url="https://docs.pytest.org/en/stable/getting-started.html", description="Official Pytest guide — fixtures, parametrize, mocking, and testing FastAPI endpoints.", difficulty="intermediate", duration="Self-paced", source="Pytest", tags="pytest,testing,python,fastapi", career_goals="Backend Developer,Data Scientist"),

    # ---------- Blockchain / Web3 ----------
    dict(title="Solidity by Example", type="article", url="https://solidity-by-example.org/", description="Learn Solidity smart contract programming through practical examples — from Hello World to DeFi patterns.", difficulty="intermediate", duration="Self-paced", source="Solidity", tags="solidity,blockchain,smart-contracts,web3", career_goals="Full Stack Engineer"),
    dict(title="CryptoZombies", type="course", url="https://cryptozombies.io/", description="An interactive gamified course to learn Solidity and build your own blockchain game.", difficulty="beginner", duration="8h", source="CryptoZombies", tags="solidity,blockchain,ethereum,web3", career_goals="Full Stack Engineer"),

    # ---------- Game Development ----------
    dict(title="Unity Learn: Create with Code", type="course", url="https://learn.unity.com/course/create-with-code", description="Unity's official beginner course — build 5 complete games while learning C#, physics, and game design.", difficulty="beginner", duration="30h", source="Unity", tags="unity,c#,game-dev,3d", career_goals="Mobile Developer"),
    dict(title="Godot Engine Getting Started", type="article", url="https://docs.godotengine.org/en/stable/getting_started/", description="Free open-source game engine tutorial — GDScript, scenes, signals, and 2D/3D game development.", difficulty="beginner", duration="Self-paced", source="Godot", tags="godot,gdscript,game-dev,2d", career_goals="Mobile Developer"),

    # ---------- Soft Skills / Career ----------
    dict(title="The Missing Semester of CS Education", type="course", url="https://missing.csail.mit.edu/", description="MIT's course on tools every developer needs — shell, Vim, Git, debugging, profiling, and security.", difficulty="beginner", duration="12h", source="MIT", tags="tools,shell,vim,debugging,git", career_goals="Frontend Developer,Backend Developer,Full Stack Engineer,Data Scientist,DevOps Engineer"),
    dict(title="How to Build a Portfolio That Gets Hired", type="article", url="https://www.joshwcomeau.com/career/building-an-effective-dev-portfolio/", description="Practical advice on what to include in your developer portfolio — projects, case studies, and storytelling.", difficulty="beginner", duration="20 min read", source="Josh W Comeau", tags="portfolio,career,job-search", career_goals="Frontend Developer,Backend Developer,Full Stack Engineer,UI/UX Designer"),
]


def seed_resources(db: Session) -> None:
    """Seed the database with initial resources if the table is empty."""
    count = db.query(Resource).count()
    if count == 0:
        logger.info("Seeding library resources...")
        for r in SEED_RESOURCES:
            db.add(Resource(**r))
        db.commit()
        logger.info(f"Seeded {len(SEED_RESOURCES)} resources.")


# --------------------------------------------------------------------------- #
#  Read operations                                                              #
# --------------------------------------------------------------------------- #
def get_all_resources(db: Session, user_id: int, search: Optional[str] = None, type_filter: Optional[str] = None, difficulty_filter: Optional[str] = None) -> List[dict]:
    """Fetch all resources with optional search/filter, annotated with is_saved."""
    query = db.query(Resource)

    if search:
        term = f"%{search.lower()}%"
        query = query.filter(
            (Resource.title.ilike(term)) |
            (Resource.tags.ilike(term)) |
            (Resource.description.ilike(term))
        )

    if type_filter:
        query = query.filter(Resource.type == type_filter.lower())

    if difficulty_filter:
        query = query.filter(Resource.difficulty == difficulty_filter.lower())

    resources = query.all()
    saved_ids = _get_saved_ids(db, user_id)
    return [_to_dict(r, saved_ids) for r in resources]


def get_recommended_resources(db: Session, user_id: int) -> List[dict]:
    """Fetch resources relevant to the user's career goal."""
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    saved_ids = _get_saved_ids(db, user_id)

    if not profile:
        # Return a diverse set to populate the tab even without a profile
        resources = db.query(Resource).limit(12).all()
        return [_to_dict(r, saved_ids) for r in resources]

    career_goal = profile.career_goal
    all_resources = db.query(Resource).all()

    # Filter by career_goal substring match in the career_goals column
    recommended = [r for r in all_resources if r.career_goals and career_goal in r.career_goals]

    if not recommended:
        recommended = all_resources[:12]

    return [_to_dict(r, saved_ids) for r in recommended]


def get_saved_resources(db: Session, user_id: int) -> List[dict]:
    """Fetch all resources the user has saved."""
    saved = db.query(SavedResource).filter(SavedResource.user_id == user_id).all()
    return [_to_dict(s.resource, {s.resource_id}, is_saved=True) for s in saved if s.resource]


# --------------------------------------------------------------------------- #
#  Write operations                                                             #
# --------------------------------------------------------------------------- #
def save_resource(db: Session, user_id: int, resource_id: int) -> bool:
    """Save a resource for the current user. Returns True if newly saved."""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        return False

    existing = db.query(SavedResource).filter(
        SavedResource.user_id == user_id,
        SavedResource.resource_id == resource_id
    ).first()

    if existing:
        return False  # Already saved

    try:
        db.add(SavedResource(user_id=user_id, resource_id=resource_id))
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        return False


def unsave_resource(db: Session, user_id: int, resource_id: int) -> bool:
    """Remove a saved resource for the current user. Returns True if removed."""
    saved = db.query(SavedResource).filter(
        SavedResource.user_id == user_id,
        SavedResource.resource_id == resource_id
    ).first()

    if not saved:
        return False

    db.delete(saved)
    db.commit()
    return True


def link_resource_to_week(db: Session, user_id: int, resource_id: int, week_number: int) -> bool:
    """Link a resource to a specific roadmap week for the user."""
    from app.models.roadmap import Roadmap
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if not roadmap:
        return False

    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        return False

    existing = db.query(RoadmapResource).filter(
        RoadmapResource.roadmap_id == roadmap.id,
        RoadmapResource.resource_id == resource_id,
        RoadmapResource.week_number == week_number
    ).first()

    if existing:
        return True  # Already linked

    try:
        db.add(RoadmapResource(roadmap_id=roadmap.id, resource_id=resource_id, week_number=week_number))
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        return False


# --------------------------------------------------------------------------- #
#  Helpers                                                                      #
# --------------------------------------------------------------------------- #
def _get_saved_ids(db: Session, user_id: int) -> set:
    saved = db.query(SavedResource.resource_id).filter(SavedResource.user_id == user_id).all()
    return {s[0] for s in saved}


def _to_dict(resource: Resource, saved_ids: set, is_saved: bool = None) -> dict:
    return {
        "id": resource.id,
        "title": resource.title,
        "type": resource.type,
        "url": resource.url,
        "description": resource.description,
        "difficulty": resource.difficulty,
        "duration": resource.duration,
        "source": resource.source,
        "tags": resource.tags,
        "career_goals": resource.career_goals,
        "is_saved": is_saved if is_saved is not None else (resource.id in saved_ids),
    }
