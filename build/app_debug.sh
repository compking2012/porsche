echo 安装run.sh脚本到设备中...
adb push ./.script/run-debug.sh /system/bin/run-debug.sh
adb shell chmod 777 /system/bin/run-debug.sh
echo 安装目标程序到设备中...
adb push ./$1 /system/app/$1

NI_STP_MARK="OK\r"
NI_STP_OK=`adb shell ls /system/app/node-inspector/ |grep ni-stp-ok`

echo 配置获得：$NI_STP_OK

if [ -n "$NI_STP_OK" ];
then
  echo 检测到已经安装node-inspector调试平台
  sleep 2
else
  echo 第一次调试需要安装node-inspector 请耐心等待...
  sleep 5
  adb push ../toolchain/node-inspector /system/app/node-inspector >./.script/ni-stp-log
  echo "[Setup node-inspector Finished]" >./.script/ni-stp-ok
  adb push ./.script/ni-stp-ok /system/app/node-inspector/ni-stp-ok
  echo 成功安装调试平台,正在启动调试器...
  sleep 3
fi

adb forward tcp:8081 tcp:8080
echo 开始启动程序... $1
echo DEBUG URL:
echo 请在浏览器中访问 http://127.0.0.1:8081/debug?port=5858
adb shell run-debug.sh $1
