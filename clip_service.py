from fastapi import FastAPI
from pydantic import BaseModel
import requests
from PIL import Image
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

database_url = os.getenv("DATABASE")
database_name = os.getenv("DATABASE_NAME")
products_coll = os.getenv("PRODUCT_COLLECTIONS")

client = MongoClient(database_url)  
db = client[database_name]  
products_collection = db[products_coll]


class ImageRequest(BaseModel):
    image_url: str

@app.post("/get-embedding")
async def get_embedding(data: ImageRequest):
    try:
        # download image
        response = requests.get(data.image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        # CLIP proccessing
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)

        # Normalize vector
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        vector = image_features[0].tolist()

        return {"embedding": vector}

    except Exception as e:
        return {"error": str(e)}


@app.post("/find-similar-images")
async def find_similar_images(data: ImageRequest):
    try:
        response = requests.get(data.image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            query_image_features = model.get_image_features(**inputs)

        query_image_features = query_image_features / query_image_features.norm(p=2, dim=-1, keepdim=True)

        stored_images = products_collection.find() 
        similarity_results = []
        similarity_threshold = float(os.getenv("SIMILARITY_THRESHOLD", 0.7))


        for product in stored_images:
            for img in product['images']:
                stored_embedding = img.get('embedding')

                if stored_embedding:
                    # our cosine similarity
                    similarity_score = cosine_similarity([query_image_features[0].tolist()], [stored_embedding])[0][0]
                    if similarity_score > similarity_threshold:
                        similarity_results.append({
                            'image_url': img['url'],
                            'similarity_score': similarity_score,
                            'product_id': str(product['_id'])  
                        })

        # Sorting
        sorted_results = sorted(similarity_results, key=lambda x: x['similarity_score'], reverse=True)

        # Return top 5 most similar images
        return {"similar_images": sorted_results[:5]}

    except Exception as e:
        return {"error": str(e)}