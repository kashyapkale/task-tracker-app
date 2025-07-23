import { useState, useEffect } from 'react';
import type { Task, CompletionData } from './types';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';

const getTodayString = (): string => new Date().toISOString().split('T')[0];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>('');
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [completionData, setCompletionData] = useState<CompletionData>({});
  const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);

  const MIN_TIME_BETWEEN_TASKS_MS = 3000;

  useEffect(() => {
    const todayStr = getTodayString();
    try {
      const storedTasks: Task[] = JSON.parse(localStorage.getItem(`tasks_${todayStr}`) || '[]');
      const storedCompletionData: CompletionData = JSON.parse(localStorage.getItem('completionData') || '{}');
      setTasks(storedTasks);
      setCompletionData(storedCompletionData);
      if (storedTasks.length > 0 && storedTasks.some(t => t.completed)) {
        setSessionStarted(true);
      }
    } catch (error) {
      console.error("Failed to parse localStorage data", error);
    }
  }, []);

  useEffect(() => {
    const todayStr = getTodayString();
    localStorage.setItem(`tasks_${todayStr}`, JSON.stringify(tasks));
    localStorage.setItem('completionData', JSON.stringify(completionData));
  }, [tasks, completionData]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim() && !sessionStarted) {
      const newTask: Task = {
        id: Date.now(),
        text: taskInput.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTaskInput('');
    } else if (sessionStarted) {
      alert("Cannot add tasks after starting the day.");
    }
  };

  const handleStartDay = () => {
    if (tasks.length > 0) {
      setSessionStarted(true);
      setLastCompletionTime(Date.now());
    }
  };

  const handleCompleteTask = (taskId: number) => {
    const now = Date.now();
    if (lastCompletionTime && now - lastCompletionTime < MIN_TIME_BETWEEN_TASKS_MS) {
      alert(`Please take a moment. (Minimum ${MIN_TIME_BETWEEN_TASKS_MS / 1000} seconds)`);
      return;
    }

    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(newTasks);
    setLastCompletionTime(now);

    const todayStr = getTodayString();
    const completedCount = newTasks.filter(t => t.completed).length;
    setCompletionData(prevData => ({
      ...prevData,
      [todayStr]: { completed: completedCount, total: newTasks.length },
    }));
  };

  const dayIsComplete = tasks.length > 0 && tasks.every(t => t.completed);
  let startButtonText = "Start Day";
  if (sessionStarted) startButtonText = "Day in Progress";
  if (dayIsComplete) startButtonText = "Day Complete!";

  return (
    <main className="app-container">
      <section className="task-section">
        <header>
          <h1>Today's Focus ✨</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <form id="add-task-form" onSubmit={handleAddTask}>
          <input
            id="task-input"
            type="text"
            value={taskInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskInput(e.target.value)}
            placeholder="Add a new task..."
            autoComplete="off"
            required
            disabled={sessionStarted || dayIsComplete}
          />
          <button type="submit" disabled={sessionStarted || dayIsComplete}>Add Task</button>
        </form>

        <div className="session-controls">
          <button
            id="start-day-btn"
            onClick={handleStartDay}
            disabled={tasks.length === 0 || sessionStarted || dayIsComplete}
          >
            {startButtonText}
          </button>
        </div>

        <TaskList tasks={tasks} onCompleteTask={handleCompleteTask} sessionStarted={sessionStarted} />
      </section>
      <section className="calendar-section">
        <Calendar completionData={completionData} />
      </section>
      
    </main>
  );
}

export default App;