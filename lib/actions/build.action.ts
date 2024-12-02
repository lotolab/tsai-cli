import * as chalk from 'chalk';
import { join } from 'path';
import * as ts from 'typescript';
import { Input } from '../../commands';
import { AssetsManager } from '../compiler/assets-manager';
import { deleteOutDirIfEnabled } from '../compiler/helpers/delete-out-dir';
import { getBuilder } from '../compiler/helpers/get-builder';
import { getTscConfigPath } from '../compiler/helpers/get-tsc-config.path';
import { getValueOrDefault } from '../compiler/helpers/get-value-or-default';
import { getWebpackConfigPath } from '../compiler/helpers/get-webpack-config-path';
import { TsConfigProvider } from '../compiler/helpers/tsconfig-provider';
import { PluginsLoader } from '../compiler/plugins/plugins-loader';
import { TypeScriptBinaryLoader } from '../compiler/typescript-loader';
import {
  Configuration,
  ConfigurationLoader,
  NestConfigurationLoader,
} from '../configuration';
import {
  defaultOutDir,
  defaultWebpackConfigFilename,
} from '../configuration/defaults';
import { FileSystemReader } from '../readers';
import { ERROR_PREFIX, INFO_PREFIX } from '../ui';
import { isModuleAvailable } from '../utils/is-module-available';
import { AbstractAction } from './abstract.action';
import webpack = require('webpack');

export class BuildAction extends AbstractAction {
  protected readonly pluginsLoader = new PluginsLoader();
  protected readonly tsLoader = new TypeScriptBinaryLoader();
  protected readonly tsConfigProvider = new TsConfigProvider(this.tsLoader);
  protected readonly fileSystemReader = new FileSystemReader(process.cwd());
  protected readonly loader: ConfigurationLoader = new NestConfigurationLoader(
    this.fileSystemReader,
  );
  protected readonly assetsManager = new AssetsManager();

  public async handle(commandInputs: Input[], commandOptions: Input[]) {
    try {
      const watchModeOption = commandOptions.find(
        (option) => option.name === 'watch',
      );
      const watchMode = !!(watchModeOption && watchModeOption.value);

      const watchAssetsModeOption = commandOptions.find(
        (option) => option.name === 'watchAssets',
      );
      const watchAssetsMode = !!(
        watchAssetsModeOption && watchAssetsModeOption.value
      );

      await this.runBuild(
        commandInputs,
        commandOptions,
        watchMode,
        watchAssetsMode,
      );
    } catch (err) {
      if (err instanceof Error) {
        console.log(`\n${ERROR_PREFIX} ${err.message}\n`);
      } else {
        console.error(`\n${chalk.red(err)}\n`);
      }
      process.exit(1);
    }
  }

  public async runBuild(
    commandInputs: Input[],
    commandOptions: Input[],
    watchMode: boolean,
    watchAssetsMode: boolean,
    isDebugEnabled = false,
    onSuccess?: () => void,
  ) {
    const configFileName = commandOptions.find(
      (option) => option.name === 'config',
    )!.value as string;
    const configuration = await this.loader.load(configFileName);
    const appName = commandInputs.find((input) => input.name === 'app')!
      .value as string;

    const pathToTsconfig = getTscConfigPath(
      configuration,
      commandOptions,
      appName,
    );
    const { options: tsOptions } =
      this.tsConfigProvider.getByConfigFilename(pathToTsconfig);
    const outDir = tsOptions.outDir || defaultOutDir;

    const isWebpackEnabled = getValueOrDefault<boolean>(
      configuration,
      'compilerOptions.webpack',
      appName,
      'webpack',
      commandOptions,
    );
    const builder = isWebpackEnabled
      ? { type: 'webpack' }
      : getBuilder(configuration, commandOptions, appName);

    await deleteOutDirIfEnabled(configuration, appName, outDir);
    this.assetsManager.copyAssets(
      configuration,
      appName,
      outDir,
      watchAssetsMode,
    );

    const typeCheck = getValueOrDefault<boolean>(
      configuration,
      'compilerOptions.typeCheck',
      appName,
      'typeCheck',
      commandOptions,
    );
    if (typeCheck && builder.type !== 'swc') {
      console.warn(
        INFO_PREFIX +
          ` "typeCheck" will not have any effect when "builder" is not "swc".`,
      );
    }

    switch (builder.type) {
      case 'tsc':
        return this.runTsc(
          watchMode,
          commandOptions,
          configuration,
          pathToTsconfig,
          appName,
          onSuccess,
        );
      case 'webpack':
        return this.runWebpack(
          configuration,
          appName,
          commandOptions,
          pathToTsconfig,
          isDebugEnabled,
          watchMode,
          onSuccess,
        );
      case 'swc':
        return this.runSwc(
          configuration,
          appName,
          pathToTsconfig,
          watchMode,
          commandOptions,
          tsOptions,
          onSuccess,
        );
    }
  }

