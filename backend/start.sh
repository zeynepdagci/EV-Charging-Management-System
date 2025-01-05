#!/bin/bash

# Start Celery workers in the background
service redis-server start &

celery -A myproject worker --loglevel=info &

# Start the Django server
daphne -b 0.0.0.0 -p 8000 myproject.asgi:application
