import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../store/resumeSize";
import Box from '@mui/material/Box';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import "./SizeChange.scss";

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

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: '#3a8589',
  height: 3,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fafafa',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
    '& .airbnb-bar': {
      height: 7.5,
      width: 1.5,
      backgroundColor: 'rgba(0,0,0,0.8)',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  '& .MuiSlider-track': {
    height: 3,
  },
  '& .MuiSlider-rail': {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
    ...theme.applyStyles('dark', {
      color: '#bfbfbf',
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

export default function SizeChange(props:any) {

  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);
  const [value, setValue] = useState(3);

  function valuetext(value:number) {
    return `${value}`;
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      const sizeObj = sizes.find((s) => s.value === newValue)
      if(sizeObj && sizeObj.label !== resumeSize) {
        setResumeSize(sizeObj.label);
      }
    }
  };

  useEffect(() => {
    const sizeObj = sizes.find((s) => s.label === resumeSize);
    if(sizeObj && sizeObj.value) {
      setValue(sizeObj.value);
    }
  }, [resumeSize]);

  return (
    <Box sx={{ width: 120 }}>
      <AirbnbSlider
        aria-label="Size"
        slots={{ thumb: AirbnbThumbComponent }}
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
