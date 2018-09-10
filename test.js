const test = require('tape');
const xyz = require('./index');

test('atom position correct', t => {
  const d = xyz(`1
                 test
                 H 1.1 2.2 3.3`)[0];
  t.same(d.positions.pick(0, null).data, [1.1, 2.2, 3.3]);
  t.same(d.positions.shape, [1, 3]);
  t.same(d.numbers, [1]);
  t.end();
});

test('trajectory', t => {
  const d = xyz(`1
                 test
                 H 1.1 2.2 3.3
                 1
                 test
                 He 2.1 2.2 2.3`);
  t.same(d[0].positions.pick(0, null).data, [1.1, 2.2, 3.3]);
  t.same(d[0].positions.shape, [1, 3]);
  t.same(d[0].numbers, [1]);
  t.same(d[1].positions.pick(0, null).data, [2.1, 2.2, 2.3]);
  t.same(d[1].positions.shape, [1, 3]);
  t.same(d[1].numbers, [2]);
  t.equals(d.length, 2);
  t.end();
});

test('empty comment', t => {
  const d = xyz(`1

                 H 1.1 2.2 3.3
                 1

                 He 2.1 2.2 2.3`);
  t.same(d[0].positions.pick(0, null).data, [1.1, 2.2, 3.3]);
  t.same(d[0].positions.shape, [1, 3]);
  t.same(d[0].numbers, [1]);
  t.same(d[1].positions.pick(0, null).data, [2.1, 2.2, 2.3]);
  t.same(d[1].positions.shape, [1, 3]);
  t.same(d[1].numbers, [2]);
  t.equals(d.length, 2);
  t.end();
});

test('errors', t => {
  function tryCatch(f) {
    try {
      f();
    } catch (e) {
      return e;
    }
    return false;
  }

  let err;
  err = tryCatch(() => { xyz(`1
                              test
                              H 1 2 3 4`); });
  t.ok(err);
  t.equal(err.message, 'xyz: Incorrect number of components in line 3.');

  err = tryCatch(() => { xyz(`1
                              test
                              H 1 2`); });
  t.ok(err);
  t.equal(err.message, 'xyz: Incorrect number of components in line 3.');

  t.doesNotThrow(() => { xyz(`1
                              test
                              H 1 2 3
                              `); });

  err = tryCatch(() => { xyz(`1
                              test
                              H 1 2 a3`); });
  t.ok(err);
  t.equal(err.message, 'xyz: Failed to parse atom coordinate component 3 on line 3.');

  err = tryCatch(() => { xyz(`10
                              test
                              H 1 2 3`); });
  t.ok(err);
  t.equal(err.message, 'xyz: Ran out of data before parsing completed.');

  err = tryCatch(() => { xyz(`1
                              test
                              H 1 2 3
                              2`); });
  t.ok(err);
  t.equal(err.message, 'xyz: Ran out of data before parsing completed.');

  err = tryCatch(() => { xyz(`1`); });
  t.ok(err);
  t.equal(err.message, 'xyz: Ran out of data before parsing completed.');

  t.end();
});
