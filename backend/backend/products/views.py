from django.shortcuts import render

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
    
# def elbise_products(request):
#     # MongoDB'deki "Product" koleksiyonuna erişim
#     products = Product.objects(category="Kadın", subcategory="Elbise")  # Kategoriyi filtrele

#     # Verileri JSON formatına dönüştür
#     data = [
#         {
#             "id": str(product.id),  # MongoDB ObjectId'yi string'e çeviriyoruz
#             "name": product.name,
#             "price": product.price,
#             "images": product.images,
#         }
#         for product in products
#     ]

#     return JsonResponse(data, safe=False) # liste döndürüldüğü için false

def elbise_products(request):
    products = Elbise.objects.all()  # Elbise koleksiyonunu kullanır
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

from django.http import JsonResponse

from django.http import JsonResponse
from .models import Product, Elbise, Pantolon  # Tüm koleksiyon modellerini ekle

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

