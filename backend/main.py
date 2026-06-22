from fastapi import FastAPI
from services.git_service import clone_repoository

app = FastAPI()

@app.get("/")
def home():
    return {"message": "GitHub Project Analyzer"}


@app.post("/clone")
def clone_repo(repo_url:str):

    result=clone_repoository(repo_url)

    return {
        "success":True,
        "data":result
    }