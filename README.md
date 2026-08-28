# DocTalk AI

> An AI-powered document assistant that allows users to upload documents, organize them into workspaces, and interact with their documents through an AI assistant.

## 📌 Overview

DocTalk AI is a full-stack web application designed to make it easier to manage and interact with documents.

Users can create workspaces, upload PDF documents, manage their documents, and use an AI assistant to ask questions about their uploaded knowledge.

The application includes secure authentication, workspace-based document organization, document upload, protected routes, and an AI-powered document interaction workflow.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Email and password authentication
- Google OAuth authentication
- JWT-based authentication
- Protected application routes
- Persistent login using local storage
- Logout functionality
- User information displayed dynamically in the application

### 📁 Workspace Management

- Create workspaces
- Add a workspace name and description
- View all user workspaces
- Open individual workspaces
- Organize documents by workspace

### 📄 Document Management

- Upload PDF documents
- Documents are associated with a workspace
- View uploaded documents
- Display recent documents in the sidebar
- Document navigation from the sidebar
- PDF validation during upload

### 🤖 AI Assistant

- AI assistant interface for interacting with documents
- Document-based conversation workflow
- Select documents for AI interaction
- Designed for Retrieval-Augmented Generation (RAG)

### 🎨 User Interface

- Modern dark-themed interface
- Responsive design
- Dashboard
- Sidebar navigation
- Top navigation bar
- Workspace management interface
- Document interface
- Authentication pages
- Loading and validation states
- Mobile-friendly navigation

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Lucide React
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Passport / Google OAuth

### AI / Document Processing

- Large Language Model integration
- Retrieval-Augmented Generation (RAG)
- Document processing pipeline
- Vector-based document retrieval

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │      React + Vite   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │   Node + Express    │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌──────────┐   ┌──────────┐
          │ MongoDB  │   │   Auth   │   │ Documents│
          │ Database │   │   JWT    │   │ Processing│
          └──────────┘   └──────────┘   └─────┬────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │ AI / RAG     │
                                       │ Pipeline     │
                                       └──────────────┘