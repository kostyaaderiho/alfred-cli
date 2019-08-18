/**
 * Object check.
 *
 * @param item Checked item.
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep objects merge method.
 *
 * @param {*} target Target object.
 * @param  {...any} sources Merged object.
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Parse input options.
 *
 * Allows to define configuration with nested options.
 *
 * @param {*} options Raw options.
 */
function parseInputOptions(options) {
    let parsedOptions = {};

    for (let opt in options) {
        let optionPath = opt.split('.');
        let parsedOption = {};

        for (let i = 0; i < optionPath.length; i++) {
            if (i === 0) {
                parsedOption[optionPath[i]] =
                    optionPath.length === 1 ? options[opt] : {};
            } else {
                if (i === optionPath.length - 1) {
                    parsedOption[optionPath[i - 1]][optionPath[i]] = options[
                        opt
                    ].trim();
                } else {
                    parsedOption[optionPath[i - 1]][optionPath[i]] = {};
                }
            }
        }
        parsedOptions = mergeDeep(parsedOptions, parsedOption);
    }

    return parsedOptions;
}

module.exports = parseInputOptions;
