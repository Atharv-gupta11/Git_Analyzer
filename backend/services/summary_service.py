import os 
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from services.parser_service import (
    read_repository_files,
    IMPORTANT_FILENAMES
)
load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)



def generate_summary(repo_name):
    context=get_summary_context(repo_name)

    prompt = f"""
You are a senior software architect.

Analyze this repository.

Generate:

1. Project Purpose

2. Tech Stack

3. Main Features

4. Important Modules

5. High Level Architecture

Repository Content:

{context}
"""
    response = llm.invoke(
    prompt
)
    return response.content