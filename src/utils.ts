
/* MAIN */

const Utils = {

  /* API */

  chunk: <T> ( arr: T[], size: number ): T[][] => {

    if ( arr.length <= size ) return [arr];

    const length = Math.ceil ( arr.length / size );
    const chunks: T[][] = new Array ( length );

    for ( let i = 0; i < length; i++ ) {

      chunks[i] = arr.slice ( size * i, size * ( i + 1 ) );

    }

    return chunks;

  },

  identity: <T> ( value: T ): T => {

    return value;

  }

};

/* EXPORT */

export default Utils;
