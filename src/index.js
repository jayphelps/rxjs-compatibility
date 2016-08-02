import { Observable as ObservableV5 } from 'rxjs/Observable';
import { Observable as ObservableV4 } from 'rx';

export function toV5(input$, V5 = ObservableV5) {
  if (input$ instanceof V5) {
    return input$;
  } else {
    return V5.create(observer => {
      const subscription = input$.subscribe(
        observer.next.bind(observer),
        observer.error.bind(observer),
        observer.complete.bind(observer)
      );

      return () => subscription.dispose();
    });
  }
}

export function toV4(input$, V4 = ObservableV4) {
  if (input$ instanceof V4) {
    return input$;
  } else {
    return V4.create(observer => {
      const subscription = input$.subscribe(
        observer.onNext.bind(observer),
        observer.onError.bind(observer),
        observer.onCompleted.bind(observer)
      );

      return () => subscription.unsubscribe();
    });
  }
}

export function patchObservables(V4 = ObservableV4, V5 = ObservableV5) {
  V4.prototype.v5 = function v5() {
    return toV5(this, V5);
  };

  V4.prototype.v4 = function v4() {
    return this;
  };

  V5.prototype.v5 = function v5() {
    return this;
  };

  V5.prototype.v4 = function v4() {
    return toV4(this, V4);
  };
}
