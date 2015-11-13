#!/bin/sh
ps |grep $1 |awk '{print $2}' |xargs kill
node --use_strict --es_staging --harmony  /system/app/$1/index.js $2
