from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from books.models import Book

class BookResource(ModelResource):
    class Meta:
        queryset = Book.objects.all()
        #authorization = DjangoAuthorization()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post', 'put', 'delete']
        detail_allowed_methods = ['get','post', 'put', 'delete']
