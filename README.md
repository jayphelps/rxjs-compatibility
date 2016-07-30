# rxjs-compatibility

Convert Observables from RxJS [v5](http://github.com/ReactiveX/RxJS) to [v4](https://github.com/Reactive-Extensions/RxJS) and vice versa.

## Please upgrade to 100% RxJS v5 ASAP

This library is meant as a stop gap to help ease migration progressively, not as a band-aid for indefinite interop.

## Install

This has a peer dependencies of `rxjs@5.*.*` and `rx@4.*.*`, which will have to be installed as well.

```sh
npm install --save rxjs-compatibility
```

## Usage

> Note: this library does _not_ provide _automatic_ interop between the two for cases like `ObservableV4.from(v5)`, `v4.flatMap(() => v5)`, etc. You must explicitly "convert" between the two.

When you convert from one Observable version to the other, keep in mind that if it's currently in v4 "mode", you'll only have v4 operators until you convert it back to v5 and vice versa. Effectively the result of one is piped into the other, just like how normal operators work.

### Operators

The most ergonomic way to convert between the two versions is via the included operators patched on both Observable prototypes.

At some entry point file, you first run this to patch them:

```js
import { patchObservables } from 'rxjs-compatibility';

patchObservables();
```

If you need to customize what Observable prototypes get patched, you can optionally provide them as v4 and v5 arguments:

```js
patchObservables(ObservableV4, ObservableV5);
```

This is usually only neccesary when you're not using CommonJS modules. e.g. UMD builds of v4 and v5 use the same global variable `window.Rx` so you need to [store them elsewhere](http://jsbin.com/foqara/edit?html,js,output) and then provide them to the `patchObservable` call.

#### stream$.v4()

Converts the current Observable to a v4 Observable. Exists and works on both v5 Observables and ones that are already v4 too, in which case they just return `this`.

```js
RxV5.Observable.of(1, 2, 3)
  .v4()
  .select(num => num + 1)
  .subscribe(value => console.log(value));

// 2, 3, 4
```

#### stream$.v5()

Converts the current Observable to a v5 Observable. Exists and works on both v4 Observables and ones that are already v5 too, in which case they just return `this`.

```js
RxV4.Observable.of(1, 2, 3)
  .v5()
  .map(num => num + 1)
  .subscribe(value => console.log(value));

// 2, 3, 4
```

#### Demo

You can give it a spin in JSBin: http://jsbin.com/foqara/edit?js,output

Notice that because JSBin doesn't support a module system and instead uses global variables, you have to provide the Observable classes you want to patch.

### Utility helpers

If you need to convert an existing observable and don't want to (or can't) patch the prototype, you can use the provided helpers:

```js
import { toV4, toV5 } from 'rxjs-compatibility';

const v5 = ObservableV5.of(1, 2, 3);

toV4(v5) instanceof ObservableV4;
// true
```
