@echo off
title مستشفي الشفاء التخصصي
chcp 65001 >nul

:menu
cls
echo =====================================================
echo       مستشفي الشفاء التخصصي
echo       Hospital Schedule System
echo =====================================================
echo.
echo  [1] تشغيل الموقع (وضع التصفح)
echo  [2] بناء الموقع للإصدار النهائي
echo  [3] خروج
echo.
echo  ملاحظة: بعد تشغيل الموقع:
echo  - تصفح التخصصات بالضغط على الكروت
echo  - اضغط "عرض تلقائي" للدخول في وضع الشاشة الكاملة
echo    مع التقليب التلقائي كل 15 ثانية
echo.
set /p choice=اختر رقم (1-3): 

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto build
if "%choice%"=="3" exit /b
goto menu

:dev
cls
echo =====================================================
echo    تشغيل خادم التطوير
echo =====================================================
echo.
echo http://localhost:3000
echo اضغط Ctrl+C لإيقاف الخادم
echo.
pause
C:\nvm4w\nodejs\node.exe "C:\Users\Pc\Desktop\hospital video\node_modules\vite\bin\vite.js" --host
pause
goto menu

:build
cls
echo =====================================================
echo    بناء الموقع للإصدار النهائي
echo =====================================================
echo.
C:\nvm4w\nodejs\node.exe "C:\Users\Pc\Desktop\hospital video\node_modules\vite\bin\vite.js" build
echo.
if %errorlevel% equ 0 (
    echo تم البناء! الملفات في مجلد dist
) else (
    echo فشل - خطأ %errorlevel%
)
pause
goto menu
