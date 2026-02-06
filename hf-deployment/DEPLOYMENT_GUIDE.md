# Deployment Guide: Phase 3 Chatbot to Hugging Face Spaces

## Overview
This guide explains how to deploy your Next.js chatbot application to Hugging Face Spaces using Docker.

## Prerequisites
- A Hugging Face account ([https://huggingface.co/join](https://huggingface.co/join))
- Git installed on your local machine
- Basic knowledge of Git and terminal commands

## Step-by-Step Instructions

### 1. Create a Hugging Face Space
1. Go to [https://huggingface.co/spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Fill in the details:
   - **Space name**: Choose a unique name for your space
   - **SDK**: Select "Docker"
   - **Visibility**: Choose Public or Private
   - **Hardware**: Select CPU (or GPU if needed)
4. Click "Create Space"

### 2. Clone Your Space Repository
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
cd YOUR_SPACE_NAME
```

### 3. Copy Deployment Files
Copy all files from the `hf-deployment` directory to your space repository:
```bash
# From your local hf-deployment directory
cp -r C:\Users\Zohaib\Desktop\todo-app\hf-deployment\* /path/to/your/hf-space-repo/
```

### 4. Configure Environment Variables
Before pushing, you need to set up environment variables on Hugging Face:

1. Go to your Space page on Hugging Face
2. Navigate to the "Files" tab
3. Look for "Settings" or "Environment variables" section
4. Add these variables:
   - `LOCALAI_BASE_URL`: Your AI API endpoint (e.g., `https://api.openai.com/v1`)
   - `LOCALAI_MODEL`: Model name (e.g., `gpt-3.5-turbo`)
   - `NEXTAUTH_SECRET`: Generate a secure random string for authentication
   - `OPENAI_API_KEY`: Your OpenAI API key (if using OpenAI)
   - `DATABASE_URL`: `file:./dev.db` (for SQLite database)

### 5. Commit and Push Your Code
```bash
git add .
git commit -m "Initial deployment of Phase 3 Chatbot"
git push origin main
```

### 6. Monitor the Build Process
1. Go to your Space page on Hugging Face
2. Navigate to the "Logs" tab to monitor the build process
3. The build typically takes 5-15 minutes
4. Watch for any error messages in the logs

### 7. Test Your Deployed Application
Once the build is complete:
1. Visit your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME`
2. Or use the direct link: `https://YOUR_USERNAME-hf-space-name.hf.space`
3. Register an account and test the chatbot functionality

## Troubleshooting Common Issues

### Build Failures
- Check the logs for specific error messages
- Ensure all dependencies in package.json are compatible
- Verify that your Dockerfile is correctly configured

### Runtime Errors
- Check that all environment variables are properly set
- Ensure your AI service endpoint is accessible
- Verify database connection settings

### Performance Issues
- Consider upgrading your Space hardware if needed
- Optimize your application code for better performance
- Check if your AI service has rate limits affecting performance

## Important Notes

1. **AI Service Configuration**: This application is configured to work with OpenAI-compatible APIs. You'll need to provide credentials for an AI service.

2. **Database**: The application uses SQLite for simplicity. For production use, consider a more robust database solution.

3. **Security**: Ensure you use strong, unique values for secrets like `NEXTAUTH_SECRET`.

4. **Rate Limits**: Free Hugging Face Spaces have usage limitations. Consider upgrading if you need more resources.

## Updating Your Space

To update your deployed application:
1. Make changes to your local code
2. Test the changes locally if possible
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. Monitor the rebuild process in the logs

## Support

If you encounter issues during deployment:
1. Check the Hugging Face Spaces logs for error details
2. Verify all environment variables are correctly set
3. Ensure your application works locally before deploying
4. Consult the Hugging Face documentation for platform-specific issues