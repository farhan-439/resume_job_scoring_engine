from app.scoring import extract_enhanced_experience_level, extract_enhanced_skills_v2, calculate_hybrid_semantic_similarity, calculate_intelligent_semantic_similarity

# REALISTIC TEST CASES
print("="*70)
print("=== INTELLIGENT SEMANTIC SIMILARITY TESTS ===")
print("="*70)

# Test Case 1: Good match
resume_1 = "Senior software engineer with 8 years Python experience. I have mentored junior developers, led cross-functional teams, and architected microservices. Expert in Django, React, and AWS cloud infrastructure."
job_1 = "Looking for senior Python developer with leadership experience, 5+ years required, Django and AWS preferred."

print("\n1. GOOD MATCH TEST:")
print("Resume: Senior engineer (8 years)")
print("Job: Looking for senior developer")

similarity_hybrid = calculate_hybrid_semantic_similarity(resume_1, job_1)[0]
similarity_intelligent = calculate_intelligent_semantic_similarity(resume_1, job_1)[0]

print(f"Hybrid similarity:        {similarity_hybrid:.3f}")
print(f"Intelligent similarity:   {similarity_intelligent:.3f}")
print(f"Change: {((similarity_intelligent - similarity_hybrid) * 100):+.1f}%")

# Test Case 2: Underqualified candidate
resume_2 = "Recent computer science graduate with internship experience. Familiar with Python basics and completed coursework in web development."
job_2 = "Senior engineer position requiring 5+ years experience, Python expertise, ability to lead teams and architect systems."

print("\n2. UNDERQUALIFIED TEST:")
print("Resume: Recent graduate")
print("Job: Senior position (5+ years)")

similarity_hybrid_2 = calculate_hybrid_semantic_similarity(resume_2, job_2)[0]
similarity_intelligent_2 = calculate_intelligent_semantic_similarity(resume_2, job_2)[0]

print(f"Hybrid similarity:        {similarity_hybrid_2:.3f}")
print(f"Intelligent similarity:   {similarity_intelligent_2:.3f}")
print(f"Change: {((similarity_intelligent_2 - similarity_hybrid_2) * 100):+.1f}%")

# Test Case 3: Overqualified candidate
resume_3 = "Principal engineer with 12 years experience leading teams and architecting systems. Expert in Python, Java, distributed systems, and cloud platforms."
job_3 = "Entry-level position suitable for recent graduates. Basic Python knowledge required. Will provide mentorship and training."

print("\n3. OVERQUALIFIED TEST:")
print("Resume: Principal engineer (12 years)")
print("Job: Entry-level position")

similarity_hybrid_3 = calculate_hybrid_semantic_similarity(resume_3, job_3)[0]
similarity_intelligent_3 = calculate_intelligent_semantic_similarity(resume_3, job_3)[0]

print(f"Hybrid similarity:        {similarity_hybrid_3:.3f}")
print(f"Intelligent similarity:   {similarity_intelligent_3:.3f}")
print(f"Change: {((similarity_intelligent_3 - similarity_hybrid_3) * 100):+.1f}%")

# Test Case 4: Slightly overqualified (should be positive)
resume_4 = "Senior engineer with 7 years experience in Python and team leadership."
job_4 = "Mid-level developer position requiring 3-5 years experience."

print("\n4. SLIGHTLY OVERQUALIFIED TEST:")
print("Resume: Senior engineer (7 years)")
print("Job: Mid-level position (3-5 years)")

similarity_hybrid_4 = calculate_hybrid_semantic_similarity(resume_4, job_4)[0]
similarity_intelligent_4 = calculate_intelligent_semantic_similarity(resume_4, job_4)[0]

print(f"Hybrid similarity:        {similarity_hybrid_4:.3f}")
print(f"Intelligent similarity:   {similarity_intelligent_4:.3f}")
print(f"Change: {((similarity_intelligent_4 - similarity_hybrid_4) * 100):+.1f}%")

print(f"\n=== EXPECTED RESULTS ===")
print(f"Good match: Should IMPROVE (+)")
print(f"Underqualified: Should DECREASE significantly (-)")
print(f"Overqualified: Should DECREASE (-)")
print(f"Slightly overqualified: Should IMPROVE slightly (+)")