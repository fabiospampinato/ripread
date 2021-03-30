
/* IMPORT */

import * as os from 'os';
import WorkTank from 'worktank';
import {Parser, PromiseValue, Options} from './types';
import readAtomically from './read_atomically';
import readParser from './read_parser';
import readWorker from './read_worker';
import Utils from './utils';

/* RIPREAD */

const ripread = async <T> ( filePaths: string[], options: Partial<Options<T>> = {} ): Promise<(PromiseValue<T> | Error)[]> => {

  const poolSize = options.poolSize ?? Math.max ( 2, Math.floor ( os.cpus ().length / 2 ) - 1 ),
        batchSize = options.poolBatchSize ?? Math.min ( 100, Math.max ( 2, Math.round ( filePaths.length / poolSize ) ) ),
        fileChunkSize = options.poolFileChunkSize ?? 384000,
        parser = options.parser ?? Utils.noop as Parser<T>; //TSC

  const batches = Utils.chunk ( filePaths, batchSize ),
        pool = new WorkTank ({ name: 'ripread', size: poolSize, methods: { read: readWorker } }),
        poolExec = ( batch: string[] ) => pool.exec ( 'read', [batch, fileChunkSize] ).catch ( () => new Array<null> ( batch.length ).fill ( null ) ).then ( contents => readAtomically ( batch, contents ) ).then ( contents => readParser<T> ( batch, contents, parser ) ),
        poolTerminate = () => pool.terminate (),
        poolContents = await Promise.all ( batches.map ( poolExec ) ).finally ( poolTerminate ),
        contents = Utils.flatten ( poolContents );

  return contents;

};

/* EXPORT */

export default ripread;
