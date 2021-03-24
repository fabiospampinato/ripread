
/* TYPES */

type Callback<T> = ( error: Error | null, value: T ) => void;

type Options = {
  poolSize: number,
  poolBatchSize: number,
  poolFileChunkSize: number
};

/* EXPORT */

export {Callback, Options};
