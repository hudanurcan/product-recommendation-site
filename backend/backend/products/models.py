# from django.db import models

# class Product(models.Model):
#     name = models.CharField(max_length=255, null=True, blank=True)  # NULL değerlerine izin ver
#     price = models.CharField(max_length=100, null=True, blank=True)
#     images = models.URLField(null=True, blank=True)

#     def __str__(self):
#         return self.name
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

