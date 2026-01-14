@echo off
echo Initializing Git repository...
git init
git branch -m master

echo Adding remote origin...
git remote add origin https://github.com/Shaziasama/todo-app.git

echo Adding all files...
git add .

echo Committing changes...
git commit -m "feat: Apply Vercel deployment fixes and folder structure"

echo Pushing to vercel-update branch...
git push -u origin master:vercel-update -f

echo.
echo ====================================================================
echo.
echo DEPLOYMENT SCRIPT COMPLETED!
echo.
echo Your 'vercel-update' branch has been created/updated on GitHub.
echo.
echo You can view the branch here:
echo https://github.com/Shaziasama/todo-app/tree/vercel-update
echo.
echo Now you can go to Vercel and deploy from this branch.
echo.
echo ====================================================================
echo.
pause
