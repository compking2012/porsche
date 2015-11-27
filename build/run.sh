#!/bin/bash

if [ $1 == "h5" ]
then
    ./build.sh h5 $3
    open -a "/Applications/Google Chrome.app" "http://localhost:8080/$2/index.html"
    http-server ../out
elif [ $1 == "node" ]
then
    ./build.sh node $3
    ./update.sh
    ./app_run.sh $2
fi
