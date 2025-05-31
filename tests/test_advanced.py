from app.scoring import extract_experience_level, extract_enhanced_skills, calculate_semantic_similarity

# Test data
resume_text = "I am a senior software engineer with 8 years of experience in Python and 5 years with React. I have led teams and mentored junior developers. Expert in Django and AWS."

job_text = "Looking for a senior backend developer with Python experience and team leadership skills."

# Test functions
print("=== Experience Level Extraction ===")
exp_data = extract_experience_level(resume_text)
print(f"Experience data: {exp_data}")

print("\n=== Enhanced Skills Extraction ===")
skills_data = extract_enhanced_skills(resume_text)
for category, data in skills_data.items():
    print(f"{category}: {data}")

print("\n=== Semantic Similarity ===")
similarity = calculate_semantic_similarity(resume_text, job_text)
print(f"Similarity score: {similarity}")