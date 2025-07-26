import * as assert from 'assert';
import * as path from 'path';
import { parseDicomTags } from '../../services/dicomParser';

suite('DICOM Parser Test Suite', () => {
    
    test('parseDicomTags should parse DICOM file and return tags', () => {
        // Test file path
        const testFilePath = path.join(__dirname, '../fixtures/JPCNN001.dcm');
        
        try {
            // Execute parseDicomTags function (now synchronous)
            const tags = parseDicomTags(testFilePath);
            
            // Verify return value is an object
            assert.strictEqual(typeof tags, 'object');
            assert.notStrictEqual(tags, null);
            
            // Verify required properties exist
            assert.ok('patientID' in tags, 'patientID should exist in tags');
            assert.ok('patientName' in tags, 'patientName should exist in tags');
            assert.ok('studyDate' in tags, 'studyDate should exist in tags');
            assert.ok('modality' in tags, 'modality should exist in tags');
            assert.ok('studyDescription' in tags, 'studyDescription should exist in tags');
            
            // Output actual values for verification
            console.log('Parsed DICOM tags:', tags);
            
        } catch (error) {
            // Output details if error occurs
            console.error('Test failed with error:', error);
            throw error;
        }
    });
    
    test('parseDicomTags should throw error for non-existent file', () => {
        const nonExistentFile = '/path/to/nonexistent.dcm';
        
        try {
            parseDicomTags(nonExistentFile);
            // Test fails if this point is reached
            assert.fail('Expected function to throw error for non-existent file');
        } catch (error) {
            // Expect error to occur
            assert.ok(error instanceof Error);
            assert.ok(error.message.includes('DICOM parsing failed'));
        }
    });
});