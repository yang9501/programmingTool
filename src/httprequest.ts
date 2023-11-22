import OpenAI from "openai";
import * as vscode from 'vscode';

export async function sendErrorToChatGPT(errorText: string) {
  const openai = new OpenAI({
    apiKey: vscode.workspace.getConfiguration("programmingtool").get("apiKey"),
  });
  console.log("errorText = " + errorText);
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Fix this code and return proper code:\n" + errorText}],
    model: "gpt-3.5-turbo",
  });
  console.log(chatCompletion);
  let gptContent = chatCompletion.choices[0].message.content;
  if (gptContent == null) {
    return "unmodified";
  }
  return gptContent.toString();
}