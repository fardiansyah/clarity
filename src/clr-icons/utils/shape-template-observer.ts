/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ShapeTemplateObservables } from '../interfaces/icon-interfaces';

/* tslint:disable:no-namespace */
export namespace ShapeTemplateObserverModule {
  export const changeHandlerCallbacks: ShapeTemplateObservables = {};

  class ShapeTemplateObserver {
    private callbacks: ShapeTemplateObservables = changeHandlerCallbacks;

    public subscribeTo(shapeName: string, changeHandlerCallback: Function) {
      if (!this.callbacks[shapeName]) {
        this.callbacks[shapeName] = [changeHandlerCallback];
      } else {
        if (this.callbacks[shapeName].indexOf(changeHandlerCallback) === -1) {
          this.callbacks[shapeName].push(changeHandlerCallback);
        }
      }

      // this returned function give users an ability to remove the subscription
      return () => {
        const removeAt = this.callbacks[shapeName].indexOf(changeHandlerCallback);
        this.callbacks[shapeName].splice(removeAt, 1);

        // if the array is empty, remove the property from the callbacks
        if (this.callbacks[shapeName].length === 0) {
          delete this.callbacks[shapeName];
        }
      };
    }

    public emitChanges(shapeName: string, template: string) {
      if (this.callbacks[shapeName]) {
        // this will emit changes to all observers
        // by calling their callback functions on template changes
        this.callbacks[shapeName].map((changeHandlerCallback: Function) => {
          changeHandlerCallback(template);
        });
      }
    }
  }

  export const instance = new ShapeTemplateObserver();
}
