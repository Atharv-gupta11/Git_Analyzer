// Automatically use local Python server if running on localhost, otherwise use Hugging Face
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocalhost 
  ? "http://127.0.0.1:8000" 
  : "https://atharv1107-git-analyzer-backend.hf.space";

export const api = {
  cloneRepo: async (repoUrl) => {
    const response = await fetch(`${BASE_URL}/repositories?repo_url=${encodeURIComponent(repoUrl)}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to clone repository");
    return response.json();
  },

  getRepoStats: async (repoName) => {
    const response = await fetch(`${BASE_URL}/repos/${repoName}/stats`);
    if (!response.ok) throw new Error("Failed to fetch repo stats");
    return response.json();
  },

  indexRepo: async (repoName) => {
    const response = await fetch(`${BASE_URL}/repos/${repoName}/index`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to index repository");
    return response.json();
  },

  analyzeRepo: async (repoName, question) => {
    const response = await fetch(`${BASE_URL}/repos/${repoName}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("Failed to analyze repository");
    return response.json();
  }
};
