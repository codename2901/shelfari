from django.db import models

class Book(models.Model):
    message = models.CharField(max_length=140)
    author = models.CharField(max_length=50, default="Dummy Author")
    flag =models.CharField(max_length=7, default="Unread")
