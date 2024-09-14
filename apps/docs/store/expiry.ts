import { atom, useRecoilState } from "recoil";

export const resumeTimeAtom = atom({
  key: "resumeTimeAtom", // unique ID
  default: {}, // stores remaining time for each resume by its ID
});
