// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from HelloWorld!');
	});

	context.subscriptions.push(disposable);

	let errorRetrieval = vscode.languages.onDidChangeDiagnostics(event => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let selection = editor.selection.active;
			let lineNumber = selection.line;
			let lineOfCode = editor.document.lineAt(lineNumber).text;
			let diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
			let syntaxErrors = diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			if (syntaxErrors.length > 0) {
				// The user has right clicked a highlighted syntax error on this line
				// Display the line of code
				vscode.window.showInformationMessage(lineOfCode);
			}
		}
	});

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('yourLanguageId', new MyCodeActionProvider()));

	context.subscriptions.push(errorRetrieval);
	//Modify actions menu
}

export class MyCodeActionProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];
	//https://github.com/microsoft/vscode-extension-samples/tree/main/code-actions-sample
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        let diagnostics = context.diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error);
        let codeActions: vscode.CodeAction[] = [];
        for (let diagnostic of diagnostics) {
            let codeAction = new vscode.CodeAction('Fix syntax error', vscode.CodeActionKind.QuickFix);
            codeAction.edit = new vscode.WorkspaceEdit();
            codeAction.edit.replace(document.uri, diagnostic.range, '/* Fix your syntax error here */');
            codeActions.push(codeAction);
        }
        return codeActions;
    }
	//In the provideCodeActions method of your CodeActionProvider, you can filter the diagnostics 
	//to only include syntax errors, and then create a vscode.CodeAction object for each syntax error.
	// You can then set the edit property of the code action to a vscode.WorkspaceEdit object that replaces 
	//the range of the syntax error with the fixed code. Finally, you can return an array of the code actions.
}

// This method is called when your extension is deactivated
export function deactivate() {}
