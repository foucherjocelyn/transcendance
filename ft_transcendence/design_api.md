# Table of content

-   [Authentication](#authentication)
-   [Users](#users)
-   [Channels](#channels)
-   [Friendships](#friendship)
-   [User Messages](#user-messages)
-   [Games](#games)
-   [Tournaments](#tournaments)
-   [Notifications](#notifications)
-   [Objects](#objects)

## Per modules

-   **Tokens**

    -   [Create new Bearer token](#create-new-bearer-token)
    -   [Refresh access token](#refresh-access-token)

-   **Auth**

    -   [Login](#login)
    -   [Register](#register)
    -   [Logout](#logout)
    -   [Switch OTP status](#switch-otp-status)
    -   [Post OTP status](#post-otp-status)
    -   [Get OTP status](#get-otp-status)
    -   [Get OTP code](#get-otp-code)
    -   [Check OTP code](#check-otp-code)
    -   [Get an OTP QR code](#get-otp-qr-code)

-   **Users**

    -   [List users](#list-users)
    -   [Retrieve a user by id](#retrieve-a-user)
    -   [Get user_id by username](#get-user-id-by-username)
    -   [Get information about yourself](#get-my-profile)
    -   [Update my profile](#update-my-profile)
    -   [Get my profile avatar](#get-my-profile-avatar)
    -   [Upload my profile avatar](#upload-my-profile-avatar)

-   **Channels**

    -   [Create a channel](#create-channel)
    -   [List channels are seen by user](#list-channels-by-user)
    -   [Get a channel are seen by user](#get-a-channel-by-user)
    -   [Update a channel by owner](#update-channel-by-owner)
    -   [Add new admin by owner](#add-new-admin-by-owner)
    -   [Remove admin by owner](#remove-admin-by-owner)
    -   [Join a channel](#join-a-channel)
    -   [Leave a channel](#leave-a-channel)
    -   [Ban a user in a channel by admin](#ban-a-user-in-channel-by-admin)
    -   [Unban a user in a channel by admin](#unban-a-user-in-channel-by-admin)
    -   [Mute user in a channel by admin](#mute-user-in-channel-by-admin)
    -   [Unmute user in a channel by admin](#unmute-user-in-channel-by-admin)
    -   [Invite user in a channel by admin](#invite-user-in-channel-by-admin)
    -   [Update the user's invitation status](#update-users-invitation-status)
    -   [Send a message in a channel](#send-message-in-channel)
    -   [Get a list of user messages in a channel](#get-list-users-messages-in-channel)
    -   [Update the content of a message](#update-the-content-of-a-message)
    -   [Get a list last 50 messages in a channel](#get-list-last-50-messages-in-channel)

-   **Friendship**

    -   [Invite a user to be a friend](#invite-user-to-be-friend)
    -   [Update the status of user's invitation](#update-status-of-users-invitation)
    -   [Get a list of friend invitations sent by a user](#get-list-of-friend-invitations-sent-by-an-user)
    -   [Get a list of friend invitations received by a user](#get-list-of-friend-invitations-received-by-an-user)
    -   [Get list of friends of a user](#get-list-of-friends-of-a-user)
    -   [Ban user from sending a friend invitation](#ban-user-from-sending-a-friend-invitation)
    -   [Unban user from sending a friend invitation](#unban-user-from-sending-a-friend-invitation)
    -   [Mute user from sending private messages](#mute-user-from-sending-private-messages)
    -   [Unmute user from sending private messages](#unmute-user-from-sending-private-messages)

-   **User Messages**

    -   [Send a message to a friend](#send-a-message-to-a-friend)
    -   [Get list of last 50 messages sent to a friend](#get-list-of-last-50-messages-sent-to-a-friend)
    -   [Get list of last 50 messages received from a friend](#get-list-of-last-50-messages-received-from-a-friend)
    -   [Update the content of a message](#update-the-content-of-a-message)

-   **Games**

    -   [Create a new game](#create-a-new-game)
    -   [Get a game by game id](#get-a-game-by-game-id)
    -   [Add a new player to a game](#add-a-new-player-to-a-game)
    -   [Remove a player from a game](#remove-a-player-from-a-game)
    -   [End a game](#end-a-game)
    -   [Add score of a player](#add-score-of-a-player)
    -   [Level up the winner](#level-up-the-winner)
    -   [List all my games](#list-all-my-games)
    -   [List all my scores](#list-all-my-scores)

-   **Tournaments**

    -   [Create a new tournament](#create-a-new-tournament)
    -   [Get a tournament by tournament id](#get-a-tournament-by-tournament-id)
    -   [Update tournament by id](#update-tournament-by-id)
    -   [List all tournaments](#list-all-tournaments)

-   **Notifications**
    -   [Create a new notification](#create-a-new-notification)
    -   [List all notifications](#list-all-notifications)
    -   [Make a notification as read](#make-a-notification-as-read)

# Authentication

For every route, except `/register`, `/login` and `/otp/status` you need to provide a Bearer token in the request headers.

```
authorization: Bearer <token>
```

## Create new Bearer token

Create new access token and refresh token for a user

```typescript
POST /api/v1/token
{
	username: string,
	password: string,
}
```

### Return

```typescript
{
	refresh: string,
	access: string
}
```

## Refresh access token

When the access token expires, you can use the refresh token to get a new access token.

```typescript
POST / api / v1 / token / refresh;
{
    refresh: string;
}
```

### Return

```typescript
{
    access: string;
}
```

## Login

```typescript
POST /api/v1/auth/login
{
	username: string,
	password: string,
	otp: string (optional)
}
```

Login with this username, password and an optional TOTP

### Return

```typescript
{
	message: string
	refresh: string,
	access: string
}
```

## Register

```typescript
POST /api/v1/auth/register
{
	username: string,
	password: string,
	email: string,
	first_name: string,(optional)
	last_name: string(optional)
}
```

### Return

-   The message object ([Message](#message))

Register a user if it doesn't exist

## Logout

```typescript
POST /api/v1/auth/logout
authorization Bearer <token>
```

### Return

-   The message object ([Message](#message))

## Switch OTP status

```typescript
POST /api/v1/auth/otp/switch
authorization Bearer <token>
```

### Return

```typescript
{
    otpStatus: boolean;
}
```

Switch OTP status: true -> false, false -> true

## Post OTP status

Anyone can get OTP status with a username and password

```typescript
POST /api/v1/auth/otp/status
{
	username: string,
	password: string
}
```

### Return

```typescript
{
    otpStatus: boolean;
}
```

## Get OTP status

Only authenticated user can get OTP status

```typescript
GET /api/v1/auth/otp/status
authorization Bearer <token>
```

### Return

```typescript
{
    otpStatus: boolean;
}
```

## Get OTP code

```typescript
GET /api/v1/auth/otp
authorization Bearer <token>
```

### Return

```typescript
{
    otp: string;
}
```

Get OTP of a user

## Check OTP code

```typescript
POST /api/v1/auth/otp/check
{
	otp: string
}
authorization Bearer <token>
```

### Return

```typescript
{
    message: string;
}
```

Check OTP of a user

## Get OTP QR code

```typescript
GET /api/v1/auth/otp/qr-code
authorization Bearer <token>
```

### Return

-   The OTP QR code ([QRCode](#qrcode)) type image/png

# Users

## List users

Return a list users registered in the system

```typescript
GET /api/v1/users
authorization Bearer <token>
```

### Return

-   A list of users ([User](#user))

## Retrieve a user by id

Return a specific user registered in the system by provided id

```typescript
GET /api/v1/users/<user_id>
authorization Bearer <token>
```

### Return

-   The user object ([User](#user))

## Get user id by username

```typescript
GET /api/v1/users/id/<str:username>
authorization Bearer <token>
```

### Return

````typescript
{
	user_id: number
}

## Get my profile

```typescript
GET /api/v1/profile/me
authorization Bearer <token>
````

### Return

-   The user profile ([User](#user))

## Update my profile

```typescript
PUT /api/v1/profile/me
authorization Bearer <token>
{
	... new data ...(not include level)
}
```

### Return

-   The updated user profile ([User](#user))

## Get my profile avatar

```
GET /api/v1/profile/me/avatar
authorization Bearer <token>
```

### Return

-   The user's profile avatar ([UserAvatar](#useravatar))

Retrieve the user's profile avatar from backend storage

## Upload my profile avatar

```typescript
POST /api/v1/profile/me/avatar
authorization Bearer <token>
avatar: File
```

### Return

```typescript
{
    message: string;
}
```

Upload a profile avatar, save it in the backend and update the user's avetarPath in the database

For frontend implementation, see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_a_file

# Channels

Public channel: every user can see it and join it.
Private channel: only the members and invited users can see it. Only invited users can join it.

## Create channel

```typescript
POST /api/v1/channel/create
authorization Bearer <token>
{
	name: string,
	visibility: 'public' | 'private',//optional
	password: string, //optional
}
```

### Return

```typescript
{
    message: string;
}
```

Create a new channel for a user. The user will be the owner of the channel and be added to the list of admins and members

## List channels by user

```typescript
GET /api/v1/channel/list
authorization Bearer <token>
```

### Return

-   A list of channel objects ([Channel](#channel))

List every channel the user can see: public channels, channels in which the user is invited or is a member

## Get a channel by user

```
GET /api/v1/channel/<channel_id>
authorization Bearer <token>
```

### Return

-   The channel object ([Channel](#channel))

## Update channel by owner

Only the channel's owner can update the channel1

```typescript
PUT /api/v1/channel/<channel_id>
authorization Bearer <token>
{
	name: string, // optionnal
	visibility: 'public' | 'private', // optionnal
	password: string // optionnal
}
```

### Return

-   The updated channel object ([Channel](#channel))

Update the name, visibility or password of a channel by an admin

## Add new admin by owner

Only the channel's owner can add a user as an admin and the user must be a member of the channel and isn't already an admin of the channel

```typescript
POST /api/v1/channel/<channel_id>/admin/add
authorization Bearer <token>
{
	username: string
}
```

### Return

```typescript
{
    message: string;
}
```

## Remove admin by owner

Only the channel's owner can remove a user as an admin. The user must be an admin of the channel

```typescript
POST /api/v1/channel/<channel_id>/admin/remove
authorization Bearer <token>
{
	username: string
}
```

### Return

```typescript
{
    message: string;
}
```

## Join a channel

Every one can join a public channel. Only invited users can join a private channel. If user is banned from the channel,
he can't join it. The user have to provide a password to join if the channel's password is set. The user will be added
to the list of members of the channel.

```typescript
POST /api/v1/channel/<channel_id>/join
authorization Bearer <token>
```

### Return

-   The joined channel object ([Channel](#channel))

## Leave a channel

Only members can leave a channel. If the user is a admin of this channel, he is removed from the list of admins and members.

```typescript
POST /api/v1/channel/<channel_id>/leave
authorization Bearer <token>
```

### Return

-   The leaved channel object ([Channel](#channel))

## Ban a user in channel by admin

You must be an admin to ban a user from a channel. If this user is actually a member of the channel, he will be removed
from the list of members. You can't ban an admin or owner of the channel. If until is not provided, until will be set to
the Max Date.

```typescript
POST /api/v1/channel/<channel_id>/member/ban
authorization Bearer <token>
{
	username: string
	until: string // ISO date format YYYY-MM-DD // optional
	reason: string // optional
}
```

### Return

-   The channel banned user object ([ChannelBannedUser](#channelbanneduser))

## Unban a user in channel by admin

You must be an admin to unban a user from a channel. If the user isn't on the banned list, an error will be raised. The
until field will be update to the Min Date.

```typescript
POST /api/v1/channel/<channel_id>/member/unban
authorization Bearer <token>
{
	username: string
}
```

### Return

-   The updated banned user object ([ChannelBannedUser](#channelbanneduser))

## Mute user in the channel by admin

You must be an admin to mute a user from a channel. The owner and admin can't be muted. If until is not provided, until
will be set to the Max Date.

```typescript
POST /api/v1/channel/<channel_id>/member/mute
authorization Bearer <token>
{
	username: string
	until: string // ISO date format YYYY-MM-DD // optional
	reason: string // optional
}
```

### Return

-   The channel muted user object ([ChannelMutedUser](#channelmuteduser))

## Unmute user in channel by admin

You must be an admin to unmute a user from a channel. If the user isn't muted, error will be raised. The until field will
be update to the Min Date.

```typescript
POST /api/v1/channel/<channel_id>/member/unmute
authorization Bearer <token>
{
	username: string
}
```

### Return

-   The updated channel muted user object ([ChannelMutedUser](#channelmuteduser))

## Invite user in channel by admin

Only channel's admin can invite users in the channel.

```typescript
POST /api/v1/channel/<channel_id>/member/invite
authorization Bearer <token>
{
	username: string
}
```

### Return

-   The invited user object ([ChannelInvitedUser](#channelinviteduser))

## Update user's invitation status

Only channel's admin can update status of user's invitation.

```typescript
PUT /api/v1/channel/<channel_id>/member/invite
authorization Bearer <token>
{
	username: string,
	status: string // 'accepted' | 'pending' | 'rejected'
}
```

### Return

-   The updated invited user object ([ChannelInvitedUser](#channelinviteduser))

## Send message in channel

The sender and receiver must be members of the channel

```typescript
POST /api/v1/channel/<channel_id>/message
authorization Bearer <token>
{
	content: string
}
```

### Return

-   A ChannelMessage object ([ChannelMessage](#channelmessage))

## Get list user's messages in channel

Display a list of messages in channel sent by the user

```typescript
GET /api/v1/channel/<channel_id>/message
authorization Bearer <token>
```

### Return

-   A list of ChannelMessage objects ([ChannelMessage](#channelmessage))

## Update the content of a message

Only the sender of the message can update the content of the message

```typescript
PUT /api/v1/channel/<channel_id>/message/<message_id>
authorization Bearer <token>
{
	content: string
}
```

### Return

-   The updated ChannelMessage object ([ChannelMessage](#channelmessage))

## Get list last 50 messages in channel

```typescript
GET /api/v1/channel/<channel_id>/message/last
authorization Bearer <token>
```

### Return

-   A list of ChannelMessage objects ([ChannelMessage](#channelmessage))

# Friendships

## Invite user to be friend

If the user is already friend, error will be raised. If the user is banned from another user, error will be raised.
Otherwise a new friendship will be created.

```typescript
POST /api/v1/user/friendship/invite
authorization Bearer <token>
{
	username: string
}
```

### Return

-   A Friendship object ([Friendship](#friendship))

## Update status of user's invitation

Only receiver of the invitation can update status of user's invitation.

```typescript
PUT /api/v1/user/friendship/<friendship_id>/status
authorization Bearer <token>
{
	status: string // 'accepted' | 'pending' | 'rejected'
}
```

### Return

-   A updated Friendship object ([Friendship](#friendship))

## Get list of friend invitations sent by a user

```typescript
GET /api/v1/user/friendship/sent
authorization Bearer <token>
```

### Return

-   A list of Invitation objects ([Invitation](#invitation))

## Get list of friend invitations received by a user

```typescript
GET /api/v1/user/friendship/received
authorization Bearer <token>
```

### Return

-   A list of Invitation objects ([Invitation](#invitation))

## Get list of friends of a user

Return a list of User objects ([User](#user)) where the status field in (Friendship](#friendship) is 'accepted'.

```typescript
GET /api/v1/user/friendship
authorization Bearer <token>
```

### Return

-   A list of User object ([User](#user))

## Ban user from sending a friend invitation

If the user is already banned, error will be raised. Otherwise a new bannedUser will be created or updated. If the until
field is not set, it will be set to the Max Date.

```typescript
POST /api/v1/user/friendship/ban
authorization Bearer <token>
{
	username: string,
	until: string, // YYYY-MM-DD // optional
	reason: string // optional
}
```

### Return

-   A BannedUser object ([BannedUser](#banneduser))

## Unban user from sending a friend invitation

If the user is not banned, error will be raised. If the until field is not set, it will be set to the Min Date.

```typescript
POST /api/v1/user/friendship/unban
authorization Bearer <token>
{
	"username": string
}
```

### Return

-   An updated bannedUser object ([BannedUser](#banneduser))

## Mute user from sending private messages

```typescript
POST /api/v1/user/friendship/mute
authorization Bearer <token>
{
	username: string,
	until: string, // YYYY-MM-DD // optional
	reason: string // optional
}
```

### Return

-   A MutedUser object ([MutedUser](#muteduser))

## Unmute user from sending private messages

```typescript
POST /api/v1/user/friendship/unmute
authorization Bearer <token>
{
	username: string
}
```

### Return

-   A updated MutedUser object ([MutedUser](#muteduser))

# User messages

## Send a message to a friend

Only friend can send a message to a friend

```typescript
POST /api/v1/user/friend/message
authorization Bearer <token>
{
	username: string,
	content: string
}
```

### Return

-   A UserMessage object ([UserMessage](#usermessage))

## Get list of last 50 messages sent to a friend

```typescript
GET /api/v1/user/friend/<friend_id>/message/sent
authorization Bearer <token>
```

### Return

-   A list of UserMessage objects ([UserMessage](#usermessage))

## Get list of last 50 messages received from a friend

```typescript
GET /api/v1/user/friend/<friend_id>/message/received
authorization Bearer <token>
```

### Return

-   A list of UserMessage objects ([UserMessage](#usermessage))

## Update the content of a message

Only the sender of the message and provide correctly friend_id and message_id can update the content of the message

```typescript
PUT /api/v1/user/friend/<friend_id>/message/<message_id>
authorization Bearer <token>
{
	content: string
}
```

### Return

-   A updated UserMessage object ([UserMessage](#usermessage))

# Games

## Create a new game

Create a new game. The game will be created as visibility: 'public', mode: 'classic', status: 'progressing' and maxScore: 5.
Only the websocket server is allowed access.

```typescript
POST /api/v1/game
authorization Bearer <token>
{
	owner_username: string,
	visibility: "public" | "private";// optional,default: 'public'
	mode: "classic" | "ranked" | "tournament";// optional, default: 'classic'
	tournament_name: string;// optional
	maxScore: number;// optional
	status: "progressing" | "end";// optional
}
```

### Return

-   The new game object ([Game](#game))

## Get a game by game id

Provide game information based on the provided game ID. Only the websocket server is allowed access.

```typescript
GET /api/v1/game/<game_id>
authorization Bearer <token>
```

### Return

-   The game object ([Game](#game))

## Add a new player to a game

Add a new player to a game. Only the websocket server is allowed access.

```typescript
POST /api/v1/game/<game_id>/player/add
authorization Bearer <token>
{
	username: string
}
```

### Return

-   The updated game object ([Game](#game))

## Remove a player from a game

Remove a player from a game. Only the owner of the game can remove a player.

```typescript
POST /api/v1/game/<game_id>/player/remove
authorization Bearer <token>
{
	username: string
}
```

### Return

-   The updated game object ([Game](#game))

## End a game

End a game. Only the websocket server is allowed access.

```typescript
POST /api/v1/game/<game_id>/end
authorization Bearer <token>
```

### Return

-   The updated game object ([Game](#game))

## Add score of a player

Add a player's score. Only the websocket server is allowed access. The AI's score will be disregarded. The winner's
score will be automatically updated.

```typescript
POST /api/v1/game/<game_id>/score
authorization Bearer <token>
{
	username: string,
	score: number
}
```

### Return

-   The ([Message](#message)) if success or ([Error](#error)) if error raised

## Level up the winner

Level up the winner. Only the websocket server is allowed access.

```typescript
POST /api/v1/game/<game_id>/winner/levelup
authorization Bearer <token>
```

### Return

-   The ([Message](#message)) if success or ([Error](#error)) if error raised


## List all my games

Return a list of all games that the user is a player of. Only the player can see their games.

```typescript
GET /api/v1/game/me
authorization Bearer <token>
```

### Return

-   A list of game objects ([Game](#game))


## List all my scores

Return a list of all scores that the user obtained. Only the player can see their scores.

# Tournaments

## Create a new tournament

Only admin of the site can create or remove a new tournament.

```typescript
POST /api/v1/tournament/create
authorization Bearer <token>
{
	name: string,
	description: string, // optional
	start_date: Date, // Format: YYYY-MM-DD
	end_date: Date, // Format: YYYY-MM-DD
}
```

### Return

-   The new tournament object ([Tournament](#tournament))

## Join a tournament

The authenticated user can join a tournament if the tournament's status is 'ongoing'.

```typescript
POST /api/v1/tournament/<tournament_id>/join
authorization Bearer <token>
```

### Return

-   The tournament object ([Tournament](#tournament))

## Get a tournament by tournament id

Provide tournament information based on the provided tournament ID. Every on authenticated user is allowed access.

```typescript
GET /api/v1/tournament/<tournament_id>
authorization Bearer <token>
```

### Return

-   The tournament object ([Tournament](#tournament))

## Update tournament by id

Only admin of the site can update a tournament.

```typescript
PUT /api/v1/tournament/<tournament_id>
authorization Bearer <token>
{
	name: string,
	description: string, // optional
	start_date: Date, // Format: YYYY-MM-DD
	end_date: Date, // Format: YYYY-MM-DD
	status: "upcoming" | "ongoing" | "completed", // optional
}
```

### Return

-   The updated tournament object ([Tournament](#tournament))

## List all tournaments

Get information of all tournaments. Every on authenticated user is allowed access.

```typescript
GET /api/v1/tournament/list
authorization Bearer <token>
```

### Return

-   A list of tournament objects ([Tournament](#tournament))

# Notifications

## Create a new notification

```typescript
POST /api/v1/notification/create
authorization Bearer <token>
{
	username: string,
	content: string
}
```

### Return

-   The new notification object ([Notification](#notification))

## List all notifications

```typescript
GET /api/v1/notification/list
authorization Bearer <token>
```

### Return

-   A list of notification objects ([Notification](#notification))

## Make a notification as read

```typescript
POST /api/v1/notification/<notification_id>/read
authorization Bearer <token>
```

### Return

-   The updated notification object ([Notification](#notification))

# Objects

## Message

```typescript
{
    messages: string;
}
```

## Error

```typescript
{
    error: string;
}
```

## Token

```typescript
{
	refresh: string,
	access: string
}
```

## User

```typescript
{
	id: number,
	username: string,
	first_name: string,
	last_name: string,
	emaill: string,
	level: number,
	status: 'online' | 'offline',
	avatarPath: string,
	last_login: Datetime,
	created_at: Datetime,
	updated_at: Datetime
	nb_games: number,
	avg_score: number
}
```

## Friendship

```typescript
{
	id: number,
	sender_username: string,
	receiver_username: string,
	status: 'pending' | 'accepted' | 'rejected',
	created_at: Datetime
	updated_at: Datetime
}
```

## BannedUser

```typescript
{
	id: number,
	sender_username: string,
	receiver_username: string,
	until: Date,
	bannedReason: string,
	created_at: Date,
	updated_at: Date
}
```

## MutedUser

```typescript
{
	id: number,
	sender_username: string,
	receiver_username: string,
	until: Date,
	mutedReason: string,
	created_at: Date,
	updated_at: Date
}
```

## UserMessage

```typescript
{
	id: number,
	sender_username: string,
	receiver_username: string,
	content: string,
	created_at: Date,
	updated_at: Date
}
```
