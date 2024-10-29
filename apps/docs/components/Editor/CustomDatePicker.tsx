import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import { styled } from "@mui/material/styles";

const WhiteStyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    height: "24px",
    borderRadius: '12px',
    color: "rgba(255,255,255,0.85)",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.9)",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.85)",
  },
}));

interface CustomDatePickerProps {
  id: string;
  value: string;
  onChange: (
    category: string,
    field: string,
    value: string,
    index: number,
  ) => void;
  index: number;
  className?: string;
  field: "start" | "end";
  category: string; // New prop to specify whether it's a start or end date
}

export default function CustomDatePicker({
  id,
  value,
  onChange,
  index,
  className,
  field,
  category,
}: CustomDatePickerProps) {
  return (
    <WhiteStyledDatePicker
      // label={field === "start" ? "Start Date" : "End Date"}
      value={value ? dayjs(value) : null}
      onChange={(newValue: dayjs.Dayjs | null) => {
        onChange(
          category,
          field,
          newValue ? newValue.format("YYYY-MM-DD") : "",
          index,
        );
      }}
      slotProps={{
        textField: {
          id,
          placeholder: "MM/DD/YYYY",
          className: `form-input ${className || ""}`,
          InputLabelProps: { shrink: true },
        },
      }}
    />
  );
}
