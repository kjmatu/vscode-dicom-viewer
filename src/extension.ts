// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parseDicomTags } from './services/dicomParser';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-dicom-viewer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-dicom-viewer.parseDicomTags', async () => {
		try {
			// DICOM file selection dialog
			const fileUri = await vscode.window.showOpenDialog({
				canSelectFiles: true,
				canSelectMany: false,
				filters: {
					'DICOM Files': ['dcm', 'dicom', 'DCM', 'DICOM'],
					'All Files': ['*']
				},
				openLabel: 'Select DICOM File'
			});

			if (!fileUri || fileUri.length === 0) {
				vscode.window.showInformationMessage('No file selected');
				return;
			}

			const selectedFile = fileUri[0];
			vscode.window.showInformationMessage(`Processing DICOM file: ${selectedFile.fsPath}`);

			// Parse DICOM file
			const tags = parseDicomTags(selectedFile.fsPath);

			// Create output content
			const output = createOutputContent(tags, selectedFile.fsPath);

			// Show results in new document
			const doc = await vscode.workspace.openTextDocument({
				content: output,
				language: 'json'
			});
			
			await vscode.window.showTextDocument(doc);

		} catch (error) {
			vscode.window.showErrorMessage(`Error processing DICOM file: ${error}`);
			console.error('DICOM processing error:', error);
		}
	});

	context.subscriptions.push(disposable);
}

function createOutputContent(tags: Record<string, any>, filePath: string): string {
	const header = `// DICOM Tags Analysis
// File: ${filePath}
// Generated: ${new Date().toISOString()}
// Total Tags: ${Object.keys(tags).length}

`;

	const jsonContent = JSON.stringify(tags, null, 2);
	return header + jsonContent;
}

// This method is called when your extension is deactivated
export function deactivate() {}
