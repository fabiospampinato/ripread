# `ripread`

Read lots of files as if a saber-tooth tiger is chasing you!

## Features

- **Fast**: This is designed to read lots of textual files as fast as possible, and it's probably at least ~2x faster than whatever you are doing currently. If you know how to speed it up further ping me.
- **Reliable**: Files are read reliably, which is something especially important when you are reading thousands of them, chances are the current way you are reading files doesn't account for EMFILE errors at all for example.
- **Non-blocking**: Almost all the work is performed in worker threads, so you'll experience no freezes in the main thread.
- **Non-native**: By using native modules perhaps some more overhead could be trimmed, but native modules are a pain to work with, this uses none of them.

## Install

```sh
npm install --save ripread
```

## Usage

The following interface is provided:

```ts
function ripread ( filePaths: string[] ): (string | Error)[];
```

This library exposes a single function, you pass it an array of absolute paths and it returns to you a promise to an array containing either string contents or `Error` instances, in case the correspending files couldn't be read successfully.

```ts
import ripread from 'ripread';

const filePaths = ['/foo/bar', /* many more absolute paths */];

const contents = await ripread ( filePaths );

console.log ( contents ); // ['content...', /* many more content strings */]
```

## License

MIT © Fabio Spampinato
