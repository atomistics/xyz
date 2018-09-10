const ndarray = require("ndarray");
const elements = require("@atomistics/elements");

module.exports = function(data) {
  // Split the data into lines.
  const lines = data.split("\n").map(l => l.trim());

  // Remove any blank lines at the end of the file.
  while (lines[lines.length - 1] === "") {
    lines.pop(lines.length - 1);
  }

  // Keep track of which line we're on.
  let index = 0;

  // We'll return a list of images.
  let trajectory = [];

  while (index < lines.length) {
    // Get the number of atoms.
    const natoms = parseInt(lines[index++]);
    if (isNaN(natoms)) {
      throw new Error(`xyz: Failed to parse number of atoms on line ${index}.`);
    }
    if (index >= lines.length)
      throw new Error(`xyz: Ran out of data before parsing completed.`);
    const comment = lines[index++];
    const positions = ndarray(new Float64Array(natoms * 3), [natoms, 3]);
    const numbers = [];
    for (let i = 0; i < natoms; i++) {
      if (index >= lines.length)
        throw new Error(`xyz: Ran out of data before parsing completed.`);
      const data = lines[index++].split(/\s+/);
      if (data.length !== 4) {
        throw new Error(
          `xyz: Incorrect number of components in line ${index}.`
        );
      }
      numbers.push(elements[data[0]].number);
      for (let j = 0; j < 3; j++) {
        const r = parseFloat(data[j + 1]);
        if (isNaN(r)) {
          throw new Error(
            `xyz: Failed to parse atom coordinate component ${j +
              1} on line ${index}.`
          );
        }
        positions.set(i, j, r);
      }
    }
    trajectory.push({
      positions: positions,
      numbers: numbers
    });
  }
  return trajectory;
};
