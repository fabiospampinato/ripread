
/* IMPORT */

import fs from 'fs';
import path from 'path';

/* MAIN */

const populate = () => {

  /* ROOT */

  const rootPath = path.join ( process.cwd (), 'test', 'dump' );

  fs.mkdirSync ( rootPath, { recursive: true } );

  /* FILES */

  const files = [];
  const filesPaths = [];
  const filesContents = [];

  /* EMPTY FILES */

  for ( let i = 0; i < 100; i++ ) {

    const filePath = path.join ( rootPath, `${i}.txt` );
    const fileContent = '';
    const file = {filePath, fileContent};

    if ( !fs.existsSync ( filePath ) ) {

      fs.writeFileSync ( filePath, fileContent );

    }

    files.push ( file );
    filesPaths.push ( filePath );
    filesContents.push ( fileContent );

  }

  /* SMALL FILES */

  for ( let i = 100; i < 10000; i++ ) {

    const filePath = path.join ( rootPath, `${i}.txt` );
    const fileContent = 'a'.repeat ( 5000 );
    const file = {filePath, fileContent};

    if ( !fs.existsSync ( filePath ) ) {

      fs.writeFileSync ( filePath, fileContent );

    }

    files.push ( file );
    filesPaths.push ( filePath );
    filesContents.push ( fileContent );

  }

  /* LARGE FILES */

  for ( let i = 10000; i < 10010; i++ ) {

    const filePath = path.join ( rootPath, `${i}.txt` );
    const fileContent = 'a'.repeat ( 1000000 );
    const file = {filePath, fileContent};

    if ( !fs.existsSync ( filePath ) ) {

      fs.writeFileSync ( filePath, fileContent );

    }

    files.push ( file );
    filesPaths.push ( filePath );
    filesContents.push ( fileContent );

  }

  /* RETURN */

  return {rootPath, files, filesPaths, filesContents};

};

/* EXPORT */

export default populate;
