import { env } from "@/config/env";
import { aiRepository } from "@/repositories/ai.repository";
import { ChatMessage, ChatResponse } from "@/types/ai.types";
import { AppError } from "@/utils/response";

// We call Gemini's REST API directly with fetch (built into Node 18+),
// so no extra npm package is needed.
// Docs: https://ai.google.dev/gemini-api/docs
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export class AiService {
  async chat(userId: string, message: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    if (!env.GEMINI_API_KEY) {
      throw new AppError("AI is not configured. Add GEMINI_API_KEY to the .env file.", 503);
    }

    // 1. Build the "system instruction": the AI's role + the user's real data.
    const systemInstruction = await this.buildSystemInstruction(userId);

    // 2. Build the conversation: previous messages (max 10) + the new one.
    //    Gemini expects: [{ role: "user" | "model", parts: [{ text }] }]
    const contents = [
      ...history.slice(-10).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    // 3. Call the Gemini API.
    const response = await fetch(`${GEMINI_BASE_URL}/${env.GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.7, // creativity: 0 = strict/factual, 1 = creative
          maxOutputTokens: 1024, // limits the length (and cost) of the reply
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", response.status, errorBody);
      throw new AppError("The AI service failed to respond. Please try again.", 502);
    }

    // 4. Extract the reply text from Gemini's response shape.
    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

    if (!reply) {
      throw new AppError("The AI returned an empty response. Please try again.", 502);
    }

    return { reply };
  }

  // Turns the user's data into plain text the AI can read.
  private async buildSystemInstruction(userId: string): Promise<string> {
    const ctx = await aiRepository.getUserContext(userId);

    const tasksText =
      ctx.pendingTasks.length === 0
        ? "No pending tasks."
        : ctx.pendingTasks
            .map(
              (t) =>
                `- "${t.title}" (${t.subject}, ${t.category}, priority ${t.priority}, due ${t.dueDate} ${t.dueTime})`
            )
            .join("\n");

    const eventsText =
      ctx.upcomingEvents.length === 0
        ? "No upcoming events in the next 7 days."
        : ctx.upcomingEvents
            .map((e) => `- "${e.title}" (${e.category}) on ${e.date} at ${e.time}, ${e.duration} mins`)
            .join("\n");

    const income = ctx.recentTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = ctx.recentTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const txText =
      ctx.recentTransactions.length === 0
        ? "No transactions in the last 7 days."
        : ctx.recentTransactions
            .map((t) => `- ${t.type === "income" ? "+" : "-"}₱${t.amount} ${t.title} (${t.category}, ${t.date})`)
            .join("\n");

    const notesText =
      ctx.notes.length === 0
        ? "No notes."
        : ctx.notes.map((n) => `- "${n.title}" (${n.category})`).join("\n");

    return `You are GabAi, a friendly and encouraging AI study assistant inside a student productivity app.
The student you are helping is named ${ctx.user?.fullName ?? "the student"}.
Today's date is ${ctx.today}.

Answer questions using the student's REAL data below. Be concise and practical.
When asked what to focus on, prioritize by due date and priority.
Amounts are in Philippine Pesos (₱). If asked to create or change data, explain that
you can only give advice for now, and they can add it themselves in the app.

=== PENDING TASKS ===
${tasksText}

=== UPCOMING EVENTS (next 7 days) ===
${eventsText}

=== TRANSACTIONS (last 7 days: income ₱${income}, expenses ₱${expenses}) ===
${txText}

=== NOTES ===
${notesText}`;
  }
}

export const aiService = new AiService();
