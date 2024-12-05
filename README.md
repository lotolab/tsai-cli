<p align="center" >
  <a href="https://github.com/lotolab" target="blank"><img src="./docs/lotolab_golden.svg" width="120" alt="Tsai Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/l/%40tsailab%2Fcli?color=%23FFDEAD&label=@tsai" alt="License" /></a>
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/v/@tsailab/cli.svg?label=Cli" alt="Tsai cli" /></a>
  <a href="https://discord.gg/lotolab" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://x.com/lamborghini171" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/dm/%40tsailab%2Fcli?style=flat&logoColor=%23FA0809" alt="Downloads" /></a>
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

> Tsai monorepo workspace struct

```text
━┳ Root
 ┣━┳ apps               // micro apps
   ┣━━ tsai-admin       // admin service
   ┣━━ some-app

 ┗━┳ packages   // libaray  
   ┣━━ common   // lib common depence
   ┣━━ core     // tsai core feature
   ┣━━ uc-orm   // 

```

Learn more in the [Nestjs official documentation](https://docs.nestjs.com/cli/overview).

### Publish libaray

> If you want publishing your libs privately and publically,you add an pnpm workspace file which named \'pnpm-workspace.yaml\'
> 

```
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

## Stay in touch

- Twitter - [@lamborghini171](https://twitter.com/lamborghini171)

## License

Tsai-plat is [MIT licensed](LICENSE).
