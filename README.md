# LineGap — One-to-One Chat Application

LineGap is a real-time one-to-one messaging application built while learning and applying **Clean Architecture principles**.
The project focuses on creating a scalable backend architecture with a clear separation of concerns while delivering a smooth, real-time chat experience.

---

## 🚀 Features

• Real-time one-to-one messaging using WebSockets
• Clean Architecture-based backend structure
• Authentication system for secure user sessions
• Conversation-based chat system
• Message persistence using MongoDB
• Instant message delivery without page refresh
• Instant chat updation
• Scalable backend design separating domain, application, and infrastructure layers

---

## 🧠 What I Focused On

This project was built primarily to understand and implement **Clean Architecture in a real-world backend application**.

Key concepts practiced:

• Separation of business logic from framework code
• Dependency inversion for flexible architecture
• Repository pattern for database abstraction
• Use case-based application structure
• Modular and maintainable backend code organization

---

## 🏗 Architecture Overview

The backend follows a **Clean Architecture structure** to keep the business logic independent of frameworks and external services.

Structure example:

backend
├── domain
│   ├── entities
│   └── repositories
├── application
│   └── usecases
├── infrastructure
│   └── database / external services / socket
└── interfaces
    └── controllers / routes / middlewares

This separation helps make the codebase easier to maintain, test, and extend.

---

## 🛠 Tech Stack

Frontend
• React
• Socket.io Client
• Tailwind CSS

Backend
• Node.js
• Express.js
• Socket.io

Database
• MongoDB
• Mongoose

Other Tools
• JWT Authentication
• REST APIs

---

## 📸 Screenshots


---

## ⚙️ Installation

Clone the repository

git clone [https://github.com/yourusername/linegap-chat-app](https://github.com/AmeerTmsy/LineGap.git)

Navigate to the project folder

cd linegap-frontend || server

Install dependencies (npm install || npm i)

Run the development server

start - 
npm run dev (frontend), 
node index.js || you can do nodemon index.js if you already have the nodemon globally installed(backend)

---

## 🎯 Future Improvements

• Group chat functionality
• Message read receipts
• File sharing in chat
• Online/offline user presence indicator
• Unread message count
• End-to-end encryption

---

## 📚 Learning Outcome

Through this project, I gained practical experience with:

• Implementing Clean Architecture in Node.js
• Designing scalable backend structures
• Building real-time chat applications with WebSockets
• Structuring maintainable full-stack projects

---
##  🤗 It is simple and nothing complicated

## 👨‍💻 Author

Ameer Suhail,
MERN Stack Developer,
JavaScript lover
