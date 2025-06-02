from app.scoring import extract_enhanced_experience_level, extract_enhanced_skills_v2, calculate_semantic_similarity_with_confidence

# Test data designed to test the semantic matching
resume_text = "Software developer with 8 years of experience in Python and React. I have led teams and mentored junior developers. Expert in Django and AWS. Strong background in machine learning."

job_text = "Looking for a senior backend engineer with Python experience and team leadership skills. 5+ years experience required."

# Test the enhanced experience extraction
print("=== Enhanced Experience Level Extraction ===")
resume_exp = extract_enhanced_experience_level(resume_text)
job_exp = extract_enhanced_experience_level(job_text)

print(f"Resume experience: {resume_exp}")
print(f"Job experience: {job_exp}")

print("\n=== Enhanced Skills Extraction V2 ===")
skills_data = extract_enhanced_skills_v2(resume_text)
for category, data in skills_data.items():
    if data['count'] > 0:
        print(f"{category}: {data['count']} skills")

print("\n=== Semantic Similarity with Confidence ===")
similarity, confidence = calculate_semantic_similarity_with_confidence(resume_text, job_text)
print(f"Similarity score: {similarity}")
print(f"Confidence score: {confidence}")