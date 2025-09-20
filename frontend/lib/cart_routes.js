const baseurl=process.env.NEXT_PUBLIC_API_BASE_URL;
export async function listCarts(token){ 
    const response = await fetch(`${baseurl}/api/v1/cart/`, {
        method: 'GET',
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if(!response.ok){
        throw new Error(`HTTP Error..! Status: ${response.status}`);
    }
    return await response.json();
}

export async function addToCart(token, cartData){
    const response = await fetch(`${baseurl}/api/v1/cart/items`, {
        method: 'POST',
        headers: { 
            accept: "application/json",
            "Content-Type": "application/json", // ✅ needed for JSON body
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartData)
    })
    if(!response.ok){
        throw new Error(`HTTP Error..! Status: ${response.status}`);    
    }
    return await response.json();
}

export async function removeCartItem(token, productID){
    const response = await fetch(`${baseurl}/api/v1/cart/items/${productID}`,{
        method: 'DELETE',
        headers:{
            accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    });
    if(!response.ok){
        throw new Error(`HTTP Error..! Status: ${response.status}`);    
    }
    return await response.json();

}

export async function clearCart(token){
    const response = await fetch(`${baseurl}/api/v1/cart/`,{
        method: 'DELETE',
        headers:{
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    if(!response.ok){
        throw new Error(`HTTP Error..! Status: ${response.status}`);    
    }
    return await response.json();
}

export async function updateCartItem(token, productID, quantity) {
    const response = await fetch(`${baseurl}/api/v1/cart/items/${productID}?quantity=${quantity}`, {
        method: 'PUT',
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP Error..! Status: ${response.status}`);
    }

    return await response.json();
}