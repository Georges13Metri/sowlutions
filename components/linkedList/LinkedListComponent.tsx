"use client";
import React, { useState } from "react";
import { LinkedList } from "./LinkedList";

const LinkedListComponent: React.FC = () => {
  const [list, setList] = useState(new LinkedList<number>());
  const [inputValue, setInputValue] = useState("");
  const [threshold, setThreshold] = useState("");

  const handleAddNode = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num)) {
      const newList = new LinkedList<number>();
      list.toArray().forEach((val) => newList.add(val)); // Copy existing elements
      newList.add(num);
      setList(newList);
      setInputValue("");
    }
  };

  const handleRemoveGreaterThan = () => {
    const numThreshold = parseInt(threshold);
    if (!isNaN(numThreshold)) {
      const newList = new LinkedList<number>();
      list.toArray().forEach((val) => newList.add(val)); // Copy existing elements
      newList.removeGreaterThan(numThreshold);
      setList(newList);
      setThreshold("");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Linked List Operations</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="number"
          className="border p-2 rounded-md"
          placeholder="Enter number to add"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddNode}
        >
          Add Node
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="number"
          className="border p-2 rounded-md"
          placeholder="Remove greater than..."
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={handleRemoveGreaterThan}
        >
          Remove Greater
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Current Linked List:</h2>
      <div className="flex flex-wrap gap-2">
        {list.toArray().length > 0 ? (
          list.toArray().map((item, index) => (
            <span
              key={index}
              className="bg-purple-200 px-3 py-1 rounded-full text-purple-800"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-gray-600">List is empty.</p>
        )}
      </div>
    </div>
  );
};

export default LinkedListComponent;
