
from mongoengine import Document, StringField, URLField, ListField

class Product(Document):
    meta = {'collection': 'katalog'}  # MongoDB'deki koleksiyon adı
    name = StringField(required=True)  # Ürün ismi
    price = StringField(required=True)  # Fiyat
    # images = URLField(required=True)  # Görsel URL'si
    images = ListField(URLField(), required=True)

class Elbise(Document):
    meta = {'collection': 'elbise'}
    name = StringField(required=True)
    price = StringField(required=True)
    images = ListField(URLField(), required=True)

class Pantolon(Document):
    meta = {'collection': 'pantolon'}  # Pantolon koleksiyonu
    name = StringField(required=True)  # Ürün ismi
    price = StringField(required=True)  # Fiyat
    images = ListField(URLField(), required=True)  # Görseller

