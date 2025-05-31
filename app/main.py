from fastapi import FastAPI

app = FastAPI(title="Resume Job Scoring Engine", version="1.0.0")

@app.get("/")
def root():
    return {"message": "Resume Job Scoring Engine API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}