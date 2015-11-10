echo off
cls
set /p proj=运行的程序名(clock/tests/compass):
echo "您的程序名字是： "%proj%
echo 安装run.sh脚本到设备中...
adb push %cd%/.script/run.sh /system/bin/run.sh
adb shell chmod 777 /system/bin/run.sh

echo 安装目标程序到设备中...
adb push %cd%/%proj% /system/app/%proj%

copy %cd%\%proj%\index.js %cd%\%proj%\index.js.bak
echo setInterval(function(){}, 10000000); >> %cd%/%proj%/index.js.bak
adb push %cd%/%proj%/index.js.bak /system/app/%proj%/index.js

echo 开始启动程序... %proj%
adb shell run.sh %proj%
pause