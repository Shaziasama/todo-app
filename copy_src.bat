@echo off
echo Copying source files...

REM Create the src directory if it doesn't exist
if not exist "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src" mkdir "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src"

REM Copy the app directory
if not exist "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\app" mkdir "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\app"
xcopy "C:\Users\Zohaib\Desktop\todo-app\phase3-chatbot\src\app" "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\app" /E /I /Y

REM Copy the lib directory
if not exist "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\lib" mkdir "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\lib"
xcopy "C:\Users\Zohaib\Desktop\todo-app\phase3-chatbot\src\lib" "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\lib" /E /I /Y

REM Copy the components directory
if not exist "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\components" mkdir "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\components"
xcopy "C:\Users\Zohaib\Desktop\todo-app\phase3-chatbot\src\components" "C:\Users\Zohaib\Desktop\todo-app\hf-deployment\src\components" /E /I /Y

echo Copying complete.