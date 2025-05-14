require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");
const Quiz = require("./models/Quiz");
const QuizResult = require("./models/QuizResult");

const seedDatabase = async () => {
  await connectDB();
  try {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Quiz.deleteMany({});
    await QuizResult.deleteMany({});

    const users = await User.insertMany([
      {
        _id: new mongoose.Types.ObjectId(),
        Username: "hieu",
        Email: "instructor1@example.com",
        Password: await require("bcryptjs").hash("123", 10),
        FullName: "John Smith",
        Role: "Instructor",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        Username: "danh1",
        Email: "student1@example.com",
        Password: await require("bcryptjs").hash("123", 10),
        FullName: "Jane Doe",
        Role: "Student",
      },
    ]);

    const course = await Course.create({
      _id: new mongoose.Types.ObjectId(),
      Title: "Python Miễn Phí",
      Description: "Học lập trình Python cơ bản hoàn toàn miễn phí",
      InstructorId: users[0]._id,
      Lessons: [
        {
          lessonId: new mongoose.Types.ObjectId(),
          title: "Giới thiệu về Python",
          content: "Video: https://example.com/python-intro",
          order: 1,
        },
        {
          lessonId: new mongoose.Types.ObjectId(),
          title: "Cú pháp cơ bản",
          content: "Video: https://example.com/python-syntax",
          order: 2,
        },
      ],
    });

    await Enrollment.create({
      _id: new mongoose.Types.ObjectId(),
      UserId: users[1]._id,
      CourseId: course._id,
      Progress: [{ lessonId: course.Lessons[0].lessonId, completed: true }],
    });

    const quiz = await Quiz.create({
      _id: new mongoose.Types.ObjectId(),
      CourseId: course._id,
      LessonId: course.Lessons[0].lessonId,
      Title: "Kiểm tra Giới thiệu Python",
      Questions: [
        {
          questionId: new mongoose.Types.ObjectId(),
          content: "Kết quả của 2 + 2 là gì?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
        },
        {
          questionId: new mongoose.Types.ObjectId(),
          content: "Python được tạo ra vào năm nào?",
          options: ["1989", "1991", "1995", "2000"],
          correctAnswer: 1,
        },
      ],
    });

    await QuizResult.create({
      _id: new mongoose.Types.ObjectId(),
      UserId: users[1]._id,
      QuizId: quiz._id,
      Score: 1,
      Answers: [
        { questionId: quiz.Questions[0].questionId, selectedAnswer: 1 },
        { questionId: quiz.Questions[1].questionId, selectedAnswer: 0 },
      ],
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
