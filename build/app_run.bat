echo off
cls
set /p proj=Run app (e.g. demo/gui/helloworld):
adb push %cd%/noderunner.sh /system/bin
adb shell chmod 777 /system/bin/run.sh

adb push %cd%/../out/%proj% /system/app/%proj%

copy %cd%\..\out\%proj%\index.js %cd%\..\out\%proj%\index.js.bak
echo setInterval(function(){}, 10000000); >> %cd%/../out/%proj%/index.js.bak
adb push %cd%/../out/%proj%/index.js.bak /system/app/%proj%/index.js
adb shell run.sh %proj%
echo Start app... %proj%
pause
