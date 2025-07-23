import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onCompleteTask: (id: number) => void;
  sessionStarted: boolean;
}

function TaskItem({ task, onCompleteTask, sessionStarted }: TaskItemProps) {
  // ... component code remains the same
  const handleDoneClick = () => {
    onCompleteTask(task.id);
  };

  return (
    <li className={`task-item ${task.completed ? 'done' : ''}`}>
      <span className="task-text">{task.text}</span>
      <button
        className="done-btn"
        onClick={handleDoneClick}
        disabled={task.completed || !sessionStarted}
      >
        Done
      </button>
    </li>
  );
}

export default TaskItem;