/*
export async function   authorizeLogin42()
{
    const   response = await fetch(`https://api.intra.42.fr/oauth/authorize${formattedinfo}`, {
        method: "GET"
    })
    if (!response.ok) {
        console.log("The aL42 failed");
        return ;
    }
    ;
}

export async function   requestToken42()
{
    const   response = await fetch(`https://api.intra.42.fr/oauth/token`, {
        method: "POST",
        headers: {
         "grant_type": grant_type,
         "client_id": client_id,
         "client_secret": client_secret,
         "code": code,
         "redirect_uri": redirect_uri,
         "state": state
        }
    });
}
*/