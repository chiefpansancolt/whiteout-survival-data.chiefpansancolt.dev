---
title: How to contribute
nextjs:
  metadata:
    title: whiteout-survival-data - How to contribute
    description: See what ways you can contribute to whiteout-survival-data, including reporting bugs, sharing missing data, and opening pull requests.
---

First and foremost, thank you for taking the time to contribute to whiteout-survival-data. Any help is appreciated to make it better and stronger. {% .lead %}

---

## Code of Conduct

This project and everyone participating in it is governed by the [whiteout-survival-data Code of Conduct](https://github.com/chiefpansancolt/whiteout-survival-data/blob/main/.github/CODE_OF_CODUCT.md). By participating, you are expected to uphold this code.

## How can I contribute

### Sharing missing data

The data is still being collected, and some of it is missing or not complete. If you have data that is missing, you are welcome to share it through an issue or a pull request. The [Known Gaps](https://github.com/chiefpansancolt/whiteout-survival-data#known-gaps) section of the README lists what the data does not hold yet.

### Reporting bugs

#### Before submitting a bug report

This section guides you through submitting a bug report for whiteout-survival-data. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating a bug report, check the [open bug issues](https://github.com/chiefpansancolt/whiteout-survival-data/issues?q=is%3Aopen+is%3Aissue+label%3Abug), because you might find that you do not need to create one. When you create a bug report, include as many details as possible: the module and entry involved, and the expected values compared with the actual values.

Use the [bug report template](https://github.com/chiefpansancolt/whiteout-survival-data/issues/new?template=bug_report.yml) to open the issue.

> Note: If you find a closed issue that seems like the same thing you are experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Suggesting enhancements

This section guides you through submitting an enhancement suggestion for whiteout-survival-data, including new query filters, new data modules, and improvements to existing ones.

Before creating an enhancement suggestion, check the [open enhancement issues](https://github.com/chiefpansancolt/whiteout-survival-data/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement), because you might find that you do not need to create one. Use the [feature request template](https://github.com/chiefpansancolt/whiteout-survival-data/issues/new?template=feature_request.yml) to open the issue.

## Code contributions

Looking to contribute to whiteout-survival-data? Look for tickets tagged `help-wanted`, or add data that is missing. See the [Development guide](https://github.com/chiefpansancolt/whiteout-survival-data/blob/main/.github/DEVELOPMENT.md) for the module layout and the steps to add a new module.

- [Help wanted issues](https://github.com/chiefpansancolt/whiteout-survival-data/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22): issues that could use help from the community to complete

### Development setup

```bash
git clone https://github.com/<your-username>/whiteout-survival-data.git
cd whiteout-survival-data
pnpm install
```

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm build`        | Build the package with tsup              |
| `pnpm lint`         | Run TypeScript type-checking and ESLint  |
| `pnpm format`       | Format all files with Prettier           |
| `pnpm format:check` | Check formatting without writing changes |

## Pull requests

Please follow these steps to have your contribution considered by the maintainers:

1. Fork the repository and create a new branch.
2. Make your changes and commit them.
3. Follow all instructions in [the pull request template](https://github.com/chiefpansancolt/whiteout-survival-data/blob/main/.github/PULL_REQUEST_TEMPLATE.md).
4. Keep the pull request focused on one feature or fix.
5. After you submit your pull request, verify that all status checks are passing.

**Ensure all merge conflicts are fixed and CI is passing.**

While the prerequisites above must be satisfied before your pull request is reviewed, the reviewers may ask you to complete additional design work or other changes before your pull request can be accepted.
