import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";

// Helper functions for LinkedIn URL parsing
const extractLinkedinUsername = (url: string): string => {
  if (!url) return "";

  try {
    // Handle different LinkedIn URL formats
    const patterns = [
      /linkedin\.com\/in\/([^\/\?]+)/i, // linkedin.com/in/username
      /linkedin\.com\/pub\/([^\/\?]+)/i, // linkedin.com/pub/username
      /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^\/\?]+)/i, // full URL with optional https
      /^@?([a-zA-Z0-9-]+)$/, // just the username or @username
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If no patterns match but input exists, assume it's just the username
    return url.trim();
  } catch (e) {
    return url;
  }
};

const formatLinkedinUrl = (username: string): string => {
  if (!username) return "";
  // Remove any @ symbol and clean the username
  const cleanUsername = username.replace(/^@/, "").trim();
  return `https://linkedin.com/in/${cleanUsername}`;
};

// Modified LinkedIn input field component
export const LinkedInInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const username = extractLinkedinUsername(inputValue);
    const fullUrl = formatLinkedinUrl(username);
    onChange(fullUrl);
  };

  return (
    <div className="form-field">
      <Label className="field-label" htmlFor="linkedin">
        Your LinkedIn
      </Label>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{ backgroundColor: '#121420', color: 'rgba(255,255,255,0.5)', padding: '6.9px 20px', marginTop: '12px', border: '0.5px solid rgba(255,255,255,0.4)', borderRight: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'}}>https://linkedin.com/in/</div>
        <Input
          id="linkedin"
          className="form-input"
          style={{borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderLeft: 'none'}}
          type="text"
          value={extractLinkedinUsername(value)}
          onChange={handleInputChange}
          placeholder="Paste your username here.."
        />
      </div>      
    </div>
  );
};
