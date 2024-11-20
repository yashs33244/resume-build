import { useRecoilState } from "recoil";
import {
  getSizeValue,
  getValueSize,
  resumeSizeAtom,
} from "../../store/resumeSize";
import Box from "@mui/material/Box";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import "./SizeChange.scss";
import { ResumeProps } from "../../types/ResumeProps";

interface SizeChangeProps {
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
  ) => void;
}

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: "#3a8589",
  height: 3,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fafafa",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .airbnb-bar": {
      height: 7.5,
      width: 1.5,
      backgroundColor: "rgba(0,0,0,0.8)",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-rail": {
    color: "#d8d8d8",
    opacity: 1,
    height: 3,
    ...theme.applyStyles("dark", {
      color: "#bfbfbf",
      opacity: undefined,
    }),
  },
}));

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

export default function SizeChange({ handleInputChange }: SizeChangeProps) {
  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);
  const [value, setValue] = useState(getSizeValue(resumeSize));

  function valuetext(value: number) {
    return `${value}`;
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      const newSize = getValueSize(newValue);
      if (newSize !== resumeSize) {
        setResumeSize(newSize);
        handleInputChange("size" as keyof ResumeProps, "size", newSize);
      }
    }
  };

  useEffect(() => {
    setValue(getSizeValue(resumeSize));
    console.log("Resume size changed to", resumeSize);
  }, [resumeSize]);

  return (
    <Box sx={{ width: 120 }}>
      <AirbnbSlider
        aria-label="Size"
        slots={{ thumb: AirbnbThumbComponent }}
        defaultValue={getSizeValue("M")}
        getAriaValueText={valuetext}
        valueLabelDisplay="on"
        onChange={handleChange}
        shiftStep={1}
        step={1}
        value={value}
        min={1}
        max={5}
      />
    </Box>
  );
}
