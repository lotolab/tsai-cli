<p align="center" >
  <a href="https://github.com/lotolab" target="blank"><img src="./docs/lotolab_golden.svg" width="120" alt="Tsai Logo" /></a>
</p>


## Description

The Tsai CLI is extends from nestjs cli.
It is a command-line interface tool that helps you to initialize, develop, and maintain your Nestjs monorepo workspace. It assists in multiple ways, including scaffolding the project, serving it in development mode, and building and bundling the application for production distribution. It embodies best-practice architectural patterns to encourage well-structured apps.

The CLI works with [schematics](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/schematics), and provides built in support from the schematics collection at [@tsailab/schematics](https://github.com/lotolab/tsai-schematics).


## Installation

```
$ npm install -g @tsailab/cli
```

## Usage

### Create a new monorepo project

```bash
mkdir tsai-plat
tsai n --directory tsai-plat tsai-admin
cd tsai-plat
tsai g lib core 
# this command will mageration origin app filles into apps,
# then nest-cli.json will change to an monorepo 
tsai g app some-app 
```

Learn more in the [Nestjs official documentation](https://docs.nestjs.com/cli/overview).

## Stay in touch

- Twitter - [@lamborghini171](https://twitter.com/lamborghini171)

## License

Tsai-plat is [MIT licensed](LICENSE).
