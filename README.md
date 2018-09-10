# @atomistics/xyz

An xyz chemical file format parser and tools for interacting with xyz files.

## Install

For use in your scripts:

```
npm i --save @atomistics/xyz
```

To install it globally and use the provided cli scripts:

```
npm i -g @atomistics/xyz
```

## Example

```js
const xyz = require('@atomistics/xyz');

// xyz assumes we're going to get a trajectory, so it will return
// an array of images. Note that we grab the zeroth image.
const caffeine = xyz(`24
Caffeine
H      -3.3804130    -1.1272367     0.5733036
N       0.9668296    -1.0737425    -0.8198227
C       0.0567293     0.8527195     0.3923156
N      -1.3751742    -1.0212243    -0.0570552
C      -1.2615018     0.2590713     0.5234135
C      -0.3068337    -1.6836331    -0.7169344
C       1.1394235     0.1874122    -0.2700900
N       0.5602627     2.0839095     0.8251589
O      -0.4926797    -2.8180554    -1.2094732
C      -2.6328073    -1.7303959    -0.0060953
O      -2.2301338     0.7988624     1.0899730
H       2.5496990     2.9734977     0.6229590
C       2.0527432    -1.7360887    -1.4931279
H      -2.4807715    -2.7269528     0.4882631
H      -3.0089039    -1.9025254    -1.0498023
H       2.9176101    -1.8481516    -0.7857866
H       2.3787863    -1.1211917    -2.3743655
H       1.7189877    -2.7489920    -1.8439205
C      -0.1518450     3.0970046     1.5348347
C       1.8934096     2.1181245     0.4193193
N       2.2861252     0.9968439    -0.2440298
H      -0.1687028     4.0436553     0.9301094
H       0.3535322     3.2979060     2.5177747
H      -1.2074498     2.7537592     1.7203047
`)[0];

// The atomic numbers of each atom.
console.log(caffeine.numbers);

> [ 1, 7, 6, 7, 6, 6, 6, 7, 8, 6, 8, 1, 6, 1, 1, 1, 1, 1, 6, 6, 7, 1, 1, 1 ]

// xyz will package the positions into an ndarray.
console.log(caffeine.positions.data);

> Float64Array [  -3.380413, -1.1272367, 0.5733036, ... 1.7203047 ]
```

## API

```js
const xyz = require("@atomistics/xyz");

const trajectory = xyz(data);
```

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| data      | string | xyz file chemical format string |

Returns a list of images, where each image contains the atomic numbers and atom positions:

| Name                    | Type                                        | Description                                                               |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| trajectory[N].numbers   | int array                                   | An array of atomic numbers.                                               |
| trajectory[N].positions | [ndarray](https://github.com/scijs/ndarray) | An ndarray of shape [atom count, 3] containing the position of each atom. |

## CLI

#### xyz2json

```
xyz2json inputfile.xyz
```

Converts `inputfile.xyz` to json and prints the result to stdout.

Example:

```
$ xyz2json h2.xyz > h2.json
$ cat h2.json

[{"positions":[0,0,0,1,0,0],"numbers":[1,1]}]
```

#### xyz2js

```
xyz2js inputfile.xyz
```

Converts `inputfile.xyz` to a javascript module and prints the result to stdout.

Example:

```
$ xyz2js h2.xyz > h2.js
$ cat h2.js

const ndarray = require("ndarray");

const data = JSON.parse('[{"positions":[0,0,0,1,0,0],"numbers":[1,1]}]');

module.exports = data.map(d => {
  return {
    positions: ndarray(new Float64Array(d.positions), [d.positions.length/3, 3]),
    numbers: d.numbers,
  };
});
```
