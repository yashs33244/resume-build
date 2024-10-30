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
          backgroundColor: "#1B2432",
          borderRadius: "16px",
          border: "rgba(255, 255, 255, 0.4)",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&.Mui-focused": {
            borderColor: "rgba(255, 255, 255, 0.8)",
          },
        },
        input: {
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: "14px",
          padding: "16px 16px",
        },
        notchedOutline: {
          border: "0.5px solid rgba(255, 255, 255, 0.4)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "14px",

          "&.Mui-focused": {
            color: "rgba(255, 255, 255, 0.8)",
          },
        },
      },
    },
    //@ts-ignore
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.85)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
  },
});

const ExperienceDatePickers = ({ index, exp, handleInputChange }: any) => {
  const handleStartDateChange = (newValue: any) => {
    if (newValue) {
      const startDate = newValue.format("YYYY-MM");
      handleInputChange("experience", "start", startDate, index);

      // Clear end date if it exists and is not strictly after new start date
      if (exp.end && !dayjs(exp.end).isAfter(startDate, "month")) {
        handleInputChange("experience", "end", "", index);
      }
    } else {
      handleInputChange("experience", "start", "", index);
      // Clear end date if start date is cleared
      if (exp.end) {
        handleInputChange("experience", "end", "", index);
      }
    }
  };

  const handleEndDateChange = (newValue: any) => {
    if (newValue) {
      const endDate = newValue.format("YYYY-MM");
      if (!dayjs(endDate).isAfter(dayjs(exp.start), "month")) {
        alert("End date must be after start date");
        return;
      }
      handleInputChange("experience", "end", endDate, index);
    } else {
      handleInputChange("experience", "end", "", index);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex space-x-12">
          <div className="flex-1">
            <DatePicker
              label="Start Date"
              openTo="year"
              views={["year", "month"]}
              value={exp.start ? dayjs(exp.start) : null}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: false,
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#1B2432",
                  borderRadius: "16px",
                },
              }}
            />
          </div>
          <div className="row-form-field">
            <DatePicker
              label="End Date"
              openTo="year"
              views={["year", "month"]}
              value={exp.end ? dayjs(exp.end) : null}
              onChange={handleEndDateChange}
              disabled={exp.current} // Disable if the experience is current
              minDate={exp.start ? dayjs(exp.start).add(1, "month") : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: false,
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#1B2432",
                  borderRadius: "16px",
                },
              }}
            />
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ExperienceDatePickers;
