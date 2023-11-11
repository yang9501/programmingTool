import fetch from "node-fetch";

export async function sendErrorToChatGPT(errorText: string) {
  const chatGptApiUrl = "https://enellv1ir26mm.x.pipedream.net"; 
  //const apiKey = ""; 

  const requestData = {
    text: errorText,
  };

  const requestOptions = {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${apiKey}`,
    // },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await fetch(chatGptApiUrl, requestOptions);

    if (!response.ok) {
       
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response Status Code:", response.status);
    
    console.log(responseData);
    return response.status.toString();
  } catch (error) {
    console.error("API request to ChatGPT failed:", error);
    return "error";
  }
}