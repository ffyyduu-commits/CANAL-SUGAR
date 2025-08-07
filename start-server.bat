@echo off
echo 🚀 بدء تشغيل خادم تطبيق القناة للسكر...
echo.
echo سيتم فتح التطبيق على: http://localhost:8000
echo.
echo لإيقاف الخادم اضغط Ctrl+C
echo.

REM التحقق من وجود Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo تم العثور على Python، بدء الخادم...
    python -m http.server 8000
) else (
    REM التحقق من وجود Node.js
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo تم العثور على Node.js، بدء الخادم...
        npx http-server -p 8000
    ) else (
        echo.
        echo ❌ لم يتم العثور على Python أو Node.js
        echo يرجى تثبيت أحدهما لتشغيل الخادم
        echo.
        echo تحميل Python: https://www.python.org/downloads/
        echo تحميل Node.js: https://nodejs.org/
        echo.
        pause
    )
)
