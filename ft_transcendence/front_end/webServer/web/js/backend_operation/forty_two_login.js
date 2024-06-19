export async function	createAccount42Api(token42)
{
	console.log("-Creating account with 42 token");
	try {
		const response = await fetch("https://localhost:8000/api/v1/auth/login42", {
			method: "POST",
			body: JSON.stringify(token42),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
		});
		if (!response.ok) {
//			document.cookie = `token=; SameSite=Strict`;
			console.log("createAccount42Api: Client or Server error");
			throw new Error("fetch POST createAccount42Api");
		}
		const data = await response.json();
		console.log("createAccount42Api data = ");
		console.log(data);
		//console.log("New token generated:\n" + data.access);
		//document.cookie = `token=; SameSite=Strict`;
		//document.cookie = `token=${data.access}; SameSite=Strict`;
	} catch (error) {
		console.error("createAccount42Api: ", error);
	}
}

///*
export function request42Login() {
	let oauth2Endpoint = "https://api.intra.42.fr/oauth/authorize";

	let form = document.createElement('form');
	form.setAttribute('method', 'GET');
	form.setAttribute('action', oauth2Endpoint);

	let params = {
		"client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
		"redirect_uri": "https://127.0.0.1:5500/",
		"scope": "",
		"state": "pass-through-value",
		"response_type": "code"
	};

	for (var p in params) {
		let input = document.createElement("input");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', p);
		input.setAttribute('value', params[p]);
		form.appendChild(input);
	}

	document.body.appendChild(form);
	form.submit();
}

//*/

/*
const config = {
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "redirect_uri": "https://localhost:5500/#homepage",
	"scope": "",
    "response_type": "code",
    "state": "pass-through-value"
};

export async function request42Login() {
    const query = new URLSearchParams(config).toString();
    try {
        //const response = await fetch(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FOURTWO_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response}`, {
        const response = await fetch(`https://api.intra.42.fr/oauth/authorize?${query}`, {
			mode: "no-cors",
            method: "GET"
        })
		console.log("request42Login status =");
		console.log(response.status);
        if (!response.ok) {
            console.log("request42Login: Client/Server error");
            return;
        }
        const data = await response.json();
        //console.log("request42Login:");
        //console.log(data);
        //return (data);
    } catch (error) {
        console.error("request42Login: ", error);
    }
}
//*/