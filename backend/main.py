from fastapi import FastAPI
from services.git_service import clone_repoository
from services.parser_service import get_repository_files
from services.parser_service import read_repository_files

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

@app.get("/files")
def get_files(repo_name:str):
    repo_path = f"./repos/{repo_name}"

    files=get_repository_files(repo_path)

    return {
        "count":len(files),
        "files":files
    }

@app.get("/repository-stats")
def get_file_content(repo_name:str):
    repo_path = f"./repos/{repo_name}"

    docs=read_repository_files(repo_path)

    return {
        "total_files":len(docs),
        "total_characters":sum(
            len(doc["content"])
            for doc in docs
        )
    }