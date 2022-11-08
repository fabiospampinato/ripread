
/* IMPORT */

import {strictEqual} from 'node:assert';
import ripread from '../dist/index.js';
import populate from './populate.js';

/* MAIN */

const main = async () => {

  const {filesPaths, filesContents} = populate ();
  const contents = await ripread ( filesPaths );

  filesContents.forEach ( ( content, index ) => {

    strictEqual ( contents[index], content );

  });

};

/* RUN */

main ();
