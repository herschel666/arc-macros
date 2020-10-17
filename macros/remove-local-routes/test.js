const test = require('ava');
const parse = require('@architect/parser');
const toServerlessCloudFormation = require('@architect/package');

const macro = require('.');

const otherArc = parse(`
@app
test
`);

const arc = parse(`
@app
test

@http
get /
get /api/:foo
get /foo/:bar
post /foo/:bar
get /foo/lorem
put /some/:other/route/:with/:params

@macros
herschel666-arc-macros-remove-local-routes

@herschel666-arc-macros-remove-local-routes
/foo/:bar
/foo/lorem
/some/:other/route/:with/:params
`);
const cfn = toServerlessCloudFormation(arc);

const arcToBe = parse(`
@app
test

@http
get /
get /api/:foo
`);
const { Description, ...cfnToBe } = toServerlessCloudFormation(arcToBe);

test('Ignore Cloudformation template when macro is not included', async (t) => {
  t.plan(1);
  const cfn = {};
  const result = macro(otherArc, cfn);
  t.is(result, cfn);
});

test('Removing the routes from Cloudformation template', (t) => {
  t.plan(1);
  const { Description, ...result } = macro(arc, cfn);
  t.deepEqual(result, cfnToBe);
});
