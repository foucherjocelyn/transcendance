function    get_list_control_player(control)
{
    const valuesArray = [];

    for (const player in control)
    {
        const keys = control[player];

        for (const key in keys) {
            valuesArray.push(keys[key]);
        }
    }
    return valuesArray;
}

function    get_list_duplicates_control(list)
{
    const seenPositions = {};
    const duplicates = [];

    for (let i = 0; i < list.length; i++) {
        const element = list[i];

        if (seenPositions[element] !== undefined) {
            seenPositions[element].push(i);
            duplicates.push(i);
        } else {
            seenPositions[element] = [i];
        }
    }
    return duplicates;
}

function    check_game_settings_control(oldGameSettings, newGameSettings)
{
    let control1 = oldGameSettings.control;
    let control2 = newGameSettings.control;

    let   list1 = get_list_control_player(control1);
    let   list2 = get_list_control_player(control2);

    if (list2.length !== list1.length) {
        return false;
    }

    for (let i = 0; i < list2.length; i++)
    {
        if (list2[i].length !== 1) {
            return false;
        }
    }

    let   duplicates = get_list_duplicates_control(list2);
    if (duplicates.length !== 0) {
        Object.assign(control2, control1);
    }

    return true;
}

module.exports = {
    check_game_settings_control
};
