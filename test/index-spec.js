/* globals describe it */
import 'babel-polyfill';
import { expect } from 'chai';
import { spy } from 'sinon';
import RxV5 from 'rxjs';
import RxV4 from 'rx';
import { toV5, toV4, patchObservables } from '../';

describe('toV5', () => {
  it('should convert v4 to v5', () => {
    const v4 = RxV4.Observable.of(1, 2, 3);
    const v5 = toV5(v4);

    const next = spy();
    v5.toArray().subscribe(next);

    expect(v5).to.be.an.instanceof(RxV5.Observable);
    expect(v5.flatMapLatest).to.be.undefined;
    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.deep.equal([[1, 2, 3]]);
  });
});

describe('toV4', () => {
  it('should convert v5 to v4', () => {
    const v5 = RxV5.Observable.of(1, 2, 3);
    const v4 = toV4(v5);

    const next = spy();
    v4.toArray().subscribe(next);

    expect(v4).to.be.an.instanceof(RxV4.Observable);
    expect(v4.flatMapLatest).to.be.a('function');
    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.deep.equal([[1, 2, 3]]);
  });
});

describe('patchObservables', () => {
  it('should support converting between v4() and v5()', () => {
    patchObservables();

    const stream$ = RxV5.Observable.of(1, 2, 3)
      .mergeMap(num =>
        RxV4.Observable.of(num)
          .map(num => num + 1)
          .v5()
      )
      .toArray()
      .v4();

    const next = spy();
    stream$.subscribe(next);

    expect(stream$).to.be.an.instanceof(RxV4.Observable);
    expect(next.calledOnce).to.be.true;
    expect(next.args[0]).to.deep.equal([[2, 3, 4]]);
  });
});
