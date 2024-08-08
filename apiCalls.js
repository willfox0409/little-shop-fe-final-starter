// Your fetch requests will live here
const base = 'http://localhost:3000/api/v1/'

function fetchData(endpoint) {
  return fetch(base + endpoint)
    .then(res => {
      return res.json()
    })  
  
}

function postData(endpoint, body) {
  return fetch(base + endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}

function deleteData(endpoint) {
  return fetch(base + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
}

function editData(endpoint, body) {
  return fetch(base + endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
// await fetch("https://example.org/post", {
//   method: "POST",
//   body: JSON.stringify({ username: "example" }),
//   headers: myHeaders,
// });

export {
  fetchData,
  postData,
  deleteData,
  editData
}

