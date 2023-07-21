import { filter } from 'lodash';

export type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
    if (b[ orderBy ] < a[ orderBy ]) {
        return -1;
    }
    if (b[ orderBy ] > a[ orderBy ]) {
        return 1;
    }
    return 0;
}

export function getComparator(order: string, orderBy: string) {
    return order === 'desc'
        ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
        : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

export function applySortFilter(array: any[], fieldName: string, comparator: (a: any, b: any) => number, query: string) {

    const stabilizedThis = array.map((el: any, index: any) => [ el, index ] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[ 0 ], b[ 0 ]);
        if (order !== 0) return order;
        return a[ 1 ] - b[ 1 ];
    });

    if (query) {
        return filter(array, (item) => String(item[ fieldName ]).toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }

    return stabilizedThis.map((el) => el[ 0 ]);
}
