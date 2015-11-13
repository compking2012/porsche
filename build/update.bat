adb shell rm -rf /system/framework/framework
adb shell mkdir /system/framework/framework
adb push ../out/framework/com /system/framework/framework
adb push ../out/framework/package.json /system/framework/framework
adb push ../out/framework/resources /system/framework/framework/resources
adb push ../out/framework/index.js /system/framework/framework
