/**
 *
 * @param value boolean, string, array, object, array of object
 * @returns boolean
 */
export function isEmpty(value: unknown) {
    if (!value) return true;
    if (typeof value === 'object') {
        if (Array.isArray(value) && value.length) {
            if (
                typeof value[0] === 'object' &&
                !Object.keys(value?.[0])?.length
            )
                return true;
            return false;
        }
        if (Object.keys(value).length) return false;
        return true;
    }
    if (value) return false;
}
