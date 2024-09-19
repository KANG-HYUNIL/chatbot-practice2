// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

//codellama file 호출하기 위해 child_process require
const { exec } = require('child_process');

//send text message to local codellama
function sendMessageToCodellama(message) {
    return new Promise((resolve, reject) => {
        exec(`codellama --input "${message}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject('Codellama와 통신 중 오류 발생');
            } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject('Codellama와 통신 중 오류 발생');
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

//read current file content
function getCurrentFileContent() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        return document.getText();
    }
    return '';
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "onePunch" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('onePunch.helloWorld', async function () {
		// The code you place here will be executed every time your command is executed

		const userMessage = await vscode.window.showInputBox({ prompt: 'Codellama에게 보낼 메시지를 입력하세요' });
        if (userMessage) {
            try {
                const reply = await sendMessageToCodellama(userMessage);
                vscode.window.showInformationMessage(reply);
            } catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
