export function autobind<T extends Function>(target: any, key: string, descriptor: TypedPropertyDescriptor<T>) {
  let fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error(`@autobind decorator can only be applied to methods`);
  }

  // avoid recursion in IE11
  let definingProperty = false;

  return {
    configurable: true,
    get() {
      if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
        return fn;
      }

      let bound = fn.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        value: bound,
        configurable: true,
        writable: true
      });
      definingProperty = false;
      return bound;
    }
  };
}
