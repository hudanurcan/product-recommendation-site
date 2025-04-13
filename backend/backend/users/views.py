from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
import json
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId, json_util
from products.models import Product  


@csrf_exempt
def register(request):
# Bu fonksiyon, istemciden gelen JSON verisini alır, doğrularve mongodb'deki user koleksiyonuna kaydeder.    
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # JSON verisini alır. (Kullanıcıdan gelen JSON verisini request.body ile al ve json.loads ile Python dict formatına çevirdi)
            # Kullanıcıyı oluştur
            user = User(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                password=generate_password_hash(data['password']),  # Şifre hashlendi
                phone_number=data['phone_number']
            )
            user.save()  # MongoDB'ye kaydeder
            return JsonResponse({"message": "Kayıt başarılı!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Yalnızca POST istekleri kabul edilir!"}, status=405)

# @csrf_exempt
# def login(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)  # JSON verisini alır. Kullanıcıdan gelen email ve password bilgilerini JSON formatında alır.
#             email = data['email']
#             password = data['password']

#             # Kullanıcıyı bul
#             user = User.objects(email=email).first()
#             if user and check_password_hash(user.password, password):
#                 return JsonResponse({"message": "Giriş başarılı!"}, status=200)
#             else:
#                 return JsonResponse({"error": "Geçersiz email veya şifre!"}, status=401)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)
#     return JsonResponse({"error": "Yalnızca POST istekleri kabul edilir!"}, status=405)
@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # JSON verisini alır. Kullanıcıdan gelen email ve password bilgilerini JSON formatında alır.
            email = data['email']
            password = data['password']

            # Kullanıcıyı bul
            user = User.objects(email=email).first()
            if user and check_password_hash(user.password, password):
                # ID'yi döndürüyoruz
                return JsonResponse({
                    "message": "Giriş başarılı!",
                    "name" : user.first_name,
                    "user_id": str(user.id),  # Kullanıcı ID'sini döndür
                    "email": user.email,  # Kullanıcı email'ini döndür
                }, status=200)
            else:
                return JsonResponse({"error": "Geçersiz email veya şifre!"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Yalnızca POST istekleri kabul edilir!"}, status=405)


@csrf_exempt  # CSRF doğrulamasını devre dışı bırakır
def add_remove_favorite(request):
    try:
        data = json.loads(request.body)
        user_id = data['user_id']
        product_id = data['product_id']
        action = data['action']

        # Verileri kontrol etmek için eklenen print komutları
        print("user_id:", user_id)
        print("product_id:", product_id)

        # Kullanıcıyı ve ürünü alırken ObjectId formatını kontrol edin
        if not ObjectId.is_valid(user_id):
            return JsonResponse({"error": "Geçersiz kullanıcı ID'si"}, status=400)

        if not ObjectId.is_valid(product_id):
            return JsonResponse({"error": "Geçersiz ürün ID'si"}, status=400)
        
        user = User.objects(id=user_id).first()

        if not user:
            return JsonResponse({"error": "Kullanıcı bulunamadı"}, status=404)
        
        if action == 'add':
            if product_id not in user.favorites:
                user.update(push__favorites=product_id)
                return JsonResponse({"message": "Ürün favorilere eklendi"}, status=200)
            else:
                return JsonResponse({"message": "Ürün zaten favorilerde"}, status=400)
        
        elif action == 'remove':
            if product_id in [str(fav) for fav in user.favorites]:  # MongoDB ObjectId'lerini string ile karşılaştır
                user.update(pull__favorites=product_id)
                return JsonResponse({"message": "Ürün favorilerden çıkarıldı"}, status=200)
            else:
                return JsonResponse({"message": "Ürün favorilerde değil"}, status=400)
        else:
            return JsonResponse({"error": "Geçersiz işlem türü"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


@csrf_exempt
def get_favorites(request, user_id):
    try:
        # Kullanıcıyı veritabanından çekiyoruz
        user = User.objects.get(id=user_id)

        # Kullanıcı favorisindeki ürünleri almak
        favorites = user.favorites  # Bu sadece ObjectId'leri içeriyor

        # Favori ürünleri alalım
        favorite_products = []
        for fav_id in favorites:
            product = Product.objects.get(id=fav_id)  # Product modelini doğru kullanın
            favorite_products.append({
                "product_id": str(product.id),
                "product_name": product.name,  # İlgili ürün adı
                "product_price": product.price,  
                "product_image": product.images
                
            })

        # Favorileri JSON formatında döndürüyoruz
       # favorites_json = json_util.dumps(favorite_products, default=json_util.default)
        print(f"Favoriler JSON verisi: {favorite_products}")  # Gelen favorileri burada yazdırın
        return JsonResponse({'favorites': favorite_products}, safe=False, status=200)
    
    except User.DoesNotExist:
        return JsonResponse({"error": "Kullanıcı bulunamadı."}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def favorites(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            product_id = data.get('product_id')
            action = data.get('action')

            user = User.objects.get(id=user_id)

            if action == 'add':
                if product_id not in user.favorites:
                    user.favorites.append(product_id)
                    user.save()
                    return JsonResponse({"message": "Ürün favorilere eklendi."}, status=200)
                else:
                    return JsonResponse({"message": "Bu ürün zaten favorilerde."}, status=200)

            elif action == 'remove':
                if product_id in user.favorites:
                    user.favorites.remove(product_id)
                    user.save()
                    return JsonResponse({"message": "Ürün favorilerden çıkarıldı."}, status=200)
                else:
                    return JsonResponse({"message": "Ürün zaten favorilerde değil."}, status=200)

            else:
                return JsonResponse({"error": "Geçersiz işlem."}, status=400)

        except User.DoesNotExist:
            return JsonResponse({"error": "Kullanıcı bulunamadı."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Sadece POST isteklerine izin verilir."}, status=405)
