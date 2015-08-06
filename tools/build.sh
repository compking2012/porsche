#!/bin/sh
rm -rf ../apidocs/*
jsdoc ../../porsche/framework -r -t jsdoc3-bootstrap -d ../apidocs
