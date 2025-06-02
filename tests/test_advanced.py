from app.scoring import extract_enhanced_experience_level, extract_enhanced_skills_v2, calculate_semantic_similarity_with_confidence, calculate_hybrid_semantic_similarity

# Test data designed to test the semantic matching
resume_text = "Software developer with 8 years of experience in Python and React. I have led teams and mentored developers. Expert in Django and AWS. Strong background in machine learning."

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

# NEW HYBRID TESTS BELOW
print("\n" + "="*50)
print("=== HYBRID SEMANTIC SIMILARITY TESTS ===")
print("="*50)

# Test with high-quality text (should use semantic)
resume_text_good = "Senior software engineer with 8 years of experience in Python development and React. I have led teams and mentored junior developers. Expert in Django and AWS with strong machine learning background."

# Test with poor-quality text (should use hybrid/fallback)
resume_text_poor = "dev python react 2 yr"

print("\n1. High-quality text (should use semantic):")
similarity1, confidence1, method1 = calculate_hybrid_semantic_similarity(resume_text_good, job_text)
print(f"Similarity: {similarity1:.3f}, Confidence: {confidence1:.3f}, Method: {method1}")

print("\n2. Poor-quality text (should use hybrid fallback):")
similarity2, confidence2, method2 = calculate_hybrid_semantic_similarity(resume_text_poor, job_text)
print(f"Similarity: {similarity2:.3f}, Confidence: {confidence2:.3f}, Method: {method2}")

print("\n3. Original text with hybrid method:")
similarity3, confidence3, method3 = calculate_hybrid_semantic_similarity(resume_text, job_text)
print(f"Similarity: {similarity3:.3f}, Confidence: {confidence3:.3f}, Method: {method3}")