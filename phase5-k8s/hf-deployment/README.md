---
title: Phase 3 Chatbot - AI Todo Assistant
emoji: 🤖
colorFrom: blue
colorTo: yellow
sdk: docker
runtime: huggingface
---

# Phase 3 Chatbot - AI Todo Assistant

This is an AI-powered todo management application that allows users to manage their tasks through natural language conversations.

## Features

- Natural Language Task Management: "Add buy milk to my list"
- Ultra-Premium UI: Glassmorphism, Animations, Neon Glows
- Tool Calling: The AI can intelligently call `addTodo`, `listTodos`, etc.
- Secure Authentication System

## How to Use

1. Sign up or log in to the application
2. Start chatting with the AI assistant to manage your todos
3. You can add, list, update, complete, or delete todos using natural language

## Technical Details

- Built with Next.js 16
- Uses Prisma ORM with SQLite database
- AI integration with LocalAI/OpenAI compatible API
- Authentication with NextAuth.js

## Environment Variables

To run this application, you'll need to set the following environment variables:

- `LOCALAI_BASE_URL`: The URL for your LocalAI or OpenAI-compatible API
- `LOCALAI_MODEL`: The model name to use (e.g., "gpt-3.5-turbo" or a LocalAI model)
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: The URL of your deployed application

## Note

This application is configured to work with Hugging Face Spaces. The default configuration assumes you'll be connecting to an external AI service. For production use, you'll need to configure the AI service endpoint appropriately.