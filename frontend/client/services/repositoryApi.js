import api from "./api";
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

export const cloneRepository = (repoUrl) =>
    api.post("/repositories", null, {
        params: {
            repo_url: repoUrl,
        },
    });

export const indexRepository = (repoName) =>
    api.post(`/repos/${repoName}/index`);

export const analyzeRepository = (repoName, question) =>
    api.post(`/repos/${repoName}/analyze`, {
        question,
    });