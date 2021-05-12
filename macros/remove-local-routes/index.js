const { name } = require('./package.json');

const isActive = (arc = {}) =>
  Array.isArray(arc.macros) && arc.macros.includes(name);

const convertParamPlaceholders = (route) =>
  route.replace(/:([^/]+)/g, (_, name) => `{${name}}`);

const getFunctionDeclarationForLocalRoute =
  (route) =>
  ([, value]) => {
    if (value.Type !== 'AWS::Serverless::Function') {
      return false;
    }
    const [event] = Object.values(value.Properties.Events);

    return event.Properties.Path === route;
  };

module.exports = (arc, cfn) => {
  if (isActive(arc)) {
    const routes = arc[name].map(convertParamPlaceholders);

    routes.forEach((route) => {
      delete cfn.Resources.HTTP.Properties.DefinitionBody.paths[route];
      const functions = Object.entries(cfn.Resources)
        .filter(getFunctionDeclarationForLocalRoute(route))
        .map(([prop]) => prop);

      functions.forEach((fn) => {
        delete cfn.Resources[fn];
      });
    });
  }

  return cfn;
};
