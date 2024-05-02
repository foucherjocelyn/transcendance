from django.contrib import admin
from .models import User, Channel, Otp, UserMessage, ChannelMessage, Game, Friendship

# Register your models here.
admin.site.register(User)
admin.site.register(Channel)
admin.site.register(Otp)
admin.site.register(Game)
admin.site.register(UserMessage)
admin.site.register(ChannelMessage)
admin.site.register(Friendship)
