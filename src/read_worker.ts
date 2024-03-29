
/* IMPORT */

import type {Callback} from './types';

/* MAIN */

// It's important that this function doesn't depend on the closure and can just be extracted by calling `#toString` on it

function readWorker ( filePaths: string[], fileChunkSize: number ): Promise<(string | null)[]> {

  /* CACHE */

  const getCached = <T> ( key: string, get: () => T ): T => {

    return globalThis[key] ||= get ();

  };

  /* POOL */ // Reusing buffers as much as possible

  const POOL = getCached ( 'POOL', () => {

    const pool: Buffer[] = [];

    const alloc = (): Buffer => {
      return pool.pop () || Buffer.allocUnsafeSlow ( fileChunkSize );
    };

    const release = ( buffer: Buffer ): void => {
      pool[pool.length] = buffer;
    };

    return {alloc, release};

  });

  /* PATH */

  const PATH = getCached ( 'PATH', () => {

    return import ( 'node:path' ).then ( path => path.default );

  });

  /* FILESYSTEM */ // Filesystem wrapper that's as close to the metal as Node possibly allows for

  const FS = getCached ( 'FS', () => {

    const fs = process['binding']( 'fs' );
    const {open, close, read, FSReqCallback} = fs;

    const fileOpen = ( filePath: string, flags: number, mode: number, callback: Callback<number> ): void => {
      const req = new FSReqCallback ();
      req.oncomplete = callback;
      if ( process.platform === 'win32' ) {
        PATH.then ( path => {
          open ( path.toNamespacedPath ( filePath ), flags, mode, req );
        });
      } else {
        open ( filePath, flags, mode, req );
      }
    };

    const fileClose = ( fd: number, callback: Callback<never> ): void => {
      const req = new FSReqCallback ();
      req.oncomplete = callback;
      close ( fd, req );
    };

    const fileRead = ( fd: number, buffer: Buffer, offset: number, length: number, position: number, callback: Callback<number> ): void => {
      const req = new FSReqCallback ();
      req.oncomplete = callback;
      read ( fd, buffer, offset, length, position, req );
    };

    const fileReadChunks = ( chunks: Buffer[], fd: number, position: number, callback: Callback<string> ): void => {
      const chunk: Buffer = POOL.alloc ();
      FS.fileRead ( fd, chunk, 0, chunk.length, position, ( error: Error | null, bytesRead: number ): void => {
        if ( error ) {
          POOL.release ( chunk );
          chunks.forEach ( POOL.release );
          return callback ( error, '' );
        }
        if ( bytesRead ) {
          chunks[chunks.length] = chunk;
        } else {
          POOL.release ( chunk );
        }
        if ( bytesRead < chunk.length ) { // Fewer bytes than maximally allowed got read, it's safe to consider the end of the file reached
          if ( chunks.length === 0 ) { // No chunks, empty file
            callback ( null, '' );
          } else if ( chunks.length === 1 ) { // Single chunk, no merging required
            const chunk = chunks[chunks.length - 1];
            const content = chunk.toString ( 'utf8', 0, bytesRead );
            POOL.release ( chunk );
            callback ( null, content );
          } else { // Multiple chunks, merge required
            const chunk = chunks[chunks.length - 1];
            const length = chunks.reduce ( ( total, chunk ) => total + chunk.length, 0 ) - ( chunk.length - bytesRead );
            const contentBuffer = Buffer.concat ( chunks, length );
            const content = contentBuffer.toString ( 'utf8', 0, length );
            POOL.release ( contentBuffer );
            chunks.forEach ( POOL.release );
            callback ( null, content );
          }
        } else { // Exactly as many bytes as maximally allowed got read, we aren't at EOL yet, probably, let's keep reading
          fileReadChunks ( chunks, fd, position + bytesRead, callback );
        }
      });
    };

    return {fileOpen, fileClose, fileRead, fileReadChunks};

  });

  /* EXECUTING */

  return new Promise ( resolve => {

    /* CONTEXT */

    const {length} = filePaths;
    const contents: (string | null)[] = new Array ( length );

    let pending = length;

    /* EVENTS */

    const onTick = (): void => {
      pending -= 1;
      if ( pending ) return;
      resolve ( contents );
    };

    /* READING */

    for ( let i = 0; i < length; i++ ) {

      FS.fileOpen ( filePaths[i], 0, 0o666, ( error: Error | null, fd: number ): void => {

        if ( error ) {

          contents[i] = null;

          return onTick ();

        }

        FS.fileReadChunks ( [], fd, 0, ( error: Error | null, content: string ): void => {

          if ( error )  {

            contents[i] = null;

            return FS.fileClose ( fd, onTick );

          } else {

            contents[i] = content;

            return FS.fileClose ( fd, onTick );

          }

        });

      });

    }

  });

};

/* EXPORT */

export default readWorker;