  private async runSwc(
    configuration: Required<Configuration>,
    appName: string,
    pathToTsconfig: string,
    watchMode: boolean,
    options: Input[],
    tsOptions: ts.CompilerOptions,
    onSuccess: (() => void) | undefined,
  ) {
    const { SwcCompiler } = await import('../compiler/swc/swc-compiler');
    const swc = new SwcCompiler(this.pluginsLoader);
    await swc.run(
      configuration,
      pathToTsconfig,
      appName,
      {
        watch: watchMode,
        typeCheck: getValueOrDefault<boolean>(
          configuration,
          'compilerOptions.typeCheck',
          appName,
          'typeCheck',
          options,
        ),
        tsOptions,
        assetsManager: this.assetsManager,
      },
      onSuccess,
    );
  }

  private async runWebpack(
    configuration: Required<Configuration>,
    appName: string,
    commandOptions: Input[],
    pathToTsconfig: string,
    debug: boolean,
    watchMode: boolean,
    onSuccess: (() => void) | undefined,
  ) {
    const { WebpackCompiler } = await import('../compiler/webpack-compiler');
    const webpackCompiler = new WebpackCompiler(this.pluginsLoader);

    const webpackPath =
      getWebpackConfigPath(configuration, commandOptions, appName) ??
      defaultWebpackConfigFilename;

    const webpackConfigFactoryOrConfig = this.getWebpackConfigFactoryByPath(
      webpackPath,
      defaultWebpackConfigFilename,
    );
    return webpackCompiler.run(
      configuration,
      pathToTsconfig,
      appName,
      {
        inputs: commandOptions,
        webpackConfigFactoryOrConfig,
        debug,
        watchMode,
        assetsManager: this.assetsManager,
      },
      onSuccess,
    );
  }

  private async runTsc(
    watchMode: boolean,
    options: Input[],
    configuration: Required<Configuration>,
    pathToTsconfig: string,
    appName: string,
    onSuccess: (() => void) | undefined,
  ) {
    if (watchMode) {
      const { WatchCompiler } = await import('../compiler/watch-compiler');
      const watchCompiler = new WatchCompiler(
        this.pluginsLoader,
        this.tsConfigProvider,
        this.tsLoader,
      );
      const isPreserveWatchOutputEnabled = options.find(
        (option) =>
          option.name === 'preserveWatchOutput' && option.value === true,
      )?.value as boolean | undefined;
      watchCompiler.run(
        configuration,
        pathToTsconfig,
        appName,
        { preserveWatchOutput: isPreserveWatchOutputEnabled },
        onSuccess,
      );
    } else {
      const { Compiler } = await import('../compiler/compiler');
      const compiler = new Compiler(
        this.pluginsLoader,
        this.tsConfigProvider,
        this.tsLoader,
      );
      compiler.run(
        configuration,
        pathToTsconfig,
        appName,
        undefined,
        onSuccess,
      );
      this.assetsManager.closeWatchers();
    }
  }

  private getWebpackConfigFactoryByPath(
    webpackPath: string,
    defaultPath: string,
  ): (
    config: webpack.Configuration,
    webpackRef: typeof webpack,
  ) => webpack.Configuration {
    const pathToWebpackFile = join(process.cwd(), webpackPath);
    const isWebpackFileAvailable = isModuleAvailable(pathToWebpackFile);
    if (!isWebpackFileAvailable && webpackPath === defaultPath) {
      return ({}) => ({});
    }
    return require(pathToWebpackFile);
  }
}
