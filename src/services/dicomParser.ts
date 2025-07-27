import * as fs from 'fs';

const dcmjs = require('dcmjs');


function parseArrayValue(value: any): string {
    let displayValue: string;
    // 配列の場合
    if (value.length === 1) {
        displayValue = value[0];
    } else {
        displayValue = value.join(', ');
    }
    return displayValue;
}


function parseObjectValue(value: any): string {
    // オブジェクトの場合（Sequence等）
    return '[Complex Data]';
}

function getDisplayValue(value: any): string {
    // タグの情報を整理
    let displayValue = value;

    if (Array.isArray(value)) {
        displayValue = parseArrayValue(value);
    } else if (typeof value === 'object' && value !== null) {
        // オブジェクトの場合（Sequence等）
        displayValue = parseObjectValue(value);
    } else {
        console.error(`Unexpected value type: ${typeof value} for value:`, value);
        throw new Error(`Unexpected value type: ${typeof value}`);
    }
    return displayValue;
}

function createTagEntry(value: any): { value: string, rawValue: any } {
    try {
        const displayValue = getDisplayValue(value);
        return {
            value: displayValue,
            rawValue: value
        };
    } catch (error) {
        return {
            value: '[Parse Error]',
            rawValue: null
        };
    }
}

/**
* DICOMファイルのタグ情報を辞書形式で返す関数
* @param filePath DICOMファイルのパス
* @returns タグ情報の辞書（オブジェクト）
*/
export function parseDicomTags(filePath: string): Record<string, any> {
    try {
        // ファイルを読み込んでBufferに変換
        const buffer = fs.readFileSync(filePath);

        // dcmjsでパース
        const dicomData = dcmjs.data.DicomMessage.readFile(buffer.buffer);
        const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);

        // すべてのタグ情報を取得
        const tags: Record<string, any> = {};

        // datasetからすべてのタグを取得
        for (const [key, value] of Object.entries(dataset)) {
            tags[key] = createTagEntry(value);
        }

        return tags;
    } catch (error) {
        throw new Error(`DICOM parsing failed: ${error}`);
    }
}