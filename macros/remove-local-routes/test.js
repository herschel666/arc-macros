const test = require('ava');
const inventory = require('@architect/inventory');
const toServerlessCloudFormation = require('@architect/package');

const macro = require('.');

const otherArcRaw = `
@app
test
`;

const arcRaw = `
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
`;

const arcToBe = `
@app
test

@http
get /
get /api/:foo
`;

const getOtherArc = async () => inventory({ rawArc: otherArcRaw });

const getArc = async () => {
  const { inv } = await inventory({ rawArc: arcRaw });
  const cfn = toServerlessCloudFormation({ inv });
  return { arc: inv._project.arc, cfn };
};

const getCfnToBe = async () => {
  const { inv } = await inventory({ rawArc: arcToBe });
  // eslint-disable-next-line no-unused-vars
  const { Description, ...cfnToBe } = toServerlessCloudFormation({ inv });
  return cfnToBe;
};

test('Ignore Cloudformation template when macro is not included', async (t) => {
  t.plan(1);
  const cfn = {};
  const result = macro(await getOtherArc(), cfn);
  t.is(result, cfn);
});

test('Removing the routes from Cloudformation template', async (t) => {
  t.plan(1);
  const { arc, cfn } = await getArc();
  const cfnToBe = await getCfnToBe();
  // eslint-disable-next-line no-unused-vars
  const { Description, ...result } = macro(arc, cfn);
  t.deepEqual(result, cfnToBe);
});
