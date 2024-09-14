// atoms.js
import { atom } from "recoil";

// Atom for PDF generation state
export const isGeneratingPDFAtom = atom({
  key: "isGeneratingPDF", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (initial value)
});
