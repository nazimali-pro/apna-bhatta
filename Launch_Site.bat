@echo off
echo ==============================================
echo    Apna Bhatta - Local Development Server
echo ==============================================
echo.

:: Kill any process already using port 3000 so we always start on 3000
echo [INFO] Clearing port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 " 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: Install dependencies if node_modules is missing or incomplete
if not exist "node_modules\.bin\next.cmd" (
    echo [INFO] Dependencies missing. Installing...
    call npm install
) else (
    echo [INFO] Dependencies found. Skipping install.
)

:: Always regenerate Prisma client in case schema changed
echo [INFO] Generating Prisma Client...
call npm exec prisma generate

echo.
echo [INFO] Starting development server on port 3000...
echo [INFO] Opening http://localhost:3000 in your browser in 5 seconds...
echo.

:: Start the server in background then open browser
start "" /B cmd /c "npm run dev -- -p 3000"

:: Wait for server to be ready then open browser
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"

:: Now attach to the server output so user can see logs
npm run dev -- -p 3000

pause
