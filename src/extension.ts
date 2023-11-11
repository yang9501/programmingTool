// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('java', new MyCodeActionProvider()));
}

export class MyCodeActionProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];
	//https://github.com/microsoft/vscode-extension-samples/tree/main/code-actions-sample
   
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
				let codeAction = new vscode.CodeAction('Fix syntax error: ' + diagnostics[0].message, vscode.CodeActionKind.QuickFix);
				codeAction.edit = new vscode.WorkspaceEdit();
				//If multiple errors exist on the same line, then looping through the diagnostics would result in multiple Quick Action entries
				codeAction.edit.replace(document.uri, diagnostics[0].range, lineOfCode + '/* Fix your syntax error here */' + lineOfCode);
				codeActions.push(codeAction);
			}
		}

        return codeActions;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}