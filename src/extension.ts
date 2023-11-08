import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("typescript", new MyCodeAssist(), {
      providedCodeActionKinds: MyCodeAssist.providedCodeActionKinds,
    })
  );
}

export class MyCodeAssist implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const codeActions: vscode.CodeAction[] = [];

    for (const diagnostic of diagnostics) {
      if (diagnostic.range.contains(range)) {
        console.log(diagnostic.message);
        console.log(diagnostic.code);
        const fixes = this.getFixes(document, diagnostic);
        codeActions.push(...fixes);
      }
    }
    console.log(codeActions);

    return codeActions.length > 0 ? codeActions : undefined;
  }

  private getFixes(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction[] {
    const fixes: vscode.CodeAction[] = [];

    if (diagnostic.code === 2322) {
      const fix = new vscode.CodeAction(
        'Explain this with myCodeAssist',
        vscode.CodeActionKind.QuickFix
      );
      fix.edit = new vscode.WorkspaceEdit();
      fix.edit.replace(
        document.uri,
        diagnostic.range,
        diagnostic.message.replace("===", "==")
      );
      fixes.push(fix);
    }

    if (diagnostic.code === 1002) {
      const fix = new vscode.CodeAction(
        'Replace "++" with "+ 1"',
        vscode.CodeActionKind.QuickFix
      );
      fix.edit = new vscode.WorkspaceEdit();
      fix.edit.replace(
        document.uri,
        diagnostic.range,
        diagnostic.message.replace("++", "+ 1")
      );
      fixes.push(fix);
    }

    return fixes;
  }
}

