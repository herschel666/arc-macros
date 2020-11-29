const test = require('ava');
const inventory = require('@architect/inventory');

const customLogGroup = require('.');

const retentionInDays = 7;
const cfn = {
  AWSTemplateFormatVersion: '2010-09-09',
  Transform: 'AWS::Serverless-2016-10-31',
  Description: 'tbd',
  Resources: {
    GetIndex: {
      Type: 'AWS::Serverless::Function',
    },
    PostIndex: {
      Type: 'AWS::Serverless::Function',
    },
  },
};
const activeArcRaw = `
@app
test

@macros
herschel666-arc-macros-custom-log-groups
`;
const customRetentionArcRaw = `
@app
test

@macros
herschel666-arc-macros-custom-log-groups

@herschel666-arc-macros-custom-log-groups
retentionInDays ${retentionInDays}
`;
const inactiveArcRaw = `
@app
test
`;
const erroneousArcRaw = `
@app
test

@macros
herschel666-arc-macros-custom-log-groups

@herschel666-arc-macros-custom-log-groups
retentionInDays sevenWeeks
`;

const parse = async (rawArc) => {
  const { inv } = await inventory({ rawArc });
  return inv._project.arc;
};

const clone = (o) => JSON.parse(JSON.stringify(o));

test('do nothing when not applied', async (t) => {
  const inactiveArc = await parse(inactiveArcRaw);
  t.deepEqual(customLogGroup(void 0, clone(cfn)), cfn);
  t.deepEqual(customLogGroup(inactiveArc, clone(cfn)), cfn);
});

test('it adds log groups for both lambda functions', async (t) => {
  const activeArc = await parse(activeArcRaw);
  const result = customLogGroup(activeArc, clone(cfn));

  t.truthy(result.Resources.GetIndexLogGroup);
  t.is(result.Resources.GetIndexLogGroup.Type, 'AWS::Logs::LogGroup');
  t.is(result.Resources.GetIndexLogGroup.DependsOn[0], 'GetIndex');
  t.is(
    result.Resources.GetIndexLogGroup.Properties.LogGroupName['Fn::Sub'][0],
    '/aws/lambda/${lambda}'
  );
  t.is(
    result.Resources.GetIndexLogGroup.Properties.LogGroupName['Fn::Sub'][1]
      .lambda.Ref,
    'GetIndex'
  );
  t.is(result.Resources.GetIndexLogGroup.Properties.RetentionInDays, 14);

  t.truthy(result.Resources.PostIndexLogGroup);
  t.is(result.Resources.PostIndexLogGroup.Type, 'AWS::Logs::LogGroup');
  t.is(result.Resources.PostIndexLogGroup.DependsOn[0], 'PostIndex');
  t.is(
    result.Resources.PostIndexLogGroup.Properties.LogGroupName['Fn::Sub'][0],
    '/aws/lambda/${lambda}'
  );
  t.is(
    result.Resources.PostIndexLogGroup.Properties.LogGroupName['Fn::Sub'][1]
      .lambda.Ref,
    'PostIndex'
  );
  t.is(result.Resources.PostIndexLogGroup.Properties.RetentionInDays, 14);
});

test('is considers custom retention values', async (t) => {
  const customRetentionArc = await parse(customRetentionArcRaw);
  const result = customLogGroup(customRetentionArc, clone(cfn));

  t.is(
    result.Resources.GetIndexLogGroup.Properties.RetentionInDays,
    retentionInDays
  );
  t.is(
    result.Resources.PostIndexLogGroup.Properties.RetentionInDays,
    retentionInDays
  );
});

test('is ignores incorrect values', async (t) => {
  const erroneousArc = await parse(erroneousArcRaw);
  const result = customLogGroup(erroneousArc, clone(cfn));

  t.is(result.Resources.GetIndexLogGroup.Properties.RetentionInDays, 14);
  t.is(result.Resources.PostIndexLogGroup.Properties.RetentionInDays, 14);
});
