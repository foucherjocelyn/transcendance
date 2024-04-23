function notice(str, time, color)
{
	const messageInform = document.querySelector(".r_successinfo");
	messageInform.style.color = color;
	messageInform.innerText = str;
	messageInform.classList.remove("hide");
	let cdId = setInterval(function() {
		if (time === -1)
		{
			messageInform.classList.add("hide");
			clearInterval(cdId);
		}
		messageInform.innerText = str + " (" + time + ")";
		time--;
		}, 1000);
}

function	authCheck()
{
	console.log("---authCheck(): Checking if user is connected");
	console.log("The user is " + getCookie("status"));
//	drawHomePage();
//	/*
	if (getCookie("status") === "offline")
		document.cookie = "token=; SameSite=Strict";
	//	getMyInfo();
	console.log("The token is [" + getCookie("token") + "]");
	if (getCookie("token") != null && getCookie("token") != "" && getCookie("status") === "online")
	{//add securite
		drawHomePage();
	}
	else
	{
		to_connectForm();
	}
//*/
	console.log("---");
}

/*
function clearInputs(elemName) {
	var divElem = document.querySelector(elemName);
	var inputElem = divElem.getElementsByTagName("input");

	for (var i = 0; i < inputElem.length; i++) {
		if (inputElem[i].type != "submit" && inputElem[i].type != "button")
        inputElem[i].value = "";
    }
}
*/

addEventListener("DOMContentLoaded", authCheck);
