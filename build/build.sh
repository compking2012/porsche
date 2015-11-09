#!/bin/sh
mkdir ../out
cp -R ../demo ../out/demo
cp -R ../framework ../out/framework
node build.js h5 .. ../out
