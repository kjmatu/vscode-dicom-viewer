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
            
            // Output actual values for verification
            console.log('Parsed DICOM tags:', tags);

            // Verify return value is an object
            assert.strictEqual(typeof tags, 'object');
            assert.notStrictEqual(tags, null);
            
            // Verify tags object has properties (dcmjs uses human-readable names)
            const tagCount = Object.keys(tags).length;
            assert.ok(tagCount > 0, 'Tags object should contain at least one tag');
            
            // Check if common DICOM tags exist (using dcmjs naming)
            const hasPatientData = Object.keys(tags).some(key => 
                key.toLowerCase().includes('patient') || 
                key.toLowerCase().includes('name') ||
                key.toLowerCase().includes('id')
            );
            assert.ok(hasPatientData, 'Should contain patient-related tags');
            
            
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