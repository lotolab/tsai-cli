<p align="center" >
  <a href="https://github.com/lotolab" target="blank"><img src="./docs/lotolab_golden.svg" width="120" alt="Tsai Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/l/%40tsailab%2Fcli?color=%23FFDEAD&label=TSAI" alt="License" /></a>
  <a href="https://discord.gg/lotolab" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://x.com/lamborghini171" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>  
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/v/@tsailab/cli.svg?label=@tsailab/cli" alt="Tsai cli" /></a>
  <a href="https://www.npmjs.com/~tsailab" target="_blank"><img src="https://img.shields.io/npm/dm/%40tsailab%2Fcli?style=flat&logoColor=%23FA0809" alt="Downloads" /></a>
</p>

## Description

The Tsai CLI is extends from nestjs cli.
It is a command-line interface tool that helps you to initialize, develop, and maintain your Nestjs monorepo workspace. It assists in multiple ways, including scaffolding the project, serving it in development mode, and building and bundling the application for production distribution. It embodies best-practice architectural patterns to encourage well-structured apps.

The CLI works with [schematics](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/schematics), and provides built in support from the schematics collection at [@tsailab/schematics](https://github.com/lotolab/tsai-schematics).

> Tsai monorepo workspace struct

```text
━┳ Root
 ┣━┳ apps               // micro apps
   ┣━━ tsai-admin       // admin service
   ┣━━ some-app

 ┗━┳ libs   // project libaraies  
   ┣━━ biz-lib   // lib common depence

 ┗━┳ packages   // public libaraies  
   ┣━━ common   // lib common depence
   ┣━━ core     // tsai core feature
   ┣━━ uc-orm   // 

 ┣━ package.json
 ┣━ pnpm-workspace.yaml
 ·
 ·
 ·
```

## Installation
```
$ npm install -g @tsailab/cli
```

- show commands help

```
$ tsai -h
$ tsai g --help
```

## Usage

### How create a new monorepo project

> Create an monorepo workspace by tsai step by step

1. create application

```
$ tsai new tsai-plat --directory ./mono-root
```

2. convert this project to monorepo workspace

```
$ cd mono-root
$ tsai g app tsai-admin 
```

3. create project library 

```
tsai g lib biz-lib
```

4. create an public package 

  - <p color="red"> use option -P or --pkg-public </p>

```
tsai g lib core -P
```


:boom: :boom: :boom: :star2: :star2: :two_hearts: :two_hearts: :two_hearts:

<h4 align="left">
Congratulations, you have completed the creation of the Monorepo project
</h4>

:star: :star: :star: :star: :star: :star: :star: :star:


Learn more in the [Nestjs official documentation](https://docs.nestjs.com/cli/overview).

### Use pnpm management your packages



```bash
# add package denpendency  
pnpm add vue -Sw

# add package to some lib
pnpm -F core add lodash -D --save-peer 

# excute npm scripts
pnpm -F core build
```

Learn more commands in the [Pnpm offcial documentation](https://pnpm.io/workspaces)
 

```
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

## Stay in touch

- Twitter - [@lamborghini171](https://twitter.com/lamborghini171)

:revolving_hearts::revolving_hearts::revolving_hearts: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand::raising_hand::raising_hand::revolving_hearts::revolving_hearts::revolving_hearts:

<font color=#ff8f00 size=4>
Sincerely invite experts to improve the project functions together !
</font>

:revolving_hearts::revolving_hearts::revolving_hearts: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand: :raising_hand::raising_hand::raising_hand::revolving_hearts: :revolving_hearts::revolving_hearts:

## License

Tsai-plat is [MIT licensed](LICENSE).
