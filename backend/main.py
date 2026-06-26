from fastapi import FastAPI

from services.git_service import clone_repoository
from services.parser_service import get_repository_files
from services.parser_service import read_repository_files
from services.chunking_service import chunk_documents
from services.vector_store_service import  index_chunks
from services.vector_store_service import  search_repository
from services.llm_service import  ask_repository
from services.summary_service import generate_summary
from services.repository_service import process_repository_query
from services.analysis_service import generate_analysis
from pydantic import BaseModel


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/")
def home():
    return {"message": "GitHub Project Analyzer"}


@app.post("/repositories")
def clone_repo(repo_url:str):

    result=clone_repoository(repo_url)
    if result.get("success") is False:
        return {"success": False, "error": result.get("error")}
    return {
        "success":True,
        "data":result
    }

@app.get("/repos/{repo_name}/files")
def get_files(repo_name:str):
    repo_path = f"./repos/{repo_name}"

    files=get_repository_files(repo_path)

    return {
        "count":len(files),
        "files":files
    }

@app.get("/repos/{repo_name}/stats")
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


@app.get("/repos/{repo_name}/sample-chunks")
def generate_chunks(repo_name:str):
    repo_path = f"./repos/{repo_name}"

    docs=read_repository_files(repo_path)

    chunks=chunk_documents(docs)

    return{
        "total_documents": len(docs),
        "total_chunks": len(chunks)
    }

@app.get("/sample-chunks")
def sample_chunks(repo_name:str):
    repo_path = f"./repos/{repo_name}"

    docs = read_repository_files(repo_path)

    chunks = chunk_documents(docs)

    return chunks[:5]
    
@app.post("/repos/{repo_name}/index")
def index_repository(repo_name:str):
    repo_path = f"./repos/{repo_name}"

    docs=read_repository_files(repo_path)

    chunks = chunk_documents(
        docs
    )

    index_chunks(
        repo_name,
        chunks
    )

    return {
        "documents": len(docs),
        "chunks": len(chunks)
    }


@app.get("/repos/{repo_name}/search")
def search_repo(
    repo_name: str,
    query: str
):

    results = search_repository(
        repo_name,
        query
    )
    return results

class AnalyzeRequest(BaseModel):
    question: str

class AnalyzeResponse(BaseModel):
    intent: str
    answer: str
    sources: list
    
@app.post(
    "/repos/{repo_name}/analyze",
    response_model=AnalyzeResponse
)
def analyze_repository(
    repo_name: str,
    request: AnalyzeRequest
):
    return process_repository_query(
    repo_name,
    request.question
)
