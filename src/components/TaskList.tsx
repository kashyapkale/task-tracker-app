import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (id: number) => void;
  sessionStarted: boolean;
}

function TaskList({ tasks, onCompleteTask, sessionStarted }: TaskListProps) {
  return (
    <ul id="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onCompleteTask={onCompleteTask}
          sessionStarted={sessionStarted}
        />
      ))}
    </ul>
  );
}

export default TaskList;