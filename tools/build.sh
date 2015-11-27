#!/bin/sh
rm -rf ../apidocs/*
cd ../../porsche/build
./build.sh h5 ../../..
cd ../../porsche-doc/tools
rm -rf ../demo/* ../framework/*
cp -r ../../porsche/out/framework/* ../framework
cp -r ../../porsche/out/demo/* ../demo
jsdoc ../../porsche/framework -r -c conf.json -t jsdoc3-bootstrap -d ../apidocs
