# Version checking action action

This action checks that there are correctly supplied version labels on the PR.

There must be exactly one of the following labels: `major`, `minor`, `patch`

If the correct labels are defined, this sets two environment variables: `VERSION_UPPER` and `VERSION_LOWER`, these being the upper and lower case type of the version.

If the check fails, an error will be printed and if the parameter: `enforce` is set, then the build will fail.

## Inputs

### `enforce`

**Optional** If this is set tu true, this will cause the action to fail with an error if the version is not specified correctly.

## Outputs

### `VERSION_UPPER` 

Version type as an uppercase string

### `VERSION_LOWER`

Version type as a lowercase string

## Example usage

```yaml
uses: smartlyio/check-versioning-action@v2
```

## Development

### Run tests

``` bash
npm run test
```

### Release new version

Follow these steps to release a new version

1. Create release branch: `git checkout -b v{next-version}`
1. Release the version: `npm run release`
1. Add the built package to version control: `git add dist`
1. Push the new branch: `git push origin/v{next-version}`
