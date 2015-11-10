#!/bin/bash

if [ ! -d ../out ]
then
    mkdir ../out
else
    rm -rf ../out/*
fi
cp -R ../demo ../out/demo
cp -R ../framework ../out/framework
node build.js $1 ../out
