import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../store/resumeSize";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useState, useEffect } from 'react';

const sizes = [
  {
    value: 1,
    label: 'XS',
  },
  {
    value: 2,
    label: 'S',
  },
  {
    value: 3,
    label: 'M',
  },
  {
    value: 4,
    label: 'L',
  },
  {
    value: 5,
    label: 'XL',
  },
];

export default function SizeChange() {

  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);
  const [value, setValue] = useState(3);

  function valuetext(value:number) {
    return `${value}`;
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };

  const getSizeLabel = (size:number) => {    
    const sizeObj = sizes.find(s => s.value === size);
    return sizeObj ? sizeObj.label : '';
  }

  useEffect(() => {
    setResumeSize(getSizeLabel(value))
  }, [value])

  return (
    <Box sx={{ width: 120 }}>
      <Slider
        aria-label="Size"
        defaultValue={3}
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
