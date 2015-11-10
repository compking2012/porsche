adb shell rm -rf /system/framework/cloudappfx
adb shell mkdir /system/framework/cloudappfx
adb push ../cloudappfx/com /system/framework/cloudappfx/com
adb push ../cloudappfx/package.json /system/framework/cloudappfx
adb push ../cloudappfx/resources /system/framework/cloudappfx/resources
adb push ../cloudappfx/index.js /system/framework/cloudappfx
