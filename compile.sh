#!/bin/bash

if [ "$1" = "--watch" ]
then
  echo 'watching...'
  watchify -t babelify ./js/entry.js -o ./public/entry.js
else
  echo 'compiling...'
  browserify -t babelify ./js/entry.js > ./public/js/entry.js
fi

