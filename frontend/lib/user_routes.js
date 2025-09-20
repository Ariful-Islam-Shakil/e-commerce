const baseurl=process.env.NEXT_PUBLIC_API_BASE_URL;
export async function listUsers(){
    try{
        const response = await fetch(`${baseurl}/api/v1/users/`)
        if(!response.ok){
            throw new Error(`HTTP Error..! Status: ${response.ststus}`)
        }
        return await response.json();

    } catch(error){
        throw error;
    }
}

export async function getUserById(userId){
    const response = await fetch(`${baseurl}/api/v1/users/user/${userId}`);
    if(!response.ok){
        throw new Error(`HTTP Error..! Status: ${response.status}`)
    }
    return await response.json();
}

export async function createUser(userData){
    const response = await fetch(`${baseurl}/api/v1/users/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    if(!response.ok){
        throw new Error(`HTTPError..! Status: ${response.status}`);
    }
    return await response.json();
}