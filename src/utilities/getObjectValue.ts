 /**
 * Get value for object from path.
 * @param {string} path - Property name of object. For nested objects use property.nested
 */
export function getObjectValue(theObject: any, path: string, separator = '.') {
    try {
        return path.
                replace('[', separator).replace(']', '').
                split(separator).
                reduce(
                    (obj, property) => {
                        return obj[property];
                    }, theObject
                );

    } catch (err) {
        return undefined;
    }
}
