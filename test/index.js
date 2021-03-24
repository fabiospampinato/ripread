
/* IMPORT */

const {strictEqual} = require ( 'assert' ),
      ripread = require ( '../dist' ).default,
      populate = require ( './populate' );

/* TEST */

const test = async () => {

  const {filesPaths, filesContents} = populate (),
        contents = await ripread ( filesPaths );

  filesContents.forEach ( ( content, index ) => {

    strictEqual ( contents[index], content );

  });

};

/* RUN */

test ();
