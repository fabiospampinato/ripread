
/* MAIN */

type Callback<T> = ( error: Error | null, value: T ) => void;

type Parser<T> = ( filePath: string, content: string | Error ) => T;

type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value> ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1] : Otherwise; //URL: https://github.com/sindresorhus/type-fest/blob/HEAD/source/promise-value.d.ts

type Options<T> = {
  parser?: Parser<T>,
  poolSize: number,
  poolBatchSize: number,
  poolFileChunkSize: number
};

/* EXPORT */

export type {Callback, Parser, PromiseValue, Options};
