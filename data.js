async function loadData() {
    let response = await axios.request({method: 'GET',
  url: 'https://data.fixer.io/api/latest
    ? access_key = API_KEY',
  headers: { 'Custom-Header': 'value' }});
  console.log(response.data);
  return response.data; 
}

