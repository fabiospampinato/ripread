
/* IMPORT */

import {readFile} from 'atomically';

/* READ ATOMICALLY */

const readAtomically = async ( filePaths: string[], contents: (string | null)[] ): Promise<string[]> => {

  const promises: Promise<void>[] = [];

  for ( let i = 0, l = contents.length; i < l; i++ ) {

    const content = contents[i];

    if ( content !== null ) continue; // Read correctly already

    promises[promises.length] = readFile ( filePaths[i], 'utf8' ).then ( content => { contents[i] = content } );

  }

  await Promise.all ( promises );

  return contents as string[];

};

/* EXPORT */

export default readAtomically;
