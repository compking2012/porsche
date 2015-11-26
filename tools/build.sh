#!/bin/sh
rm -rf ../apidocs/*
jsdoc ../../porsche/framework -r -c conf.json -t jsdoc3-bootstrap -d ../apidocs
