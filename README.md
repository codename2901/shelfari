Shelfari 1.0
-----------------------

[Go to the App] (http://codename2901.pythonanywhere.com)

This is an example application using Django, with the help of [django-tastypie](https://github.com/toastdriven/django-tastypie), and [backbone.js](https://github.com/documentcloud/backbone). Its a 
simple CRUD application to Add/Read/Update/Delete a resource ( Book in this case).

THe primary objective of building this app was to understand the working of Backbone.js and its integration with a databse backed 
Server side framework by writing a simple RESTful API for use with Backbone's router.

Running locally
---------------

Please note, I have used Djang 1.3.2 as the latest Django 1.5 has some issues with its lookup seperator, which is causing issues 
with the ROA.

    git clone https://github.com/codename2901/shelfari.git
    cd final_app/shelfari
    pip install -r requirements.txt
    ./manage.py syncdb --noinput
    ./manage.py runserver
