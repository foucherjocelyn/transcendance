from django.contrib import admin
from .models import (
    User,
    Channel,
    Otp,
    UserMessage,
    ChannelMessage,
    Game,
    Friendship,
    ChannelBannedUser,
    ChannelInvitedUser,
    ChannelMutedUser,
    Tournament,
    GameScore,
    MutedUser,
    BannedUser,
    Notification,
)

# Register your models here.
admin.site.register(User)
admin.site.register(Channel)
admin.site.register(Otp)
admin.site.register(Game)
admin.site.register(UserMessage)
admin.site.register(ChannelMessage)
admin.site.register(Friendship)
admin.site.register(ChannelBannedUser)
admin.site.register(ChannelInvitedUser)
admin.site.register(ChannelMutedUser)
admin.site.register(Tournament)
admin.site.register(GameScore)
admin.site.register(MutedUser)
admin.site.register(BannedUser)
admin.site.register(Notification)
