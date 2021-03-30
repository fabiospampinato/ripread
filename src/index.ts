
/* IMPORT */

import * as os from 'os';
import WorkTank from 'worktank';
import {Options} from './types';
import readAtomically from './read_atomically';
import readWorker from './read_worker';
import Utils from './utils';

/* RIPREAD */

const ripread = async ( filePaths: string[], options: Partial<Options> = {} ): Promise<(string | Error)[]> => {

  const poolSize = options.poolSize ?? Math.max ( 2, Math.floor ( os.cpus ().length / 2 ) - 1 ),
        batchSize = options.poolBatchSize ?? Math.min ( 100, Math.max ( 2, Math.round ( filePaths.length / poolSize ) ) ),
        fileChunkSize = options.poolFileChunkSize ?? 384000;

  const batches = Utils.chunk ( filePaths, batchSize ),
        pool = new WorkTank ({ name: 'ripread', size: poolSize, methods: { read: readWorker } }),
        poolExec = ( batch: string[] ) => pool.exec ( 'read', [batch, fileChunkSize] ).catch ( () => new Array<null> ( batch.length ).fill ( null ) ).then ( contents => readAtomically ( batch, contents ) ),
        poolTerminate = () => pool.terminate (),
        poolContents = await Promise.all ( batches.map ( poolExec ) ).finally ( poolTerminate ),
        contents = Utils.flatten ( poolContents );

  return contents;

};

/* EXPORT */

export default ripread;
