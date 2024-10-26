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
          checked={resumeSize === "Smallest" ? true : false}
          onChange={() => setResumeSize("Smallest")}
        />{" "}
        Smallest
      </div>
      <div className="input-check">
        <input
          name="size"
          type="radio"
          checked={resumeSize === "Smaller" ? true : false}
          onChange={() => setResumeSize("Smaller")}
        />{" "}
        Smaller
      </div>
      <div className="input-check">
        <input
          name="size"
          type="radio"
          checked={resumeSize === "Small" ? true : false}
          onChange={() => setResumeSize("Small")}
        />{" "}
        Small
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
