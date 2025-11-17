# backend/chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage
from django.utils import timezone

def now_time():
    return timezone.localtime().strftime("%I:%M %p")

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "global_chat_room"
        # join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        # optional: send status
        await self.send_json({"type": "status", "data": {"message": "connected"}})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        try:
            payload = json.loads(text_data)
        except Exception:
            return

        # expect { type: "message"|"typing"|"mark_seen", payload: {...} }
        typ = payload.get("type")
        pl = payload.get("payload", {})

        if typ == "message":
            from_user = pl.get("from", "Anonymous")
            text = pl.get("text", "")
            time_str = pl.get("time") or now_time()

            # persist message
            msg = ChatMessage.objects.create(from_user=from_user, text=text, time=time_str)

            out = {
                "type": "message",
                "data": {
                    "id": str(msg.id),
                    "from_user": msg.from_user,
                    "text": msg.text,
                    "time": msg.time,
                    "created_at": msg.created_at.isoformat(),
                },
            }
            # broadcast to group
            await self.channel_layer.group_send(self.room_group_name, {"type": "chat.message", "message": out})

            # ack back to sender (optional)
            await self.send_json({"type": "ack", "data": {"id": str(msg.id)}})

        elif typ == "typing":
            from_user = pl.get("from", "Someone")
            await self.channel_layer.group_send(self.room_group_name, {"type": "chat.typing", "message": {"from": from_user}})

        elif typ == "mark_seen":
            ids = pl.get("ids", [])
            if ids:
                ChatMessage.objects.filter(id__in=ids).update(seen=True)
                await self.channel_layer.group_send(self.room_group_name, {"type": "chat.seen", "message": {"ids": ids}})

    # Called by group_send for message
    async def chat_message(self, event):
        # event['message'] is the full payload we created above
        await self.send(text_data=json.dumps(event["message"]))

    async def chat_typing(self, event):
        await self.send(text_data=json.dumps({"type": "typing", "data": event["message"]}))

    async def chat_seen(self, event):
        await self.send(text_data=json.dumps({"type": "seen", "data": event["message"]}))
