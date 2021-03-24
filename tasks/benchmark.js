
/* IMPORT */

const {readFile} = require ( 'atomically' ),
      {readFileSync} = require ( 'fs' ),
      {default: ripread} = require ( '../dist' ),
      {filesPaths} = require ( '../test/populate' )();

/* BENCHMARK */

const benchmark = async () => {

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

benchmark ();
