# `herschel666-arc-macros-custom-log-groups`

> Create log groups for [@architecture](https://arc.codes/)'s Lambda functions with a custom
> [`RetentionInDays`](https://docs.aws.amazon.com/en_en/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-cwl-loggroup-retentionindays)-value.

## Installation

```sh
npm i herschel666-arc-macros-custom-log-groups
```

## Usage

Add the `herschel666-arc-macros-custom-log-groups` to the list of macros in your
[`.arc`](https://arc.codes/guides/project-manifest)-file.

```arc
@app
some-app

@macros
herschel666-arc-macros-custom-log-groups
```

## Customization

The default value for
[`RetentionInDays`](https://docs.aws.amazon.com/en_en/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#cfn-cwl-loggroup-retentionindays)
is `14`. To change this value, add the `@herschel666-arc-macros-custom-log-groups`-pragma to your
`.arc`-file and set `retentionInDays` beneath it.

```arc
@app
some-app

@macros
herschel666-arc-macros-custom-log-groups

@herschel666-arc-macros-custom-log-groups
retentionInDays 28
```

## License

MIT @ [Emanuel Kluge](https://twitter.com/Herschel_R)
