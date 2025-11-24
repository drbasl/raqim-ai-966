import { callLLM } from "./llmClient";

export type InvokeParams = {
  messages: Array<{ role: string; content: string }>;
  outputSchema?: { name: string; schema: Record<string, unknown>; strict?: boolean };
  output_schema?: { name: string; schema: Record<string, unknown>; strict?: boolean };
  responseFormat?: { type: "text" | "json_object" | "json_schema"; json_schema?: { name: string; schema: Record<string, unknown>; strict?: boolean } };
  response_format?: { type: "text" | "json_object" | "json_schema"; json_schema?: { name: string; schema: Record<string, unknown>; strict?: boolean } };
};

export type InvokeResult = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  let systemPrompt: string | undefined;
  let userPrompt: string = "";
  let isJsonMode = false;
  let jsonSchema: Record<string, unknown> | undefined;

  for (const message of params.messages) {
    if (message.role === "system") {
      systemPrompt = message.content;
    } else if (message.role === "user") {
      userPrompt = message.content;
    }
  }

  const explicitFormat = params.responseFormat || params.response_format;
  const explicitSchema = params.outputSchema || params.output_schema;

  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" || explicitFormat.type === "json_object") {
      isJsonMode = true;
      jsonSchema = explicitFormat.json_schema?.schema;
    }
  } else if (explicitSchema) {
    isJsonMode = true;
    jsonSchema = explicitSchema.schema;
  }

  // If JSON mode is enabled and a schema is provided, append it to the system prompt
  if (isJsonMode && jsonSchema) {
    const schemaString = JSON.stringify(jsonSchema);
    if (systemPrompt) {
      systemPrompt = `${systemPrompt}\n\nRespond strictly with JSON conforming to this schema:\n${schemaString}`;
    } else {
      systemPrompt = `Respond strictly with JSON conforming to this schema:\n${schemaString}`;
    }
  }

  const llmResponse = await callLLM({ systemPrompt, userPrompt, isJsonMode });

  if (llmResponse.error) {
    throw new Error(`LLM invocation failed: ${llmResponse.error}`);
  }

  return {
    choices: [
      {
        message: {
          content: llmResponse.content,
        },
      },
    ],
  };
}
