# Unfurl.page

> 🚧 This project is still in active development.

API (and accompanying documentation) for social media-style expansion of links with site-defined metadata.

## Getting started

> ⚠️ This documentation is for getting started as a contributor. If you’re looking for information on using the API, head to [unfurl.page](https://unfurl.page/).

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) version 1.10.0+ (required)
- [Node.js](https://nodejs.org/) version 10.0.0+ (recommended) — enables `npm` commands shown in this documentation, `git` hooks for linting, and better editor integration. If you choose not to install Node.js, manually translate the commands from this documentation by looking at `package.json` in the root of this repository.

### Install application dependencies

The majority of dependencies are installed within docker containers, so we recommend always running the application inside of their containers.

To install all dependencies and docker containers, run:

```bash
npm install
```

#### Force rebuild of docker images

If you’re experiencing issues running the application especially after returning to the project after some time, try rebuilding the docker containers without caching layers:

```bash
npm run postinstall -- --no-cache
```

### Starting the application

Start the application’s docker containers with:

```bash
npm start
```

- The documentation pages are available at [localhost:1313](http://localhost:1313).
- The API is available at [localhost:3000](http://localhost:3000).

Use <kbd>CONTROL</kbd> + <kbd>C</kbd> to shutdown the application.

### Editor configuration

We recommend integrating the following with your editor:

- [Prettier](https://prettier.io/) to apply consistent code formatting rules. These rules are enforced on commit, so editor integration significantly reduces frustration.

## Other documentation

| File                                     | Contents                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)       | How to propose changes to this project and the terms you agree to by contributing                     |
| [SECURITY.md](SECURITY.md)               | How to report security vulnerabilities and other private issues                                       |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | The standard of conduct that we require contributors to abide by and how to report conduct violations |
| [LICENSE.md](LICENSE.md)                 | The license for this software                                                                         |
