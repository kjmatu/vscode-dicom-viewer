import * as fs from 'fs';
const dcmjs = require('dcmjs');


function getDisplayValue(value: any): string {
    // タグの情報を整理
    let displayValue;
    
    if (Array.isArray(value)) {
        // 配列の場合
        if (value.length === 1) {
            displayValue = value[0];
        } else {
            displayValue = value.join(', ');
        }
    } else if (typeof value === 'object' && value !== null) {
        // オブジェクトの場合（Sequence等）
        displayValue = '[Complex Data]';
    } else {
        displayValue = value;
    }
    return displayValue;
}

function createTagEntry(key: string, value: any): { value: string, rawValue: any } {
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
            tags[key] = createTagEntry(key, value);
        }
        
        return tags;
    } catch (error) {
        throw new Error(`DICOM parsing failed: ${error}`);
    }
}