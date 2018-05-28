import { IDictionary } from './common';

/**
* Removes given key from lookup and returns new lookup instance.
* @param entryKey Lookup key
* @param dictionary Lookup
*/
export const removeLookupEntry = <T>(entryKey: string | number, dictionary: IDictionary<T>): IDictionary<T> => {
    const _clone = { ...dictionary };
    delete _clone[entryKey];
    return _clone;
};

/**
 * Add new item to lookup and returns new lookup instance.
 * @param entryKey Lookup key
 * @param item Item to add to lookup
 * @param dictionary Lookup
 */
export const addLookupEntry = <T>(entryKey: string | number, item: T, dictionary: IDictionary<T>): IDictionary<T> => {
    const _clone = { ...dictionary };
    _clone[entryKey] = item;
    return _clone;
};
