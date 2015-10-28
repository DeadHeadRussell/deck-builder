#!/bin/bash

echo 'all cards...'
browserify -t babelify ./js/allCards.js > ./public/js/allCards.js
echo 'deck editor...'
browserify -t babelify ./js/deckEditor.js > ./public/js/deckEditor.js
echo 'draft...'
browserify -t babelify ./js/draft.js > ./public/js/draft.js
echo 'sealed...'
browserify -t babelify ./js/sealed.js > ./public/js/sealed.js
echo 'done!'

