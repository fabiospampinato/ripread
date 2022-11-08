
/* IMPORT */

import Utils from './utils';
import type {Parser, PromiseValue} from './types';

/* MAIN */

const readParser = async <T> ( filePaths: string[], contents: (string | Error)[], parser: Parser<T> ): Promise<(PromiseValue<T> | Error)[]> => {

  if ( parser === Utils.identity ) return contents as (PromiseValue<T> | Error)[];

  const promises: Promise<PromiseValue<T>>[] = [];

  for ( let i = 0, l = contents.length; i < l; i++ ) {

    const content = contents[i];
    const filePath = filePaths[i];

    promises[promises.length] = new Promise ( resolve => resolve ( parser ( filePath, content ) ) ).then ( ( content: any ) => contents[i] = content, error => contents[i] = error ); //TSC

  }

  await Promise.all ( promises );

  return contents as (PromiseValue<T> | Error)[];

};

/* EXPORT */

export default readParser;
