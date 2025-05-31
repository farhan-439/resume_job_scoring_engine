# Resume Job Scoring Engine

A sophisticated AI-powered resume-job matching system that provides multi-dimensional scoring with semantic similarity analysis and experience-level matching.

## 🚀 Features

- **Advanced NLP Processing**: Uses spaCy and Sentence Transformers for intelligent text analysis
- **Multi-Dimensional Scoring**: Evaluates skills, experience, and semantic similarity
- **Weighted Skill Categories**: Programming languages, frameworks, databases, cloud/DevOps, and soft skills
- **Experience Level Matching**: Extracts and compares years of experience and seniority levels
- **Company Reputation Modifiers**: Adjusts scores based on company prestige and hiring difficulty
- **Semantic Similarity**: Uses Hugging Face transformers to understand meaning beyond keyword matching
- **Deterministic Results**: Consistent scoring for identical inputs
- **RESTful API**: FastAPI with automatic documentation

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **NLP**: spaCy, Sentence Transformers (Hugging Face)
- **ML**: scikit-learn for similarity calculations
- **API Documentation**: Automatic OpenAPI/Swagger docs

## 📦 Installation

1. **Clone the repository**:

```bash
git clone https://github.com/[your-username]/resume_job_scoring_engine.git
cd resume_job_scoring_engine
```

2. **Install dependencies**;

```bash
pip install -r requirements.txt
```

3. **Download spaCy model**;

```bash
python -m spacy download en_core_web_sm
```

4. **Run the server**;

```bash
uvicorn app.main:app --reload
```

## 5. **Test the Application**

1. Start the server: `uvicorn app.main:app --reload`
2. Open http://127.0.0.1:8000/docs
3. Click on POST `/score` → "Try it out"
4. Paste sample data and execute

## 🔧 Dependencies (requirements.txt)

```bash
fastapi==0.104.1
uvicorn==0.24.0
spacy==3.7.2
sentence-transformers==2.7.0
scikit-learn==1.3.2
huggingface_hub==0.20.3
```

# 🧠 Scoring Algorithm

The scoring system uses a multi-dimensional approach combining skills analysis, semantic similarity, experience matching, and company factors.

## 1. **Skills Analysis** (60% of base score)

Skills are categorized with different weights based on importance:

- **Programming Languages** (30%): `python`, `javascript`, `java`, `c++`, `c#`, `go`, `rust`, `typescript`
- **Frameworks/Libraries** (25%): `react`, `django`, `flask`, `fastapi`, `node.js`, `express`, `spring`, `angular`
- **Databases** (20%): `postgresql`, `mysql`, `mongodb`, `redis`, `elasticsearch`, `sql`, `nosql`
- **Cloud/DevOps** (15%): `aws`, `azure`, `gcp`, `docker`, `kubernetes`, `jenkins`, `terraform`, `ci/cd`
- **Soft Skills** (10%): `leadership`, `communication`, `teamwork`, `problem solving`, `project management`

**Calculation**: For each category, score = (resume*skills / job_requirements) * 100 \_ weight

## 2. **Semantic Similarity** (40% of base score)

Uses Sentence Transformers (`all-MiniLM-L6-v2`) to calculate semantic similarity:

- Converts resume and job description to 384-dimensional embeddings
- Calculates cosine similarity between embeddings
- Understands context and meaning beyond keyword matching

## 3. **Experience Matching Bonus/Penalty**

- **Level Matching**: +10 for exact match, +5 for overqualified, 0 for underqualified
- **Years Experience**: +2 points per year above requirement (max +10), -3 points per year below (max -15)
- **Leadership Keywords**: Bonus for management terms like "manage", "lead", "mentor"

## 4. **Company Reputation Modifiers**

- **Big Tech** (Meta, Google, Amazon, Apple, Microsoft, Netflix): **-15 points**
- **Startups** (contains "startup", "early-stage", "seed"): **+10 points**
- **Default**: **0 points**

## 5. **Final Calculation**

```bash
base_score = (skills_score * 0.6) + (semantic_similarity * 100 * 0.4)
overall_score = base_score + experience_bonus
final_score = overall_score + company_modifier
```

## 🎯 Key Features

### Deterministic Scoring

- Same input always produces identical output
- No randomness in the algorithm
- Consistent results across sessions and deployments

### Context-Aware Skill Extraction

- Recognizes "5 years Python experience" vs "basic Python knowledge"
- Extracts proficiency levels (basic/intermediate/advanced/expert)
- Considers skill combinations and context clues

### Intelligent Experience Matching

- Uses regex patterns to extract years of experience
- Identifies seniority levels (junior/mid/senior/lead/principal)
- Counts leadership indicators and management keywords

### Semantic Understanding

- Goes beyond simple keyword matching
- Understands synonyms and related concepts ("team lead" = "leadership experience")
- Uses state-of-the-art transformer models from Hugging Face

### Input Validation

- Minimum text length requirements
- Automatic text cleaning and preprocessing
- Comprehensive error handling and informative error messages

## 🔬 Testing the Application
