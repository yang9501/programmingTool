import OpenAI from "openai";

export async function sendErrorToChatGPT(errorText: string) {
  const openai = new OpenAI({
    apiKey: "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", // TODO: Add API key here
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