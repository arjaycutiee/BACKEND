// A single message in the conversation history.
// "user" = the student, "model" = the AI's previous replies.
export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}
