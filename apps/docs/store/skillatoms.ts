import { atom } from "recoil";

// Atom for core skill
export const coreSkillState = atom<string>({
  key: "coreSkillState",
  default: "", // Default value for coreSkill
});


// Atom for suggestions (array of strings)
export const suggestionsState = atom<string[]>({
  key: "suggestionsState",
  default: [], // Default value for suggestions
});
