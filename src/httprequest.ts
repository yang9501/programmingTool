import OpenAI from "openai";
import * as vscode from 'vscode';

export async function sendErrorToChatGPT(errorText: string) {
  const openai = new OpenAI({
    apiKey: vscode.workspace.getConfiguration("programmingtool").get("apiKey"),
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Fix this code and return proper code:\n\n" + errorText + "\n\nDo not give any preamble or explanation, and do not surround the code with any quotes."}],
    model: "gpt-3.5-turbo",
  });
  let gptContent = chatCompletion.choices[0].message.content;
  if (gptContent === null) {
    return "unmodified";
  }
  return gptContent.toString();
}

export async function getQueryFromChatGPT(errorMessage: string, errorSnippet: string) {
  const openai = new OpenAI({
    apiKey: vscode.workspace.getConfiguration("programmingtool").get("apiKey"),
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Only give me a good search engine query without quotes to solve this error message and corresponding code snippet with error:\n" + errorMessage + errorSnippet}],
    model: "gpt-3.5-turbo",
  });
  let gptContent = chatCompletion.choices[0].message.content;
  if (gptContent === null) {
    return "unmodified";
  }
  return gptContent.toString();
}