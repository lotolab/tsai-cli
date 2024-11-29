import { join } from 'path';
import {
  PnpmPackageManager,
  PackageManagerCommands,
} from '../../../lib/package-managers';
import { PnpmRunner } from '../../../lib/runners/pnpm.runner';

jest.mock('../../../lib/runners/pnpm.runner');

describe('PnpmPackageManager', () => {
  let packageManager: PnpmPackageManager;
  beforeEach(() => {
    (PnpmRunner as any).mockClear();
    (PnpmRunner as any).mockImplementation(() => {
      return {
        run: (): Promise<void> => Promise.resolve(),
      };
    });
    packageManager = new PnpmPackageManager();
  });
  it('should be created', () => {
    expect(packageManager).toBeInstanceOf(PnpmPackageManager);
  });
  it('should have the correct cli commands', () => {
    const expectedValues: PackageManagerCommands = {
      install: 'install --strict-peer-dependencies=false',
      add: 'install --strict-peer-dependencies=false',
      update: 'update',
      remove: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
      silentFlag: '--reporter=silent',
    };
    expect(packageManager.cli).toMatchObject(expectedValues);
  });
  describe('install', () => {
    it('should use the proper command for installing', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dirName = '/tmp';
      const testDir = join(process.cwd(), dirName);
      packageManager.install(dirName, 'pnpm');
      expect(spy).toBeCalledWith(
        'install --strict-peer-dependencies=false --reporter=silent',
        true,
        testDir,
      );
    });
  });
  describe('addProduction', () => {
    it('should use the proper command for adding production dependencies', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dependencies = ['@nestjs/common', '@nestjs/core'];
      const tag = '5.0.0';
      const command = `install --strict-peer-dependencies=false --save ${dependencies
        .map((dependency) => `${dependency}@${tag}`)
        .join(' ')}`;
      packageManager.addProduction(dependencies, tag);
      expect(spy).toBeCalledWith(command, true);
    });
  });
  describe('addDevelopment', () => {
    it('should use the proper command for adding development dependencies', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dependencies = ['@nestjs/common', '@nestjs/core'];
      const tag = '5.0.0';
      const command = `install --strict-peer-dependencies=false --save-dev ${dependencies
        .map((dependency) => `${dependency}@${tag}`)
        .join(' ')}`;
      packageManager.addDevelopment(dependencies, tag);
      expect(spy).toBeCalledWith(command, true);
    });
  });
  describe('updateProduction', () => {
    it('should use the proper command for updating production dependencies', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dependencies = ['@nestjs/common', '@nestjs/core'];
      const command = `update ${dependencies.join(' ')}`;
      packageManager.updateProduction(dependencies);
      expect(spy).toBeCalledWith(command, true);
    });
  });
  describe('updateDevelopment', () => {
    it('should use the proper command for updating development dependencies', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dependencies = ['@nestjs/common', '@nestjs/core'];
      const command = `update ${dependencies.join(' ')}`;
      packageManager.updateDevelopment(dependencies);
      expect(spy).toBeCalledWith(command, true);
    });
  });
  describe('upgradeProduction', () => {
    it('should use the proper command for upgrading production dependencies', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dependencies = ['@nestjs/common', '@nestjs/core'];
      const tag = '5.0.0';
      const uninstallCommand = `uninstall --save ${dependencies.join(' ')}`;

      const installCommand = `install --strict-peer-dependencies=false --save ${dependencies
        .map((dependency) => `${dependency}@${tag}`)
        .join(' ')}`;

      return packageManager.upgradeProduction(dependencies, tag).then(() => {
        expect(spy.mock.calls).toEqual([
          [uninstallCommand, true],
          [installCommand, true],
        ]);
      });
    });
  });
  describe('upgradeDevelopment', () => {
    it('should use the proper command for upgrading production dependencies', () => {
      const spy = jest.spyOn((packageManager as any).runner, 'run');
      const dependencies = ['@nestjs/common', '@nestjs/core'];
      const tag = '5.0.0';
      const uninstallCommand = `uninstall --save-dev ${dependencies.join(' ')}`;

      const installCommand = `install --strict-peer-dependencies=false --save-dev ${dependencies
        .map((dependency) => `${dependency}@${tag}`)
        .join(' ')}`;

      return packageManager.upgradeDevelopment(dependencies, tag).then(() => {
        expect(spy.mock.calls).toEqual([
          [uninstallCommand, true],
          [installCommand, true],
        ]);
      });
    });
  });
});
