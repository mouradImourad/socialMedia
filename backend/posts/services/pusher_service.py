# services/pusher_service.py

import pusher
from django.conf import settings

# Initialize Pusher client
pusher_client = pusher.Pusher(
    app_id=settings.PUSHER_APP_ID,
    key=settings.PUSHER_KEY,
    secret=settings.PUSHER_SECRET,
    cluster=settings.PUSHER_CLUSTER,
    ssl=settings.PUSHER_SSL
)

def trigger_event(channel, event, data):
    try:
        pusher_client.trigger(channel, event, data)
    except Exception as e:
        print(f"Pusher error: {e}")
