import OpenAI from "openai";

export async function sendErrorToChatGPT(errorText: string) {
  const openai = new OpenAI({
    apiKey: "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", // TODO: Add API key here
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Fix this code:\n" + errorText}],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0].message.toString();
}