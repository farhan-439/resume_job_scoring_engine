from app.scoring import extract_experience_level, extract_enhanced_skills_v2, calculate_semantic_similarity_with_confidence

# Test data with more complex skills
resume_text = "I am a senior software engineer with 8 years of experience in Python and 5 years with React. I have led teams and mentored junior developers. Expert in Django and AWS. Strong background in machine learning and natural language processing. Experience with full stack development and microservices architecture."

job_text = "Looking for a senior backend developer with Python experience and team leadership skills. ML background preferred."

# Test functions
print("=== Experience Level Extraction ===")
exp_data = extract_experience_level(resume_text)
print(f"Experience data: {exp_data}")

print("\n=== Enhanced Skills Extraction V2 ===")
skills_data = extract_enhanced_skills_v2(resume_text)
for category, data in skills_data.items():
    if data['count'] > 0:  # Only show categories with skills
        print(f"\n{category.upper()} ({data['count']} skills):")
        for skill in data['skills']:
            print(f"  - {skill['skill']} (matched as: {skill['matched_as']})")

print("\n=== Semantic Similarity with Confidence ===")
similarity, confidence = calculate_semantic_similarity_with_confidence(resume_text, job_text)
print(f"Similarity score: {similarity}")
print(f"Confidence score: {confidence}")