import { useState } from "react";
import ExForm from "./ExForm";
import { AiOutlineDelete } from "react-icons/ai";

interface ExItemProps {
  item: TeamUserEx;
  index?: number;

  onUpdate: (newEx: TeamUserEx) => void;
  onDelete: () => void;
}

const ExItem = ({ item: ex, onDelete, onUpdate }: ExItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      {isEditing && (
        <ExForm
          payload={ex}
          onCancel={() => setIsEditing(false)}
          onChange={onUpdate}
        />
      )}
      <li key={ex.name}>
        <div className="row">
          <p className="font-bold flex-1" onClick={() => setIsEditing(true)}>
            {ex.name}
            <span className="font-light text-xs ml-1">
              {ex.length.start.year}.{ex.length.start.month}~
              {ex.length.end === "현재까지"
                ? ex.length.end
                : `${ex.length.end.year}.${ex.length.end.month}`}
            </span>
          </p>
          <button
            type="button"
            onClick={onDelete}
            className="w-5 h-5 p-0 text-sm hover:text-red-500"
          >
            <AiOutlineDelete />
          </button>
        </div>
        <ul className="rounded p-1" onClick={() => setIsEditing(true)}>
          {ex.descs.map((d, index) => (
            <li key={d} className="text-gray-500">
              {index + 1}. {d}
            </li>
          ))}
        </ul>
      </li>
    </>
  );
};

export default ExItem;
