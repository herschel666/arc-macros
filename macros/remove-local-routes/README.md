# `herschel666-arc-macros-remove-local-routes`

> Remove selected routes from [@architect](https://arc.codes/)'s Lambda functions before the
> deployment. A handy solution when you're leveraging HTTP handlers for local scaffolding tasks.

## Installation

```sh
npm i herschel666-arc-macros-remove-local-routes
```

## Usage

Add the `herschel666-arc-macros-remove-local-routes` to the list of macros in your
[`.arc`](https://arc.codes/guides/project-manifest)-file.

```arc
@app
some-app

@macros
herschel666-arc-macros-remove-local-routes
```

## Configuration

List all the routes you don't want to be deployed below the `@herschel666-arc-macros-remove-local-routes`-pragma in your
`.arc`-file. Differentation by HTTP-method isn't supported currently. So if a route is triggered by
a GET-request as well as a POST-request, both respective Lambda functions will be ditched before deployment.

```arc
@app
some-app

@http
get /
post /api
get /populate-db
post /test/:thingy

@macros
herschel666-arc-macros-remove-local-routes

@herschel666-arc-macros-remove-local-routes
/populate-db
/test/:thingy
```

The deployed Arc app will only consist of the HTTP-handlers for `get /` and `post /api`.

## License

MIT @ [Emanuel Kluge](https://twitter.com/Herschel_R)
