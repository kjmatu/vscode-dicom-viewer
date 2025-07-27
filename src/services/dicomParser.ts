import * as fs from 'fs';

const dcmjs = require('dcmjs');

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

        // 生データセット（タグ番号付き）
        const rawDataset = dicomData.dict;

        // 自然化されたデータセット（人間が読める名前）
        const naturalizedDataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(rawDataset);

        // すべてのタグ情報を取得（両方の形式で提供）
        const tags: Record<string, any> = {};

        // 自然化されたデータセットから取得（推奨）
        for (const [tagName, value] of Object.entries(naturalizedDataset)) {

            tags[tagName] = {
                value: value,
                type: typeof value,
            };
        }

        return tags;
    } catch (error) {
        throw new Error(`DICOM parsing failed: ${error}`);
    }
}