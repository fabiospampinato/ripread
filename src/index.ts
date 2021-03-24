
/* IMPORT */

import {StaticPool} from 'node-worker-threads-pool';
import * as os from 'os';
import {Options} from './types';
import readAtomically from './read_atomically';
import readWorker from './read_worker';
import Utils from './utils';

/* RIPREAD */

const ripread = async ( filePaths: string[], options: Partial<Options> = {} ): Promise<string[]> => {

  const poolSize = options.poolSize ?? Math.max ( 2, Math.floor ( os.cpus ().length / 2 ) - 1 ),
        batchSize = options.poolBatchSize ?? Math.min ( 100, Math.max ( 2, Math.round ( filePaths.length / poolSize ) ) ),
        fileChunkSize = options.poolFileChunkSize ?? 384000;

  const batches = Utils.chunk ( filePaths, batchSize ),
        pool = new StaticPool ({ size: poolSize, task: readWorker }),
        poolCleanup = () => pool.destroy (),
        poolContents = await Promise.all ( batches.map ( chunk => pool.exec ([ chunk, fileChunkSize ]) ) ).finally ( poolCleanup ),
        contentsUnreliable = Utils.flatten ( poolContents ),
        contentsReliable = await readAtomically ( filePaths, contentsUnreliable );

  return contentsReliable;

};

/* EXPORT */

export default ripread;
