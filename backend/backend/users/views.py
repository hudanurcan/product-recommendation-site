from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
import json
from werkzeug.security import generate_password_hash, check_password_hash


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
