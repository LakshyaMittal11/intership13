const BASE_URL = "https://intership13.onrender.com";

// Signup
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE_URL + "/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.text();
  alert(data);
}

// Login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!data.token) {
    alert(data.message || "Login failed ❌");
    return;
  }

  localStorage.setItem("token", data.token);
  window.location.href = "dashboard.html";
}

// Dashboard
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

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}