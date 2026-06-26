import chromadb
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(
    path="./chroma_db"
)



embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)



def get_collection(repo_name):
    collection_name = (
        f"repo_{repo_name}"
        .lower()
        .replace("-", "_")
        .strip("_-.")
    )
    return client.get_or_create_collection(
        name=collection_name
    )

def index_chunks(
    repo_name,
    chunks
):
    collection = get_collection(
        repo_name
    )
    documents = []
    metadatas = []
    ids = []
    embeddings = []

    for chunk in chunks:
        documents.append(
            chunk["content"]
        )

        embedding = embedding_model.encode(
            chunk["content"]
        ).tolist()

        embeddings.append(
            embedding
        )

        metadatas.append({
            "path": chunk["path"],
            "filename": chunk["filename"],
            "extension": chunk["extension"],
            "chunk_type": chunk["chunk_type"],
            "symbol_name": str(
                chunk["symbol_name"]
            )
        })
        
        ids.append(
            chunk["chunk_id"]
        )

        
    try:
        print(
        f"Indexing {len(documents)} chunks into {collection.name}"
        )
        collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
    except Exception as e:
        print("Indexing Error:", e)



def search_repository(
    repo_name,
    query,
    top_k=5
):
    collection = get_collection(
        repo_name
    )

    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )

    return results