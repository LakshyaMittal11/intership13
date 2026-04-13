const BASE_URL = "https://your-backend.onrender.com"; // change after deploy

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(BASE_URL + "/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  alert("Registered!");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  localStorage.setItem("token", data.token);

  window.location.href = "dashboard.html";
}

async function loadDashboard() {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + "/dashboard", {
    headers: {
      "authorization": token
    }
  });

  const data = await res.text();
  document.getElementById("data").innerText = data;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}