// server/_core/llmClient.ts

import { ENV } from "./env";

export type LLMParams = {
  systemPrompt?: string;
  userPrompt: string;
  isJsonMode?: boolean; // Indicates if the expected response is JSON
};

export type LLMResponse = {
  content: string;
  error?: string;
};

export async function callLLM(params: LLMParams): Promise<LLMResponse> {
  const { systemPrompt, userPrompt, isJsonMode = false } = params;

  if (!ENV.llmApiUrl || ENV.llmApiUrl.trim().length === 0) {
    return {
      content: "",
      error: "LLM_API_URL is not configured in the environment.",
    };
  }

  if (!ENV.llmApiKey || ENV.llmApiKey.trim().length === 0) {
    return {
      content: "",
      error: "LLM_API_KEY is not configured in the environment.",
    };
  }

  const modelId = ENV.deepseekModel || "deepseek-chat";
  const apiUrl = `${ENV.llmApiUrl}/v1/chat/completions`;

  // DeepSeek expects messages as [{role: "system", content: ...}, {role: "user", content: ...}]
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userPrompt });

  const requestBody: any = {
    model: modelId,
    messages,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.llmApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM API error:", errorText);
      return {
        content: "",
        error: `LLM API call failed: ${response.status} ${response.statusText} - ${errorText}`,
      };
    }

    const jsonResponse = await response.json();

    // DeepSeek response: { choices: [{ message: { content: "..." } }] }
    if (
      !jsonResponse.choices ||
      jsonResponse.choices.length === 0 ||
      !jsonResponse.choices[0].message ||
      !jsonResponse.choices[0].message.content
    ) {
      return {
        content: "",
        error: "LLM API response did not contain expected content.",
      };
    }

    const content = jsonResponse.choices[0].message.content;
    return { content };
  } catch (error: any) {
    console.error("Error during LLM API call:", error);
    return {
      content: "",
      error: `An unexpected error occurred during LLM API call: ${error.message || error}`,
    };
  }
}
