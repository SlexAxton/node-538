#! /usr/bin/env node
'use strict';

const request = require('request');
const zlib = require('zlib');

const rightpad = require('right-pad');
const charm = require('charm')(process);

function percRound(n) {
  return Math.round(n*10)/10;
}

function spaceTime(n) {
  let out = '';
  for(let i = 0; i < n; i++) {
    out += ' ';
  }
  return out;
}

function graphTextSplit(text, a, b) {
  const textLength = text.length;
  if (textLength <= a) {
    return [text + spaceTime(a - textLength), spaceTime(b)];
  } else {
    const textRemainder = textLength - a;
    return [text.substr(0, a), text.substr(a) + spaceTime(b - textRemainder)];
  }
}

const dataRegexp = /race\.stateData\s*=\s*([^;]+)/g;

const stream = request({
  method: 'GET',
  headers: {'accept-encoding': 'gzip'},
  uri: 'http://projects.fivethirtyeight.com/2016-election-forecast/',
}).pipe(zlib.createGunzip());

let html = '';

stream.on('data', function(chunk) {
  html += chunk;
});

function printGraph(hillary, trump, model) {
  const modelLabel = rightpad(model.toUpperCase(), 8, ' ');
  const nowLabel = ' ' + modelLabel + '     Hillary: ' + percRound(hillary[model]) + '% – Trump: ' + percRound(trump[model]) + '%';
  const nowLabelParts = graphTextSplit(nowLabel, Math.round(hillary[model]), Math.round(trump[model]));
  charm.foreground('white').background('blue').write(nowLabelParts[0]).background('red').write(nowLabelParts[1]);
  charm.display('reset');
}

stream.on('end', function() {
  const data = JSON.parse(dataRegexp.exec(html)[0].replace('race.stateData = ', ''));
  const latest = data.forecasts.latest;

  const trump = {
    now: latest.R.models.now.winprob,
    polls: latest.R.models.polls.winprob,
    plus: latest.R.models.plus.winprob,
  };

  const hillary = {
    now: latest.D.models.now.winprob,
    polls: latest.D.models.polls.winprob,
    plus: latest.D.models.plus.winprob,
  };

  printGraph(hillary, trump, 'now');
  process.stdout.write('\n\n');
  printGraph(hillary, trump, 'polls');
  process.stdout.write('\n\n');
  printGraph(hillary, trump, 'plus');
  process.stdout.write('\n');

  charm.display('reset');
  process.exit();
});

