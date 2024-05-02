export function	getCookie(search_value)
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

export function	showCookie()
{
	let	cookie = document.cookie.split(";");

	for (let i = 0; i < cookie.length; i++)
	{
		console.log(cookie[i]);
	}
}


export function	deleteAllCookie()
{
	let cookies = document.cookie.split(";");
	
	for (let i = 0; i < cookies.length; i++)
	{
		let cookie = cookies[i];
		let eqPos = cookie.indexOf("=");
		let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}
