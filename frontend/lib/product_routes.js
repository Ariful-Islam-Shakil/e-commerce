const baseurl=process.env.NEXT_PUBLIC_API_BASE_URL;
export async function listProducts(){
    const response = await fetch(`${baseurl}/api/v1/products/`);
    if(!response.ok){
        throw new Error(`HTTP error..! Status: ${response.status}`);
    }
    return await response.json();
}

export async function addPruduct(productData){
    const response = await fetch(`${baseurl}/api/v1/products/`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    if(!response.ok){
        throw new Error(`HTTP Error..! Status: ${response.status}`);
    }
    return await response.json();
}
