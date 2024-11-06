import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.8)",
          },
        },
        input: {
          color: "rgba(255, 255, 255, 0.85)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.7)",
          "&.Mui-focused": {
            color: "rgba(255, 255, 255, 0.8)",
          },
        },
      },
    },
  },
});

const EducationYearPickers = ({ index, edu, handleInputChange }: any) => {
  const currentYear = new Date().getFullYear();
  const minDate = dayjs("2005-01-01");
  const maxDate = dayjs("2030-12-31");

  const handleStartYearChange = (newValue: any) => {
    if (newValue) {
      const year = newValue.year().toString();
      handleInputChange("education", "start", year, index);
      if (edu.end && parseInt(edu.end) <= parseInt(year)) {
        handleInputChange("education", "end", "", index);
      }
    } else {
      handleInputChange("education", "start", "", index);
    }
  };

  const handleEndYearChange = (newValue: any) => {
    if (newValue) {
      const year = newValue.year().toString();
      handleInputChange("education", "end", year, index);
    } else {
      handleInputChange("education", "end", "", index);
    }
  };

  const pickerStyle = {
    width: "47%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1B2432",
      borderRadius: "16px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.36)",
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          className="form-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "28px",
          }}
        >
          <DatePicker
            label="Start Year"
            openTo="year"
            views={["year"]}
            value={edu.start ? dayjs(edu.start) : null}
            onChange={handleStartYearChange}
            minDate={minDate}
            maxDate={maxDate}
            sx={pickerStyle}
          />
          <DatePicker
            label="End Year"
            openTo="year"
            views={["year"]}
            value={edu.end ? dayjs(edu.end) : null}
            onChange={handleEndYearChange}
            minDate={edu.start ? dayjs(edu.start).add(1, "year") : minDate}
            maxDate={maxDate}
            sx={pickerStyle}
          />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default EducationYearPickers;
