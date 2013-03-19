from tastypie.api import Api
from resources import BookResource

v1 = Api("v1")
v1.register(BookResource())
