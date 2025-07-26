import * as fs from 'fs';
const dicomParser = require('dicom-parser');

/**
 * DICOMファイルのタグ情報を辞書形式で返す関数
 * @param filePath DICOMファイルのパス
 * @returns タグ情報の辞書（オブジェクト）
 */
export function parseDicomTags(filePath: string): Record<string, any> {
    try {
        // ファイルを読み込んでBufferに変換
        const buffer = fs.readFileSync(filePath);
        
        // dicom-parserでパース
        const dataSet = dicomParser.parseDicom(buffer);
        
        // タグ情報をオブジェクト（辞書）として返す
        const tags: Record<string, any> = {
            patientID: dataSet.string('x00100020') || '',
            patientName: dataSet.string('x00100010') || '',
            studyDate: dataSet.string('x00080020') || '',
            modality: dataSet.string('x00080060') || '',
            studyDescription: dataSet.string('x00081030') || '',
        };
        
        return tags;
    } catch (error) {
        throw new Error(`DICOM parsing failed: ${error}`);
    }
}