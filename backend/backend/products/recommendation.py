
import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId, errors as bson_errors
import re

# 🔗 MongoDB bağlantısı
MONGO_URI = "mongodb+srv://bitirmeprojesi:hudairembanu246@bitirmeprojesi.1znfq.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["bitirme_db"]

# 🔹 Sadece "katalog" koleksiyonu kullanılacak
collection = db["katalog"]

def get_user_products(email):
    user = db.user.find_one({"email": email})
    print("💾 [DEBUG] Kullanıcı verisi:", user)

    if not user:
        return []

    favorites = user.get("favorites", [])
    viewed = user.get("viewed_products", [])
    print("🎯 [DEBUG] Favorites:", favorites)
    print("👀 [DEBUG] Viewed:", viewed)

    raw_ids = favorites + viewed
    cleaned_ids = []

    for i in raw_ids:
        try:
            if isinstance(i, ObjectId):
                cleaned_ids.append(i)
            elif isinstance(i, str):
                if len(i) == 24 and all(c in "0123456789abcdef" for c in i.lower()):
                    cleaned_ids.append(ObjectId(i))
                elif "ObjectId" in i:
                    match = re.search(r"ObjectId\(['\"]([a-fA-F0-9]{24})['\"]\)", i)
                    if match:
                        cleaned_ids.append(ObjectId(match.group(1)))
        except bson_errors.InvalidId:
            continue

    items = list(collection.find({"_id": {"$in": cleaned_ids}}))
    print("📦 [DEBUG] Eşleşen ürün sayısı:", len(items))
    return items

def get_all_products():
    return list(collection.find({}))

def build_recommendations(user_email, top_k=5):
    user_products = get_user_products(user_email)
    all_products = get_all_products()

    if not user_products:
        return {"error": "Kullanıcının favori veya gezdiği ürünü yok."}

    df_all = pd.DataFrame(all_products)
    df_user = pd.DataFrame(user_products)

    # 🔐 Eksik 'category' gibi sütunlar varsa hata vermemesi için kontrol
    required_cols = [
        "name", "category", "color", "fabric_type", "pattern", "closure_type",
        "button_count", "collar_type", "sleeve_type", "cut", "lining", "filling",
        "functional_features", "fit", "fabric_detail", "texture", "design", "length"
    ]
    for col in required_cols:
        if col not in df_all.columns:
            df_all[col] = ""
        if col not in df_user.columns:
            df_user[col] = ""

    # 🔠 Özellikleri birleştir
    for df in [df_all, df_user]:
        df["combined_features"] = df.fillna("").apply(
            lambda row: " ".join([str(row.get(col, "")) for col in required_cols]),
            axis=1
        )

    # 🎯 TF-IDF ve Kosinüs Benzerlik
    tfidf = TfidfVectorizer()
    tfidf_matrix_all = tfidf.fit_transform(df_all["combined_features"])
    tfidf_matrix_user = tfidf.transform(df_user["combined_features"])

    similarity = cosine_similarity(tfidf_matrix_user, tfidf_matrix_all).mean(axis=0)
    df_all["similarity"] = similarity

    top_results = df_all.sort_values(by="similarity", ascending=False).head(top_k)

    # 🛠 ObjectId JSON'a çevrilemez -> string'e çevir
    results = top_results[["_id", "name", "category", "price", "images", "similarity"]].copy()
    results["_id"] = results["_id"].apply(str)

    return results.to_dict(orient="records")
