
/* IMPORT */

import {readFile} from 'atomically';

/* READ ATOMICALLY */

const readAtomically = async ( filePaths: string[], contents: (string | null)[] ): Promise<(string | Error)[]> => {

  const promises: Promise<string>[] = [];

  for ( let i = 0, l = contents.length; i < l; i++ ) {

    const content = contents[i];

    if ( content !== null ) continue; // Read correctly already

    promises[promises.length] = readFile ( filePaths[i], 'utf8' ).then ( content => contents[i] = content, error => contents[i] = error );

  }

  await Promise.all ( promises );

  return contents as (string | Error)[];

};

/* EXPORT */

export default readAtomically;
