"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [geminiContent, setGeminiContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGeminiContent(data);
      } catch (error) {
        console.error("Error fetching Gemini content:", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <main>
      <div>
        <h1>Gemini API Response</h1>
        <pre>
          {geminiContent
            ? JSON.stringify(geminiContent, null, 2)
            : "Loading..."}
        </pre>
      </div>
    </main>
  );
}
