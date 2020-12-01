# Unfurl.page

> 🚧 This project is still in active development.

API (and accompanying documentation) for social media-style expansion of links with site-defined metadata.

## Getting started

> ⚠️ This documentation is for getting started as a contributor. If you’re looking for information on using the API, head to [unfurl.page](https://unfurl.page/).

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) version 1.10.0+ (required)
- [Node.js](https://nodejs.org/) version 10.0.0+ (recommended) — enables linting, `git` hooks, and better editor integration.

### Install application dependencies

The majority of dependencies are installed within docker containers, so we recommend always running the application inside of their containers.

To prepare for local development by installing all dependencies, building docker containers, and creating local databases run:

```bash
make bootstrap
```

### Starting the application

Start the application’s docker containers with:

```bash
make start
```

- The documentation pages are available at [localhost:1313](http://localhost:1313).
- The API is available at [localhost:3000](http://localhost:3000).

Use <kbd>CONTROL</kbd> + <kbd>C</kbd> to shutdown the application.

### Additional development commands

See all available development commands by running:

```
make
```

### Editor configuration

We recommend integrating the following with your editor:

- [Prettier](https://prettier.io/) to apply consistent code formatting rules. These rules are enforced on commit, so editor integration significantly reduces frustration.

## Managing secrets

Secrets needed beyond AWS credentials are encrypted in this repository using [sops](https://github.com/mozilla/sops). To edit the encrypted files in `terraform/variables.enc.yml`:

```bash
make secrets-edit
```

Your AWS credentials must be accessible in the environment, and they must be able to access the encryption key in AWS KMS.

## Other documentation

| File                                     | Contents                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)       | How to propose changes to this project and the terms you agree to by contributing                     |
| [SECURITY.md](SECURITY.md)               | How to report security vulnerabilities and other private issues                                       |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | The standard of conduct that we require contributors to abide by and how to report conduct violations |
| [LICENSE.md](LICENSE.md)                 | The license for this software                                                                         |
