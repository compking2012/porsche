#!/bin/bash

if [ $1 == "h5" ]
then
    ./build.sh h5
    http-server ../out
    #openbrowser $2
elif [ $1 == "node" ]
then
    ./build.sh node
    ./update.sh
    ./app_run.sh $2
fi
