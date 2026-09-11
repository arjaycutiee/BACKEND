import { taskRepository } from "@/repositories/task.repository";
import { TaskInput, TaskUpdateInput } from "@/types/task.types";
import { AppError } from "@/utils/response";

export class TaskService {
  getTasks(userId: string) {
    return taskRepository.findAllByUser(userId);
  }

  createTask(userId: string, input: TaskInput) {
    return taskRepository.create(userId, input);
  }

  async updateTask(userId: string, taskId: string, input: TaskUpdateInput) {
    await this.ensureOwned(userId, taskId);
    return taskRepository.update(taskId, input);
  }

  async toggleTask(userId: string, taskId: string) {
    const task = await this.ensureOwned(userId, taskId);
    return taskRepository.update(taskId, { completed: !task.completed });
  }

  async deleteTask(userId: string, taskId: string) {
    await this.ensureOwned(userId, taskId);
    await taskRepository.delete(taskId);
    return { message: "Task deleted" };
  }

  private async ensureOwned(userId: string, taskId: string) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) throw new AppError("Task not found", 404);
    return task;
  }
}

export const taskService = new TaskService();
