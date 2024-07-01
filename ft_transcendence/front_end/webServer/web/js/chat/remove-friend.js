import { getListFriendInvitationSent, getListFriendInvitationsReceived, updateFriendInviteStatus } from "../backend_operation/friend_invite.js";
import { postNotification } from "../backend_operation/notification.js";
import { client, dataToServer } from "../client/client.js";
import { searchFriendList } from "./friend-list.js";

export const removeFriend = async (friendUsername) => {
    if (confirm(`Are you sure want to remove ${friendUsername} from your friends ?`)) {
        const listInviteSent = await getListFriendInvitationSent();
        const listInviteReceived = await getListFriendInvitationsReceived();

        listInviteSent;
        listInviteReceived;
        const listInvite = [...listInviteSent].concat(...listInviteReceived);
        const invite = listInvite.find(invite => (invite.receiver_username === friendUsername || invite.sender_username === friendUsername) && invite.status === "accepted");
        if (invite) {
            await updateFriendInviteStatus(invite.id, "rejected");
            searchFriendList();
            await postNotification({ username: friendUsername, content: `${client.inforUser.username} removed you from friend list` });
            let sendData = new dataToServer('notification', '', client.listUser.find(user => user.username === friendUsername));
            client.socket.send(JSON.stringify(sendData));
            sendData = new dataToServer('remove friend', '', client.listUser.find(user => user.username === friendUsername));
            client.socket.send(JSON.stringify(sendData));
        } else
            console.log(`error: cannot remove ${friendUsername} from friends`)
    }
}