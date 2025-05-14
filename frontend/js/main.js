const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  console.log(`Sending request to: ${API_BASE_URL}${endpoint}`);
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  console.log("Response status:", response.status);
  return response.json();
}

async function register(event) {
  event.preventDefault();
  const userData = {
    Username: document.getElementById("username").value,
    Email: document.getElementById("email").value,
    Password: document.getElementById("password").value,
    FullName: document.getElementById("fullname").value,
  };
  const result = await apiRequest("/auth/register", "POST", userData);
  const messageEl = document.getElementById("registerMessage");
  if (result.message) {
    messageEl.textContent = "Registration successful! Please login.";
    messageEl.style.color = "green";
  } else {
    messageEl.textContent = result.error || "Registration failed";
    messageEl.style.color = "red";
  }
}

async function login(event) {
  event.preventDefault();
  const userData = {
    Email: document.getElementById("email").value,
    Password: document.getElementById("password").value,
  };
  const result = await apiRequest("/auth/login", "POST", userData);
  const messageEl = document.getElementById("loginMessage");
  if (result.token) {
    localStorage.setItem("token", result.token);
    messageEl.textContent = "Login successful! Redirecting...";
    messageEl.style.color = "green";
    // Cập nhật header sau khi đăng nhập
    loadHeader();
    setTimeout(() => (window.location.href = "courses.html"), 1000);
  } else {
    messageEl.textContent = result.error || "Login failed";
    messageEl.style.color = "red";
  }
}

// Đảm bảo logout có thể được gọi từ header.js
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
  loadHeader();
}

async function loadCourses() {
  const courses = await apiRequest("/courses");
  const courseList = document.getElementById("courseList");
  courseList.innerHTML = "";
  courses.forEach((course) => {
    const div = document.createElement("div");
    div.className = "course-card";
    div.innerHTML = `
      <h3><a href="course.html?id=${course._id}">${course.Title}</a></h3>
      <p>${course.Description}</p>
      <p>Instructor: ${course.InstructorId.FullName}</p>
    `;
    courseList.appendChild(div);
  });
}

async function loadCourse() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  if (!courseId) return;
  const course = await apiRequest(`/courses/${courseId}`);
  document.getElementById("courseTitle").textContent = course.Title;
  document.getElementById("courseDescription").textContent = course.Description;
  const lessonList = document.getElementById("lessonList");
  course.Lessons.forEach((lesson) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${lesson.title} <button onclick="completeLesson('${courseId}', '${lesson.lessonId}')">Complete</button>
    `;
    lessonList.appendChild(li);
  });
  const quizzes = await apiRequest(
    `/quizzes?courseId=${courseId}`,
    "GET",
    null,
    localStorage.getItem("token")
  );
  const quizList = document.getElementById("quizList");
  quizzes.forEach((quiz) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="quiz.html?id=${quiz._id}">${quiz.Title}</a>`;
    quizList.appendChild(li);
  });
}

async function enrollCourse() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  const result = await apiRequest(
    "/enrollments",
    "POST",
    { CourseId: courseId },
    localStorage.getItem("token")
  );
  alert(result.message || result.error);
}

async function completeLesson(courseId, lessonId) {
  const result = await apiRequest(
    "/enrollments/progress",
    "PUT",
    {
      CourseId: courseId,
      lessonId,
      completed: true,
    },
    localStorage.getItem("token")
  );
  alert(result.message || result.error);
}

async function loadQuiz() {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("id");
  if (!quizId) return;
  const quiz = await apiRequest(
    `/quizzes/${quizId}`,
    "GET",
    null,
    localStorage.getItem("token")
  );
  document.getElementById("quizTitle").textContent = quiz.Title;
  const quizForm = document.getElementById("quizForm");
  quiz.Questions.forEach((question, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${question.content}</p>
      ${question.options
        .map(
          (option, i) => `
        <label><input type="radio" name="question${index}" value="${i}" required> ${option}</label><br>
      `
        )
        .join("")}
    `;
    quizForm.appendChild(div);
  });
  quizForm.onsubmit = async (event) => {
    event.preventDefault();
    const answers = quiz.Questions.map((q, index) => ({
      questionId: q.questionId,
      selectedAnswer: parseInt(
        document.querySelector(`input[name="question${index}"]:checked`).value
      ),
    }));
    const result = await apiRequest(
      "/quizzes/results",
      "POST",
      { QuizId: quizId, Answers: answers },
      localStorage.getItem("token")
    );
    const messageEl = document.getElementById("quizMessage");
    messageEl.textContent = result.message
      ? `Quiz submitted! Score: ${result.score}`
      : result.error;
    messageEl.style.color = result.message ? "green" : "red";
  };
}

async function loadProfile() {
  const enrollments = await apiRequest(
    "/enrollments/my-courses",
    "GET",
    null,
    localStorage.getItem("token")
  );
  const enrollmentList = document.getElementById("enrollmentList");
  enrollmentList.innerHTML = "";
  enrollments.forEach((enrollment) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${enrollment.CourseId.Title}</h3>
      <p>Progress: ${enrollment.Progress.filter((p) => p.completed).length}/${
      enrollment.CourseId.Lessons.length
    } lessons completed</p>
    `;
    enrollmentList.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("registerForm")) {
    document
      .getElementById("registerForm")
      .addEventListener("submit", register);
  }
  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", login);
  }
  if (document.getElementById("courseList")) {
    loadCourses();
  }
  if (document.getElementById("courseTitle")) {
    loadCourse();
  }
  if (document.getElementById("quizForm")) {
    loadQuiz();
  }
  if (document.getElementById("enrollmentList")) {
    loadProfile();
  }
});
