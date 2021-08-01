
/* IMPORT */

const fs = require ( 'fs' ),
      path = require ( 'path' );

/* POPULATE */

const populate = () => {

  /* ROOT */

  const rootPath = path.join ( __dirname, 'dump' );

  fs.mkdirSync ( rootPath, { recursive: true } );

  /* FILES */

  const files = [],
        filesPaths = [],
        filesContents = [];

  /* EMPTY FILES */

  for ( let i = 0; i < 100; i++ ) {

    const filePath = path.join ( rootPath, `${i}.txt` ),
          fileContent = '',
          file = {filePath, fileContent};

    if ( !fs.existsSync ( filePath ) ) {

      fs.writeFileSync ( filePath, fileContent );

    }

    files.push ( file );
    filesPaths.push ( filePath );
    filesContents.push ( fileContent );

  }

  /* SMALL FILES */

  for ( let i = 100; i < 10000; i++ ) {

    const filePath = path.join ( rootPath, `${i}.txt` ),
          fileContent = 'a'.repeat ( 5000 ),
          file = {filePath, fileContent};

    if ( !fs.existsSync ( filePath ) ) {

      fs.writeFileSync ( filePath, fileContent );

    }

    files.push ( file );
    filesPaths.push ( filePath );
    filesContents.push ( fileContent );

  }

  /* LARGE FILES */

  for ( let i = 10000; i < 10010; i++ ) {

    const filePath = path.join ( rootPath, `${i}.txt` ),
          fileContent = 'a'.repeat ( 1000000 ),
          file = {filePath, fileContent};

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

module.exports = populate;
