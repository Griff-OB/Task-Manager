import React, { useState, useEffect } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit, Trash2 } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          dueDate: newTaskDueDate,
          priority: newTaskPriority,
        },
      ]);
      setNewTask('');
      setNewTaskDueDate('');
      setNewTaskPriority('medium');
    }
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const startEditing = (id, text) => {
    setEditingTask(id);
    setEditedTaskText(text);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editedTaskText } : task
      )
    );
    setEditingTask(null);
    setEditedTaskText('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditedTaskText('');
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <label>Due Date:</label>
        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
      </div>
      <div>
        <label>Priority:</label>
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <motion.ul
        layout
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                backgroundColor:
                  task.priority === 'high'
                    ? 'lightcoral'
                    : task.priority === 'medium'
                    ? 'lightyellow'
                    : 'lightgreen',
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              {editingTask === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTaskText}
                    onChange={(e) => setEditedTaskText(e.target.value)}
                  />
                <button onClick={() => saveEdit(task.id)}><Check /></button>
                <button onClick={cancelEdit}><Trash2 /></button>
              </>
            ) : (
              <>
                <span onClick={() => toggleComplete(task.id)}>
                  {task.text} {task.dueDate ? `(Due: ${task.dueDate})` : ''}
                </span>
                <button onClick={() => startEditing(task.id, task.text)}>
                  <Edit />
                </button>
                <button onClick={() => deleteTask(task.id)}><Trash2 /></button>
              </>
            )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

export default App;
