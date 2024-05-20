import { requestToken } from "./authentication.js";
import { notice } from "../authentication/auth_main.js";
import { getCookie } from "../authentication/auth_cookie.js";

export async function getOtpQR() {
	let f_username = {
		username: getCookie("username")
	};

	let f_token = getCookie("token");
	console.log(f_token);
	try {
		const response = await fetch("https://localhost/api/v1/auth/otp/qr-code", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		});
		if (!response.ok) {
			console.log("getOtpQR: Client/Server error");
			return;
		}
		const data = await response.blob();
		return URL.createObjectURL(data);
	}
	catch (error) {
		console.error("getOtpQR: ", error);
	}
}

export async function toggleOtpStatus() {
	let f_username = {
		username: getCookie("username")
	};

	try {
		const response = await fetch("https://localhost/api/v1/auth/otp/switch", {
			method: "POST",
			body: JSON.stringify(f_username),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${getCookie("token")}`
			}
		})
		if (!response.ok) {
			console.log("toggleOtp: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
	} catch (error) {
		console.error("toggleOtp: ", error);
	}
}

export async function sendOtp(connect_user) {
	console.log("-OTP request received");
	try {
		const response = await requestToken(connect_user);
		if (getCookie("token") === null || getCookie("token") === "")
			return;
		let f_token = getCookie("token");
		const r = await fetch("https://localhost/api/v1/auth/otp", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("sendOtp: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await response.json();
		notice("(debug)Your otp is displayed in the console", 3, "#37e6e6");
		console.log(`Your otp is: ${data.otp}`);
		console.log("-");
	} catch (error) {
		console.error("sendOtp: ", error);
	};

}

export async function getOtpStatusPw(f_log) {
	//    console.log("-getOtpStatusPw starting");
	//	console.log(f_log);
	try {
		const response = await fetch("https://localhost/api/v1/auth/otp/status", {
			method: "POST",
			body: JSON.stringify(f_log),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
			}
		});
		if (!response.ok) {
			console.log("response status = [" + response.status) + "]";
			return response.status;
		}
		const data = await response.json();
		return data.otpStatus;
	}
	catch (error) {
		console.error("getOtpStatusPw: ", error);
	}
	//	console.log("-");
	return (response);
}

export async function getOtpStatusToken() {
	//   console.log("-getOtpStatusToken starting");
	let f_token = getCookie("token");
	//    console.log(f_token);
	try {
		const response = await fetch("https://localhost/api/v1/auth/otp/status", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		});
		if (!response.ok) {
			console.log("getOtpStatusToken: Client/Server error");
			return response.status;
		}
		const data = await response.json();
		return data.otpStatus;
	}
	catch (error) {
		console.error("getOtpStatusToken: ", error);
	}
	//	console.log("-");
	return (response);
}
