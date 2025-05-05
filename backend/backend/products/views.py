from django.shortcuts import render
from django.http import JsonResponse

from django.http import JsonResponse
from .models import Product, Elbise, Pantolon  
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from .models import Product, Elbise
from users.models import User
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from .recommendation import build_recommendations  

# Create your views here.
from django.http import JsonResponse
from .models import Product,Elbise

def product_list(request):
    # MongoDB'den tüm ürünleri çek
    products = Product.objects()  # MongoEngine üzerinden ürünleri getir
    data = [
        {
            'id': str(product.id),  # MongoDB'nin `_id` alanını string'e çeviriyoruz ??????
            "name": product.name,
            "price": product.price,
            "images": product.images,
        }
        for product in products
    ]
    return JsonResponse(data, safe=False)

def product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product_data = {
            'id': str(product.id),
            'name': product.name,
            'price': product.price,
            'images': product.images,
        }
        return JsonResponse(product_data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    

def elbise_products(request):
    products = Elbise.objects.all() 
    data = [
        {
            "id": str(product.id),
            "name": product.name,
            "price": product.price,
            "images": product.images,
        }
        for product in products
    ]
    return JsonResponse(data, safe=False)



def product_by_category(request, category):
    if category.lower() == 'elbise':  # Elbise kategorisi
        products = Elbise.objects.all()
    elif category.lower() == 'pantolon':  # Pantolon kategorisi
        products = Pantolon.objects.all()
    else:  # Default olarak katalog koleksiyonu
        products = Product.objects.filter(category=category)

    data = [
        {
            "id": str(product.id),
            "name": product.name,
            "price": product.price,
            "images": product.images,
        }
        for product in products
    ]
    return JsonResponse(data, safe=False)

# MongoDB'deki tüm koleksiyonlardan ürünleri getir
@csrf_exempt
def tum_urunleri_getir(request):
    client = MongoClient("mongodb+srv://clusterName:password@clusterName.1znfq.mongodb.net/?retryWrites=true&w=majority&appName=clusterName")
    db = client["vt"]
    kategori_koleksiyonlari = [
        "Kelsbiseler", "Epantolonlar", "Egomlek-tshirt",
        "Ekazak-hirka", "Kdis-giyim", "Edis-giyim",
        "Khirka-kazak", "Kgomlek-bluz", "Kpantolonlar"
    ]

    tum_urunler = []

    for koleksiyon_adi in kategori_koleksiyonlari:
        urunler = db[koleksiyon_adi].find({})
        tum_urunler.extend([{
            "id": str(urun["_id"]),
            "name": urun.get("name"),
            "price": urun.get("price", ""),
            "images": urun.get("images", [])
        } for urun in urunler])

    return JsonResponse(tum_urunler, safe=False)

# Belirli kategoriye göre ürünleri getir
def product_by_category(request, category):
    if category.lower() == 'elbise':
        products = Elbise.objects.all()
    else:
        products = Product.objects.filter(category=category)

    data = [{
        "id": str(product.id),
        "name": product.name,
        "price": product.price,
        "images": product.images,
    } for product in products]

    return JsonResponse(data, safe=False)

#  Görüntülenen ürünlere göre öneri (veri Product modelinden gelmeli)
@csrf_exempt
def recommend_based_on_viewed(request):
    body = json.loads(request.body)
    viewed_product_ids = body.get('viewed_products', [])

    if not viewed_product_ids:
        return JsonResponse({'error': 'Gezilen ürün IDleri gönderilmedi'}, status=400)

    viewed_products = Product.objects(id__in=viewed_product_ids)
    all_products = Product.objects()

    def feature_vector(product):
        try:
            price_cleaned = str(product.price).replace(".", "").replace(",", ".").replace("TL", "").strip()
            price = float(price_cleaned)
        except:
            price = 0.0
        return np.array([price, len(product.images)])

    viewed_vectors = np.array([feature_vector(p) for p in viewed_products])
    all_vectors = np.array([feature_vector(p) for p in all_products])

    similarities = cosine_similarity(viewed_vectors, all_vectors).mean(axis=0)

    recommendations = sorted(
        zip(all_products, similarities),
        key=lambda x: x[1],
        reverse=True
    )

    top_recommendations = [
        {
            'id': str(rec[0].id),
            'name': rec[0].name,
            'price': rec[0].price,
            'images': rec[0].images,
            'similarity': round(float(rec[1]), 3)
        }
        for rec in recommendations[:5]
    ]

    return JsonResponse(top_recommendations, safe=False)

# Katalog koleksiyonları için içerik tabanlı öneri
@csrf_exempt
def content_based_recommendation(request, email):
    if request.method == "GET":
        results = build_recommendations(email, top_k=5)
        return JsonResponse({"recommendations": results}, safe=False)
    return JsonResponse({"error": "Sadece GET destekleniyor."}, status=405)

@csrf_exempt
def recommend_based_on_favorites(request, email):
    if request.method == "GET":
        # Kullanıcıya ait favorilere dayalı ürün önerisi al
        recommendations = build_recommendations(email, top_k=5)

        recommended_products = []
        for product in recommendations:
            # MongoDB'den ürünleri çek
            catalog_product = Product.objects(id=product['_id']).first()

            if catalog_product:
                # Eğer ürün resim URL'si boşsa, varsayılan bir resim ekleyin
                product_image = catalog_product.images[0] if catalog_product.images else "default_image_url"
                
                recommended_products.append({
                    "id": str(catalog_product.id),  # MongoDB'nin id'sini string'e çevir
                    "product_name": catalog_product.name,
                    "product_price": catalog_product.price,
                    "product_image": catalog_product.images  # İlk resim URL'si
                })
        
        return JsonResponse({"recommendations": recommended_products}, safe=False)

    return JsonResponse({"error": "Sadece GET destekleniyor."}, status=405)
