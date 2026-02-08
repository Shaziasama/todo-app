#!/bin/sh

# Initialize the database
echo "Initializing database..."
npx prisma migrate deploy
npx prisma db seed

# Start the application
echo "Starting application..."
npm start