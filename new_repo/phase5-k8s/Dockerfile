# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the phase3-chatbot directory
COPY ../phase3-chatbot/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code from the phase3-chatbot directory
COPY ../phase3-chatbot/ .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "dev"]
