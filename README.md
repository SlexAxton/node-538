# 538

A command line util to get the latest presidential polling odds from [fivethiryeight.com](http://projects.fivethirtyeight.com/2016-election-forecast/).

*DISCLAIMER:* I have nothing to do with fivethirtyeight and this is not endorsed or supported by them
and may break at any time if they change anything about their website.

## Installation

`npm install -g 538`

## Usage

Type `538` into your console.

![http://f.cl.ly/items/2X2X2A341S3x2m0y3D2u/Screen%20Shot%202016-08-10%20at%2012.47.15%20AM.png](http://f.cl.ly/items/2X2X2A341S3x2m0y3D2u/Screen%20Shot%202016-08-10%20at%2012.47.15%20AM.png)

Note: it's 100 characters wide, because I don't hate myself and use terminals with fewer columns,
but I'd probably accept a nice PR that smartly adjusted to smaller terminals if you wanted.

## Show me graphs when I open my terminal

Just add the `538` command to your `~/.bashrc` or `~/.zshrc` (or similar), and it'll run when you
open your terminal.

This might work if you have bash:

```
echo "\n538" >> ~/.bashrc
```

This might work if you have zsh:

```
echo "\n538" >> ~/.zshrc
```

## Thanks

Obviously none of the data is mine. Go to http://projects.fivethirtyeight.com/2016-election-forecast/
and click their ads each time you use the command line tool.

I pretty much stole the idea from [@nelhage](https://github.com/nelhage) - who is far, far smarter than me and also wrote this in
python first: https://github.com/nelhage/util-scripts/blob/master/538
