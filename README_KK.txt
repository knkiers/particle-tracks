Taken from:

https://thinkster.io/django-angularjs-tutorial

Boilerplate taken from github:

https://github.com/brwr/thinkster-django-angular-boilerplate

Followed the installation instructions, but had to make a few small
modifications:

$ git clone git@github.com:brwr/thinkster-django-angular-boilerplate.git
$ mkvirtualenv thinkster-djangular
$ cd thinkster-django-angular-boilerplate/
$ pip install -r requirements.txt
$ sudo npm install -g bower
$ sudo npm install
$ sudo bower install --allow-root

Then I made some modifications to the boilerplate code:
- changed the name of the project folder form boilerplate... to particle_tracks
- made some path name edits inside of urls.py, wsgi.py, and settings.py
  within the particle_tracks project folder
- edited the path in manage.py, as well

$ python manage.py migrate
$ python manage.py runserver

Made some edits in index.html and navbar.html to get rid of 'Not Google Plus,' etc.

Then I selectively followed the instructions at https://thinkster.io/django-angularjs-tutorial
to set up the authentication and profile stuff.  I had already done the tutorial, so I was able
to just copy over many of the required files.
