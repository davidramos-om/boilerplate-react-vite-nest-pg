import slugifyLib from 'slugify';

export function sentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const shortenUuid = (id: string) => `${id.slice(0, 2)}...${id.slice(id.length - 3)}`;

export function slugify(text: string): string {

    return slugifyLib(text, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'en',       // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    });
}