1. General Principles
1.1 Code Readability
Prioritize clarity over cleverness.
Use descriptive names for variables, functions, and classes (no single-letter or ambiguous names).
Keep functions short (Single Responsibility Principle). If it’s doing too much, split it.
1.2 Code Reusability
Modular design: Break functionality into reusable functions/components.
No duplication: If you see the same logic repeated, refactor into a helper.
1.3 Scalability & Performance
Aim for efficient time and space complexity (avoid naive solutions if performance matters).
Store configurations in environment variables or config files (no hard-coding secret values).
Consider future expansion (e.g., can the solution handle bigger datasets or more concurrent traffic?).
1.4 Testing
Write tests for every significant function or class.
Maintain at least 80% coverage (or an agreed-upon threshold).
Mock external dependencies (like databases or APIs) to keep tests isolated.
2. Code Structure
2.1 Project Layout
A recommended baseline (adapt as needed):

bash
Copy
my_project/
├── src/
│   ├── components/   # Reusable modules or UI components
│   ├── services/     # Business/domain logic
│   ├── utils/        # General utility/helper functions
│   ├── config/       # Configuration files or environment variable logic
│   └── tests/        # Test files (unit, integration, etc.)
├── README.md
├── requirements.txt  # Or package.json/pyproject.toml, etc.
├── .env              # Environment variables (never commit secrets!)
└── .gitignore
2.2 Code Organization
Group related logic together. Avoid massive, monolithic files.
Split large modules into smaller, domain-specific parts (e.g., user_service.py, auth_service.py, etc.).
3. Coding Standards
3.1 Documentation
Use docstrings (or JSDoc in JavaScript) for every function, class, and module. Example in Python:

python
Copy
def add_numbers(a: int, b: int) -> int:
    """
    Adds two numbers together.

    Args:
        a (int): The first number.
        b (int): The second number.

    Returns:
        int: The sum of a and b.
    """
    return a + b
3.2 Naming Conventions
Element	Convention	Examples
Variables	snake_case	user_count, total_score
Functions	snake_case	get_user_data, compute_sum
Classes	PascalCase	UserProfile, OrderManager
Constants	UPPER_CASE	MAX_RETRIES, API_URL
Avoid ambiguous names like foo, bar, tmp, etc.

3.3 Error Handling
Gracefully handle exceptions.
Log errors rather than silently ignoring them.
In Python:
python
Copy
try:
    # risky operation
except SomeError as e:
    logger.error(f"Operation failed: {e}")
    raise
3.4 Type Annotations
Use type hints (Python) or TypeScript for clarity and error catching at compile time.
3.5 Comments
Keep comments concise.
Don’t repeat what the code already states; focus on why something is done if non-obvious.
4. Language-Specific Practices
4.1 Python
Follow PEP 8 style guidelines.
Use black or flake8 for formatting/linting.
Prefer built-in list comprehensions over loops if it improves readability.
Use async/await for I/O-bound tasks.
4.2 JavaScript/TypeScript
Use ESLint (Airbnb or Standard config) for style.
Prefer const and let over var.
Use async/await for asynchronous code.
In React, keep components small and well-structured.
4.3 Backend Services
Validate all inputs (particularly from user-facing forms/APIs).
Use environment variables for secrets (API keys, DB credentials).
Adhere to RESTful or GraphQL best practices in API design.
4.4 Frontend Development
Use a component-based approach (React, Vue, etc.).
Ensure responsiveness and accessibility (aria- attributes, etc.).
Keep CSS organized (CSS modules, styled components, or another structured approach).
5. Git & Collaboration
5.1 Commit Messages
Use a format like:

sql
Copy
feat: Add user registration endpoint
fix: Resolve race condition in payment logic
refactor: Simplify inventory update method
This helps track changes clearly.

5.2 Branching Strategy
main: Production-ready code.
dev: Ongoing development.
feature/: For new features or major tasks.
hotfix/: For urgent fixes on production.
5.3 Code Reviews
Always do pull requests.
Another team member or the AI does a review for best practices and potential bugs.
6. Testing & Deployment
6.1 Testing
TDD (Test-Driven Development) where feasible.
Use unit tests for isolated logic, integration tests for workflows, and end-to-end tests for user flows.
Mock external services (databases, APIs).
6.2 CI/CD
Automated pipeline for linting, testing, and building.
On success, deploy to staging or production automatically (with manual approval if needed).
7. AI Code Assistant Prompts
To ensure consistent senior-level coding, reference these prompts whenever the AI assists you:

Initial Code Generation

“Write clean, modular, and efficient code that follows our universal coding standards. Include documentation and type hints.”
Refactoring Prompt

“Refactor this code for readability, maintainability, and scalability. Keep it concise and modular, aligned with our coding standards.”
Optimization Prompt

“Optimize this code for performance without compromising readability. Adhere to best practices and our coding standards.”
Code Review Prompt

“Analyze this code for potential issues, inefficiencies, or deviations from our coding standards. Suggest improvements.”
8. Continuous Improvement
Regularly revisit this document as new frameworks, libraries, or best practices emerge.
Keep an eye on code quality metrics (lint warnings, duplication, test coverage).
Adapt or refine these guidelines as your team’s needs evolve.