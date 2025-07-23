export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface CompletionData {
  [date: string]: {
    completed: number;
    total: number;
  };
}