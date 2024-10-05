import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../store/resumeSize";

export default function SizeChange() {
  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);
  return (
    <>
      <div className="input-check">
        <input
          name="size"
          type="radio"
          checked={resumeSize === "S" ? true : false}
          onChange={() => setResumeSize("S")}
        />{" "}
        S
      </div>
      <div className="input-check">
        <input
          name="size"
          type="radio"
          checked={resumeSize === "M" ? true : false}
          onChange={() => setResumeSize("M")}
        />{" "}
        M
      </div>
      <div className="input-check">
        <input
          name="size"
          type="radio"
          checked={resumeSize === "L" ? true : false}
          onChange={() => setResumeSize("L")}
        />{" "}
        L
      </div>
    </>
  );
}
