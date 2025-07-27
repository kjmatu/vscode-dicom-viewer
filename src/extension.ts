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

			// Create webview panel
			const panel = vscode.window.createWebviewPanel(
				'dicomViewer',
				'DICOM Tags Viewer',
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			// Set HTML content
			panel.webview.html = createHtmlContent(tags, selectedFile.fsPath);

		} catch (error) {
			vscode.window.showErrorMessage(`Error processing DICOM file: ${error}`);
			console.error('DICOM processing error:', error);
		}
	});

	context.subscriptions.push(disposable);
}

function createHtmlContent(tags: Record<string, any>, filePath: string): string {
	const tableRows = Object.entries(tags).map(([tagName, tagData]) => {
		const value = typeof tagData.value === 'object' 
			? JSON.stringify(tagData.value) 
			: String(tagData.value);
		
		return `
			<tr>
				<td>${tagName}</td>
				<td>${value}</td>
				<td>${tagData.type || 'unknown'}</td>
				<td>${tagData.vr || 'N/A'}</td>
				<td>${tagData.tagId || 'N/A'}</td>
			</tr>
		`;
	}).join('');

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<title>DICOM Tags Viewer</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
					margin: 20px;
					background-color: var(--vscode-editor-background);
					color: var(--vscode-editor-foreground);
				}
				.header {
					margin-bottom: 20px;
					padding: 15px;
					background-color: var(--vscode-textBlockQuote-background);
					border-left: 4px solid var(--vscode-textBlockQuote-border);
				}
				table {
					width: 100%;
					border-collapse: collapse;
					margin-top: 10px;
				}
				th, td {
					padding: 8px 12px;
					text-align: left;
					border-bottom: 1px solid var(--vscode-panel-border);
				}
				th {
					background-color: var(--vscode-editor-selectionBackground);
					font-weight: 600;
					position: sticky;
					top: 0;
				}
				tr:hover {
					background-color: var(--vscode-list-hoverBackground);
				}
				.tag-name {
					font-family: 'Consolas', 'Monaco', monospace;
					font-weight: 500;
				}
				.tag-value {
					max-width: 300px;
					word-wrap: break-word;
					font-family: 'Consolas', 'Monaco', monospace;
				}
			</style>
		</head>
		<body>
			<div class="header">
				<h2>DICOM Tags Analysis</h2>
				<p><strong>File:</strong> ${filePath}</p>
				<p><strong>Generated:</strong> ${new Date().toISOString()}</p>
				<p><strong>Total Tags:</strong> ${Object.keys(tags).length}</p>
			</div>
			
			<table>
				<thead>
					<tr>
						<th>Tag Name</th>
						<th>Value</th>
						<th>Type</th>
						<th>VR</th>
						<th>Tag ID</th>
					</tr>
				</thead>
				<tbody>
					${tableRows}
				</tbody>
			</table>
		</body>
		</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
