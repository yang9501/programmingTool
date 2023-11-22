import * as vscode from 'vscode';
import { sendErrorToChatGPT } from "./httprequest";

export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "programmingtool" is now active!');

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('*', new AssistedAIFixCodeActionProvider()));
	context.subscriptions.push(vscode.languages.registerCodeActionsProvider('*', new GoogleSearchCodeActionProvider()));


	// This part partially written by Copilot
	vscode.commands.registerCommand('extension.fixSyntaxError', async (lineNumber: number) => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let lineOfCode = editor.document.lineAt(lineNumber).text;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = vscode.languages.getDiagnostics(editor.document.uri).filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			console.log(diagnostics);
			//Crucial check
			if (diagnostics.length > 0) {
				// Display the line of code
				vscode.window.showInformationMessage('Fixing syntax error: ' + diagnostics[0].message);
				// Replace the line of code with the GPT-3 assisted fix
				let gptAssistedReturnString = await sendErrorToChatGPT(lineOfCode);
				if (gptAssistedReturnString !== "unmodified") {
					editor.edit(editBuilder => {
						editBuilder.replace(diagnostics[0].range, gptAssistedReturnString);
					});
				}
			}
		}
	});
}

export class GoogleSearchCodeActionProvider implements vscode.CodeActionProvider {
	
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
		let codeActions: vscode.CodeAction[] = [];
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			console.log("hello");
			let selection = editor.selection.active;
			let lineNumber = selection.line;
			console.log("lineNumber = " + lineNumber);
			let lineOfCode = editor.document.lineAt(lineNumber).text;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = context.diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			console.log(diagnostics);
			//Crucial check
			if (diagnostics.length > 0) {
				// Display the line of code
				let codeAction = new vscode.CodeAction('Search for error fix: ' + diagnostics[0].message, vscode.CodeActionKind.QuickFix);
				
				let text = encodeURI(lineOfCode);
				let query = "https://www.google.com/search?q=" + text;
				codeAction.command = {
					title: 'Search for error fix',
					command: 'vscode.open', // The command ID
					arguments: [vscode.Uri.parse(query)] // The arguments to pass to the command handler
				};
				codeActions.push(codeAction);
			}
		}
        return codeActions;
    }
}

export class AssistedAIFixCodeActionProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];
   
	async provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<(vscode.Command | vscode.CodeAction)[] | null | undefined> {
		let codeActions: vscode.CodeAction[] = [];
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let selection = editor.selection.active;
			let lineNumber = selection.line;
			let lineOfCode = editor.document.lineAt(lineNumber).text;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = context.diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			console.log(diagnostics);
			//Crucial check
			if (diagnostics.length > 0) {
				let codeAction = new vscode.CodeAction('Fix syntax error: ' + diagnostics[0].message, vscode.CodeActionKind.QuickFix);
				codeAction.command = {
					title: 'Fix syntax error',
					command: 'extension.fixSyntaxError',
					arguments: [lineNumber]
				};
				
				codeActions.push(codeAction);
			}
		}

        return codeActions;
    }
}

export function deactivate() {}