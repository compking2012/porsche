adb shell chmod 777 /system/bin/run.sh
adb push ../out/$1 /system/app/$1
cp ../out/$1/index.js ../out/$1/index.js.bak
echo "setInterval(function(){}, 10000000);">>../out/$1/index.js.bak
adb push ../out/$1/index.js.bak /system/app/$1/index.js
rm ../out/$1/index.js.bak
adb shell run.sh $1
echo Start app... $1
