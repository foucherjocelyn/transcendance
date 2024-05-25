export function display_countdown(number)
{
    const   countdownLayer = document.getElementById('countdownLayer');
    countdownLayer.style.display = 'flex';

    const   contentCountdown = document.querySelector('#countdownLayer > span')

    if (number === -1)
    {
        countdownLayer.style.display = 'none';
        if (document.getElementById('gameInstructionsLayer') !== null)
            document.getElementById('gameInstructionsLayer').style.display = 'none';
        if (document.getElementById('gameSettingPanel') !== null)
            document.getElementById('gameSettingPanel').style.display = 'none';
    }
    else if (number === 0)
        contentCountdown.textContent = "Start";
    else
        contentCountdown.textContent = number;
}
