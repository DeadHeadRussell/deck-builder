#!/bin/bash

if [ "$1" = "--watch" ]
then
  echo 'watching...'
  watchify -t babelify ./js/entry.js -o ./public/entry.js &
  babel ./js/models/* ./js/data/* ./server/* --watch -d ./build
else
  echo 'compiling...'
  browserify -t babelify ./js/entry.js > ./public/entry.js
  babel ./js/models/* ./js/data/* ./server/* -d ./build
fi

