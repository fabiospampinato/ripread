
/* UTILS */

const Utils = {

  /* API */

  chunk: <T> ( arr: T[], size: number ): T[][] => {

    if ( arr.length <= size ) return [arr];

    const length = Math.ceil ( arr.length / size ),
          chunks: T[][] = new Array ( length );

    for ( let i = 0; i < length; i++ ) {

      chunks[i] = arr.slice ( size * i, size * ( i + 1 ) );

    }

    return chunks;

  },

  flatten: <T> ( arr: T[][] ): T[] => {

    return ( <T[]> [] ).concat ( ...arr );

  }

};

/* EXPORT */

export default Utils;
