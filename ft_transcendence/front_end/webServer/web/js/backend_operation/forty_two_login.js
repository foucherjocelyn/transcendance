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