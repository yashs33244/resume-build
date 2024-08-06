import React, { useState } from "react";

interface AiPromptProps {
  onGenerate: (prompt: string) => Promise<void>;
}

export default function AiPrompt({ onGenerate }: AiPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    await onGenerate(prompt);
    setIsOpen(false);
    setPrompt("");
  };

  return (
    <div>
      <button
        className="px-6 py-2 bg-gray-800 text-white rounded-full"
        onClick={() => setIsOpen(true)}
      >
        Ask AI
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-[425px] w-full">
            <h2 className="text-xl font-bold mb-2">Ask AI</h2>
            <p className="text-gray-600 mb-4">
              Enter your prompt for the AI assistant.
            </p>
            <div className="mb-4">
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prompt
              </label>
              <input
                id="prompt"
                type="text"
                placeholder="Enter your prompt..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSubmit}
              >
                Ask AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
