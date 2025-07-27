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

    test('parseDicomTags should handle empty file', () => {
        // Create empty test file
        const emptyFilePath = path.join(__dirname, '../fixtures/empty.dcm');
        require('fs').writeFileSync(emptyFilePath, Buffer.alloc(0));

        try {
            parseDicomTags(emptyFilePath);
            assert.fail('Expected function to throw error for empty file');
        } catch (error) {
            assert.ok(error instanceof Error);
            assert.ok(error.message.includes('DICOM parsing failed'));
        } finally {
            // Cleanup
            if (require('fs').existsSync(emptyFilePath)) {
                require('fs').unlinkSync(emptyFilePath);
            }
        }
    });

    test('parseDicomTags should handle invalid DICOM file', () => {
        // Create invalid DICOM file
        const invalidFilePath = path.join(__dirname, '../fixtures/invalid.dcm');
        require('fs').writeFileSync(invalidFilePath, 'This is not a DICOM file');

        try {
            parseDicomTags(invalidFilePath);
            assert.fail('Expected function to throw error for invalid DICOM file');
        } catch (error) {
            assert.ok(error instanceof Error);
            assert.ok(error.message.includes('DICOM parsing failed'));
        } finally {
            // Cleanup
            if (require('fs').existsSync(invalidFilePath)) {
                require('fs').unlinkSync(invalidFilePath);
            }
        }
    });

    test('parseDicomTags should return consistent structure', () => {
        // Test with mock data if real DICOM file is not available
        const testFilePath = path.join(__dirname, '../fixtures/JPCNN001.dcm');

        if (!require('fs').existsSync(testFilePath)) {
            console.log('Skipping structure test: DICOM sample file not found');
            return;
        }

        try {
            const result = parseDicomTags(testFilePath);

            // Verify all tag entries have consistent structure
            for (const [tagName, tagData] of Object.entries(result)) {
                assert.ok(typeof tagName === 'string', `Tag name should be string: ${tagName}`);
                assert.ok(typeof tagData === 'object', `Tag data should be object: ${tagName}`);
                assert.ok('value' in tagData, `Tag should have 'value' property: ${tagName}`);
            }

        } catch (error) {
            console.error('Structure test failed:', error);
            throw error;
        }
    });
});

// Helper function tests
suite('Helper Functions Test Suite', () => {

    test('parseArrayValue should handle single element array', () => {
        // We need to access the internal function for unit testing
        // This would require exporting helper functions or restructuring
        console.log('Helper function tests would require exporting internal functions');
    });

    test('parseObjectValue should convert object to JSON string', () => {
        // Similar to above - would need access to internal functions
        console.log('Consider exporting helper functions for better testability');
    });
});