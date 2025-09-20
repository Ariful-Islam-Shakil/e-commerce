const baseurl=process.env.NEXT_PUBLIC_API_BASE_URL;
export async function login(credentials){
    const formBody = new URLSearchParams({
        grant_type: 'password',
        username: credentials.email,
        password: credentials.password,
        scope: credentials.scope || "",
        client_id: credentials.client_id || "string",
        client_secret: credentials.client_secret || "********",
    });

    const response = await fetch(`${baseurl}/api/v1/auth/login/`,{
        method: 'POST',
        headers:{
            'Content-Type': "application/x-www-form-urlencoded",
            accept: 'application/json',
        },
        body: formBody.toString(),
    });
    if(!response.ok){
        const errorText = await response.text();
        throw new Error(`HTTP Error..! Status: ${response.status} - ${errorText}`);
    }
    return await response.json();
}