#! /usr/bin/env node
'use strict';

const request = require('request');
const zlib = require('zlib');

const rightpad = require('right-pad');
const charm = require('charm')(process);

function perc(n) {
  return Math.round(n) + '%';
}

function spaceTime(n) {
  let out = '';
  for(let i = 0; i < n; i++) {
    out += ' ';
  }
  return out;
}

function graphSplit(text, ns, sum) {
  const len = text.length;
  const widths = ns.map(n => Math.round((n / sum) * len));

  var x = 0;
  for (let i = 0; i < widths.length; i++) { x += widths[i]; }
  widths[0] += len - x;

  var index = 0;
  var results = [];
  for (let i = 0; i < widths.length; i++) {
    const limit = index + widths[i];
    results.push(text.substring(index, limit));
    index = limit;
  }
  return results;
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

function printGraph(width, latest, model, metric) {
  const h = latest.D.models[model][metric];
  const t = latest.R.models[model][metric];
  const j = latest.L.models[model][metric];

  const modelLabel = rightpad(model + ':' + metric, 14, ' ');
  const f = function (name, n) { return name + ': ' + perc(n); };
  const prefix = ' ' + modelLabel + '    ';
  const sep = '    ';
  const label = prefix + f('Hillary', h) + sep + f('Trump', t) + sep + f('Johnson', j);
  const graph = rightpad(label, width, ' ');

  const graphParts = graphSplit(graph, [h, t, j], h + t + j);
  charm.foreground('white');
  charm.background('blue').write(graphParts[0]);
  charm.background('red').write(graphParts[1]);
  charm.background('yellow').write(graphParts[2]);
  charm.display('reset');
}

stream.on('end', function() {

  const width = process.stdout.columns;
  const data = JSON.parse(dataRegexp.exec(html)[0].replace('race.stateData = ', ''));
  const latest = data.forecasts.latest;

  const display = function (model, suffix) {
    printGraph(width, latest, model, 'forecast');
    process.stdout.write('\n');
    printGraph(width, latest, model, 'winprob');
    process.stdout.write(suffix);
  }

  display('now', '\n\n');
  display('polls', '\n\n');
  display('plus', '\n');
  charm.display('reset');
  process.exit();
});
