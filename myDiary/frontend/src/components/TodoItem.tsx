import { useState } from "react";
import "./todo-item.css";
import type { TodoData } from "../App";

// 用來解析傳入的shit
type TodoItemProps = {
  date: string;
  tag: string;
  mood: string;
  description: string;
  onComplete: (newTodo:TodoData) => void;
  onDelete: () => void;
};


export default function TodoItem({
  date,
  tag,
  mood,
  description,
  onComplete,
  onDelete,
}: TodoItemProps) {
  const[mode, setMode] = useState(0);
  const [todoDate, setTodoDate] = useState(date);
  const [todoTag, setTodoTag] = useState(tag);
  const [todoMood, setTodoMood] = useState(mood);
  const [todoDescription, setTodoDescription] = useState(description);

  const weekDay = ['日', '一', '二', '三', '四', '五', '六']
  
  return (
    <div className="todo-item">
      {mode == 0?
        <div>
          <summary>
            <p>{date + `(${weekDay[new Date(date).getDay()]})`}</p>
            <p>{tag}</p>
            <p>{mood}</p>
            <button className="delete-todo" onClick={() =>{
              setMode(1)!
            }}>
              edit
            </button>
            <button className="delete-todo" onClick={onDelete}>
              delete
            </button>
          </summary>
          <p className="todo-description">{description}</p>
      </div>
      :
      <div>
        <summary>
          <input id="date" type="date" value={todoDate}
            onChange={(e) => setTodoDate(e.target.value)}
          />
          <select className="form-select" value={todoTag} aria-label="Default select example"
            onChange={(e) => setTodoTag(e.target.value)}>
          <option defaultValue="Academic">Academic</option>
          <option value="Interpersonal">Interpersonal</option>
          <option value="Club">Club</option>
          </select>
          <select className="form-select" value={todoMood} aria-label="Default select example"
            onChange={(e) => setTodoMood(e.target.value)}>
          <option defaultValue="Happiness">Happiness</option>
          <option value="Anger">Anger</option>
          <option value="Sadness">Sadness</option>
          </select>
          <button className="edit-todo" onClick={() =>{
            onComplete({date: todoDate, tag: todoTag, mood: todoMood, description: todoDescription }) 
            setMode(0)!
          }}>
            complete
          </button>
          <button className="delete-todo" onClick={onDelete}>
            delete
          </button>
        </summary>
        <textarea
          id="todo-description-input"
          placeholder="description"
          tabIndex={2}
          value={todoDescription}
          onChange={(e) => setTodoDescription(e.target.value)}>
        </textarea>
    </div>
    }
    </div>
  );
}


