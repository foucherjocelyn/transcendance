function disableUpperPanel()
{
    let upper_panel = document.getElementById("h_upperpanel");
    
    if (upper_panel)
        upper_panel.outerHTML = `
    <div id="h_upperpanel">
    <nav class="h_upperpanel">
        <button id="h_to_home_disable" name="to_homepage" class="h_upperpanel_button"></button>
        <button id="h_to_game_disable" name="to_game" class="h_upperpanel_button"></button>
        <button id="h_to_tournament_disable" name="to_tournament" class="h_upperpanel_button"></button>
        <button id="h_to_myprofile_disable" name="to_myprofile" class="h_upperpanel_button"></button>
        <button id="h_logout_disable" name="logout" class="h_upperpanel_button"></button>
    </nav>
</div>
`;
}

function tournamentReadyDisable()
{
    let host_start = document.getElementById("twr_owner_start_button");
    let host_delete = document.getElementById("twr_owner_delete_button");
    if (host_start && host_delete) {
        host_start.outerHTML = `<input type="button" id="twr_owner_start_button_disabled" class="button-img_disabled" value="Start Tournament">`;
        host_delete.outerHTML = `<input type="button" id="twr_owner_delete_button_disabled" class="button-img_disabled" value="Delete Tournament">`;
    }
    let leave_button = document.getElementById("twr_leave");
    let back_button = document.getElementById("twr_back");
    if (leave_button && back_button) {
        leave_button.outerHTML = `<input type="button" id="twr_leave_disabled" class="button-img_disabled" value="Unregister">`;
        back_button.outerHTML = `<input type="button" id="twr_back_disabled" class="button-img_disabled" value="Back">`;
    }
}

export function readyUpPlayer() {
    tournamentReadyDisable();
    disableUpperPanel();
}