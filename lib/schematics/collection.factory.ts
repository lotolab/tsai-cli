import { Runner, RunnerFactory } from '../runners';
import { SchematicRunner } from '../runners/schematic.runner';
import { AbstractCollection } from './abstract.collection';
import { Collection } from './collection';
import { CustomCollection } from './custom.collection';
import { TsaiCollection } from './tsai.collection';
// import { NestCollection } from './nest.collection';

export class CollectionFactory {
  public static create(collection: Collection | string): AbstractCollection {
    const schematicRunner = RunnerFactory.create(
      Runner.SCHEMATIC,
    ) as SchematicRunner;

    if (collection === Collection.NESTJS || collection === Collection.TSAILAB) {
      return new TsaiCollection(schematicRunner);
    } else {
      return new CustomCollection(collection, schematicRunner);
    }
  }
}
