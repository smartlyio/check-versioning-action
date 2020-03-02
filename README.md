# Version checking action action

This action checks that there are correctly supplied version labels on the PR.

There must be exactly one of the following labels: `major`, `minor`, `patch`

The label `no release` is also acceptable but the return value of `CONTINUE_RELEASE` will be false

If the correct labels are defined, this sets two environment variables: `VERSION_UPPER` and `VERSION_LOWER`, these being the upper and lower case type of the version.

In addition, there is a variable: `CONTINUE_RELEASE` that is set to true only if the labels are set in such a way as to make a release (i.e. not `no release`)

If the check fails, an error will be printed and if the parameter: `enforce` is set (default), then the build will fail.

## Inputs

### GITHUB_TOKEN

**Required** GitHub token as passed to the workflow

### `enforce`

**Optional** If this is set to true, this will cause the action to fail with an error if the version is not specified correctly. Default true.

## Outputs

### `VERSION_UPPER` 

Version type as an uppercase string

### `VERSION_LOWER`

Version type as a lowercase string

### `CONTINUE_RELEASE`

Set to true if the version is one of: `major`, `minor`, `patch`

## Example usage

```yaml
uses: smartlyio/check-versioning-action@v3
```

## Development

### Development scripts

- Run typescript: `npm run compile`
- Run test: `npm run test`
- Run linters: `npm run lint`

Run all the above: `npm run all`

### Release new version

Follow these steps to release a new version

1. Create release branch: `git checkout -b v{next-version}`
1. Release the version: `npm run release`
1. Add the built package to version control: `git add dist`
1. Push the new branch: `git push origin/v{next-version}`
