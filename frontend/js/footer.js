function loadFooter() {
  const footer = document.createElement("footer");
  footer.setAttribute("data-aos", "fade-up");
  footer.className = "bg-gray-900 text-white py-8 mt-12";
  footer.innerHTML = `
    <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
      <div class="text-center md:text-left">
        <p class="text-lg font-semibold">Empowering Wealth Creation through Code</p>
      </div>
      <div class="text-center md:text-left space-y-1">
        <p>Email: <a href="mailto:contact@pythoncourse.com" class="hover:underline text-blue-300">contact@pythoncourse.com</a></p>
        <p>Phone: <a href="tel:+84123456789" class="hover:underline text-blue-300">+84 123 456 789</a></p>
      </div>
      <div class="text-center md:text-right">
        <p class="text-sm">&copy; 2025 Python Course Platform. All Rights Reserved.</p>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

document.addEventListener("DOMContentLoaded", loadFooter);
