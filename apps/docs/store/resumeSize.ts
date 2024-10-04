import { atom, useRecoilState } from "recoil";

export const resumeSizeAtom = atom({
  key: "resumeSizeAtom", // unique ID
  default: "M", // stores remaining time for each resume by its ID
});
