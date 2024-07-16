from firebase_functions import https_fn
from firebase_admin import initialize_app, messaging

initialize_app()


@https_fn.on_call()
def subscribe(request: https_fn.CallableRequest) -> dict:
    token = request.data["token"]
    topic = request.data["topic"]
    messaging.subscribe_to_topic([token], topic)
    return {"status": "OK"}


@https_fn.on_call()
def unsubscribe(request: https_fn.CallableRequest) -> dict:
    token = request.data["token"]
    topic = request.data["topic"]
    messaging.unsubscribe_from_topic([token], topic)
    return {"status": "OK"}


@https_fn.on_call()
def send(request: https_fn.CallableRequest) -> dict:
    topic = request.data["topic"]
    notification = request.data.get("notification")
    data = request.data["data"]
    messaging.send(
        messaging.Message(
            topic=topic,
            data=data,
            notification=messaging.Notification(**notification) if notification else None,
        )
    )
    return {"status": "OK"}
