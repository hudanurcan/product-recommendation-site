from mongoengine import Document, StringField, EmailField, BooleanField, ListField, ObjectIdField

# mongoEngine ile User sınıfı oluşturuldu. bu sınıf sayesinde mongodb'de user koleksiyonu oluşturuldu

class User(Document):
    first_name = StringField(required=True, max_length=50)  
    last_name = StringField(required=True, max_length=50)   
    email = EmailField(required=True, unique=True)          # benzersiz 
    password = StringField(required=True, min_length=8)     
    phone_number = StringField(required=True, unique=True, max_length=10)  #  (0 olmadan)
    is_active = BooleanField(default=True)                  # Kullanıcı aktiflik durumu
    favorites = ListField(ObjectIdField())  # Kullanıcının favori ürünlerini saklamak için
    #viewed_products = ListField(ObjectIdField())  # Kullanıcının görüntülediği ürünleri saklamak için

    def __str__(self):
        return self.email
