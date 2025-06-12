# 💬 MERN Stack Chat App with AI Chatbot

A full-featured real-time chat application built with the MERN stack, enhanced by an AI-powered chatbot. Users can chat with friends or interact with an AI assistant — all in one sleek interface.

---

## 🚀 Features

- 👥 Add and manage friends  
- 💬 Real-time 1-on-1 messaging  
- 🤖 Built-in AI chatbot (powered by OpenRouter or similar)  
- 🟢 Online/offline status indicators  
- 🔒 User authentication and session management  
- 📱 Responsive design for mobile and desktop  

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Axios for API requests  
- Socket.io-client for real-time updates  

### Backend
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- Socket.io for real-time communication  
- OpenRouter (or similar) for AI chatbot integration  

### Authentication
- JWT (JSON Web Tokens)  
- bcrypt for password hashing  

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/DelMellomida/MERN-Stack-Chat-App.git
cd mern-chat-ai

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Run both client and server (use concurrently or separate terminals)
