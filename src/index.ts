
/* IMPORT */

import os from 'node:os';
import WorkTank from 'worktank';
import readAtomically from './read_atomically';
import readParser from './read_parser';
import readWorker from './read_worker';
import Utils from './utils';
import type {Parser, PromiseValue, Options} from './types';

/* MAIN */

const ripread = async <T> ( filePaths: string[], options: Partial<Options<T>> = {} ): Promise<(PromiseValue<T> | Error)[]> => {

  const poolSize = options.poolSize ?? Math.max ( 2, Math.floor ( os.cpus ().length / 2 ) - 1 );
  const batchSize = options.poolBatchSize ?? Math.min ( 100, Math.max ( 2, Math.round ( filePaths.length / poolSize ) ) );
  const fileChunkSize = options.poolFileChunkSize ?? 384000;
  const parser = options.parser ?? Utils.identity as Parser<T>; //TSC

  const batches = Utils.chunk ( filePaths, batchSize );
  const pool = new WorkTank ({ name: 'ripread', size: poolSize, methods: { read: readWorker } });
  const poolExec = ( batch: string[] ) => pool.exec ( 'read', [batch, fileChunkSize] ).catch ( () => new Array<null> ( batch.length ).fill ( null ) ).then ( contents => readAtomically ( batch, contents ) ).then ( contents => readParser<T> ( batch, contents, parser ) );
  const poolTerminate = () => pool.terminate ();
  const poolContents = await Promise.all ( batches.map ( poolExec ) ).finally ( poolTerminate );
  const contents = poolContents.flat ();

  return contents;

};

/* EXPORT */

export default ripread;
