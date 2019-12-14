const { name } = require('./package.json');

const DEFAULT_RETENTION = 14;

const isActive = (arc = {}) =>
  Array.isArray(arc.macros) && arc.macros.includes(name);

const getRetentionInDays = (arc = {}) => {
  if (
    Array.isArray(arc[name]) &&
    arc[name][0][0] === 'retentionInDays' &&
    typeof arc[name][0][1] === 'number'
  ) {
    return arc[name][0][1];
  }
  return DEFAULT_RETENTION;
};

module.exports = (arc, cfn) => {
  if (isActive(arc)) {
    Object.keys(cfn.Resources)
      .filter((k) => cfn.Resources[k].Type === 'AWS::Serverless::Function')
      .forEach((lambda) => {
        cfn.Resources[`${lambda}LogGroup`] = {
          Type: 'AWS::Logs::LogGroup',
          DependsOn: [lambda],
          Properties: {
            LogGroupName: {
              'Fn::Sub': [
                '/aws/lambda/${lambda}',
                {
                  lambda: {
                    Ref: lambda,
                  },
                },
              ],
            },
            RetentionInDays: getRetentionInDays(arc),
          },
        };
      });
  }

  return cfn;
};
