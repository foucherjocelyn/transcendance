function	getCookie(search_value)
{
	let	cookie = document.cookie.split(";");
	let new_str = null;

	for (let i = 0; i < cookie.length; i++)
	{
		let temp = cookie[i].trim();
		if (temp.startsWith(search_value + "="))
		{
			new_str = temp.replace(search_value + "=", "");
			return (new_str);
		}
	}
	return (new_str);
}

function	showCookie()
{
	let	cookie = document.cookie.split(";");

	for (let i = 0; i < cookie.length; i++)
	{
		console.log(cookie[i]);
	}
}

function	deleteAllCookie()
{
	let	cookie = document.cookie.split(";");
	
	for (var i = 0; i < cookie.length; i++)
	{
		let current_cookie = cookie[i];
		let equal = current_cookie.indexOf("=");
		let newcookie = equal > -1 ? cookie.substr(0, equal) : cookie;
		document.cookie = newcookie + "=;expires=Thu, 01 Jan 1999 00:00:00 GMT;path=/";
    }
}
