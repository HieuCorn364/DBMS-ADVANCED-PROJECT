function loadHeader() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token; // Kiểm tra trạng thái đăng nhập

  const header = document.createElement("header");
  header.innerHTML = `
    <div class="container mx-auto flex justify-between items-center px-6">
      <div class="logo">Python Course Platform</div>
      <div class="menu-icon lg:hidden" onclick="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav class="menu hidden lg:flex lg:items-center">
        <a href="index.html">Home</a>
        <a href="courses.html">Courses</a>
        ${isLoggedIn ? "" : '<a href="login.html">Login</a>'}
        ${isLoggedIn ? "" : '<a href="register.html">Register</a>'}
        <a href="profile.html">Profile</a>
        ${isLoggedIn ? '<a href="#" onclick="logout()">Logout</a>' : ""}
      </nav>
    </div>
  `;
  document.body.prepend(header);
}

function toggleMenu() {
  const menu = document.querySelector(".menu");
  const menuIcon = document.querySelector(".menu-icon");
  menu.classList.toggle("active");
  menuIcon.classList.toggle("active");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
  loadHeader(); // Tải lại header để cập nhật nút
}

document.addEventListener("DOMContentLoaded", loadHeader);
