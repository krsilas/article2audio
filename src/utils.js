export async function fetchData(url = '', data = {}) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data)
    }) 
    return res.json()
}