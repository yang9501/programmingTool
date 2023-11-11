import * as vscode from 'vscode';
import { sendErrorToChatGPT } from "./httprequest";

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "helloworld" is now active!');

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('java', new assistedAIFixCodeActionProvider()));
	context.subscriptions.push(vscode.languages.registerCodeActionsProvider('java', new googleSearchCodeActionProvider()));
}

export class googleSearchCodeActionProvider implements vscode.CodeActionProvider {
	
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

export class assistedAIFixCodeActionProvider implements vscode.CodeActionProvider {
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
				let gptAssistedReturnString: string = "unmodified";
				const gptAssistedReturnStringPromise = sendErrorToChatGPT(lineOfCode);
				//Waits for response to be returned from http query.  What happens if it takes too long?  Add a timeout?
				gptAssistedReturnString = await gptAssistedReturnStringPromise || gptAssistedReturnString;

				let codeAction = new vscode.CodeAction('Fix syntax error: ' + diagnostics[0].message, vscode.CodeActionKind.QuickFix);
				codeAction.edit = new vscode.WorkspaceEdit();
				//If multiple errors exist on the same line, then looping through the diagnostics would result in multiple Quick Action entries
				codeAction.edit.replace(document.uri, diagnostics[0].range, gptAssistedReturnString + '/* Fix your syntax error here */' + lineOfCode);
				codeActions.push(codeAction);
			}
		}

        return codeActions;
    }
}

export function deactivate() {}