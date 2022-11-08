
/* IMPORT */

import {readFile} from 'atomically';
import {readFileSync} from 'node:fs';
import ripread from '../dist/index.js';
import populate from '../test/populate.js';

/* MAIN */

const main = async () => {

  const {filesPaths} = populate ();

  console.time ( 'ripread' );
  await ripread ( filesPaths );
  console.timeEnd ( 'ripread' );

  console.time ( 'atomically' );
  await Promise.all ( filesPaths.map ( filePath => readFile ( filePath, 'utf8' ) ) );
  console.timeEnd ( 'atomically' );

  console.time ( 'fs.readFileSync' );
  filesPaths.map ( filePath => readFileSync ( filePath, 'utf8' ) );
  console.timeEnd ( 'fs.readFileSync' );

};

/* RUN */

main ();
