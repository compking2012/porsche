echo off
cls
set /p proj=运行的程序名(clock/tests/compass):
echo "您的程序是 "%proj%
echo 安装运行脚本到设备...
adb push %cd%/.script/run-debug.sh /system/bin/run-debug.sh
adb shell chmod 777 /system/bin/run-debug.sh
echo ""
echo 更新程序到设备...
adb push %cd%/%proj% /system/app/%proj%

for /f %%i in ('adb shell ls /system/app/node-inspector/ni-stp-ok') do set NI_STP_OK=%%i
echo %NI_STP_OK%

if %NI_STP_OK% == /system/app/node-inspector/ni-stp-ok (
  echo 您已经安装了node-inspector平台，可以启动...
  sleep 2
) else (
  echo 您是第一次启动，安装node-inspector比较慢，请耐心等待
  sleep 5
  adb push %cd%/../toolchain/node-inspector /system/app/node-inspector >./.script/ni-stp-log
  echo "[Setup node-inspector Finished]" >./.script/ni-stp-ok
  adb push %cd%/.script/ni-stp-ok /system/app/node-inspector/ni-stp-ok
  echo 安装成功！
  sleep 3
)

adb forward tcp:8081 tcp:8080
echo 开始运行... %proj%
echo 请打开 Chrome 浏览器访问
echo http://127.0.0.1:8081/debug?port=5858
adb shell run-debug.sh %proj%
cmd