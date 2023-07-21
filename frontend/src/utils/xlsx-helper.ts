import zipcelx from 'zipcelx-on-steroids';
import download from 'downloadjs';
import { consoleLog } from 'src/utils/errors';

export type ExportColumn = {
    fieldName: string,
    format: string,
    value: string;
    type: string;
}

export function exportTo(filename: string, columns: ExportColumn[], data: any[], target: 'export' | 'blob') {
    generateFileStructure(filename, columns, data, target);
}

export function generateFileStructure(filename: string, columns: ExportColumn[], data: any[], target: 'export' | 'blob'): any {

    const info: Array<Array<any>> = [ [] ];

    columns.forEach((col: ExportColumn) => {
        info[ 0 ].push({ value: col.value, type: col.type });
    });

    data.forEach((item) => {
        const index = info.push([]);
        // eslint-disable-next-line no-restricted-syntax
        for (const [ , value ] of Object.entries(item)) {
            info[ index - 1 ].push({ value: value || '', type: 'string' });
        }
    });

    const config =
    {
        filename,
        sheet: {
            data: info,
        }
    };

    return zipcelx(config, target);
}

export function downloadFile(fileName: string, zipcelFile: any) {
    try {
        if (zipcelFile) {
            const x = new XMLHttpRequest();
            x.open("GET", `/${fileName}`, true);
            x.responseType = "blob";
            x.onload = () => {
                download(zipcelFile, fileName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            };
            x.send();
        };
    }
    catch (error) {
        consoleLog(`DownloadFile: `, error);
    }
}