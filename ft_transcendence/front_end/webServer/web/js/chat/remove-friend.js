import { getListFriendInvitationSent, getListFriendInvitationsReceived, updateFriendInviteStatus } from "../backend_operation/friend_invite.js";

export const removeFriend = async (friendUsername) => {
    if (confirm(`Are you sure want to remove ${friendUsername} from your friends ?`)) {
        const listInviteSent = await getListFriendInvitationSent();
        const listInviteReceived = await getListFriendInvitationsReceived();

        listInviteSent;
        listInviteReceived;
        const listInvite = [...listInviteSent].concat(...listInviteReceived);
        const invite = listInvite.find(invite => (invite.receiver_username === friendUsername || invite.sender_username === friendUsername) && invite.status === "accepted");
        if (invite)
            updateFriendInviteStatus(invite.id, "rejected");
        else
            console.log(`error: cannot remove ${friendUsername} from friends`)
    }
}