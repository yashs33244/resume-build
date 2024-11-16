import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Label } from "@repo/ui/components/ui/label";
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
          borderRadius: "4px",
          marginTop: "12px",
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
          height: '10px'
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

const ExperienceDatePickers = ({ index, exp, handleInputChange, type }: any) => {
  const handleStartDateChange = (newValue: any) => {
    if (newValue) {
      const startDate = newValue.format("YYYY-MM");
      handleInputChange(type, "start", startDate, index);

      // Clear end date if it exists and is not strictly after new start date
      if (exp.end && !dayjs(exp.end).isAfter(startDate, "month")) {
        handleInputChange(type, "end", "", index);
      }
    } else {
      handleInputChange(type, "start", "", index);
      // Clear end date if start date is cleared
      if (exp.end) {
        handleInputChange(type, "end", "", index);
      }
    }
  };

  const handleEndDateChange = (newValue: any) => {
    if (newValue) {
      const endDate = newValue.format("YYYY-MM");
      // if (!dayjs(endDate).isAfter(dayjs(exp.start), "month")) {
      //   alert("End date must be after start date");
      //   return;
      // }
      handleInputChange(type, "end", endDate, index);
    } else {
      handleInputChange(type, "end", "", index);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="row-form-field">
            <Label htmlFor={`role-${index}`} className="field-label">
              Start Date
            </Label>
            <DatePicker
              openTo="year"
              views={["year", "month"]}
              value={exp.start ? dayjs(exp.start) : null}
              onChange={handleStartDateChange}
              format="MM YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: false,
                  placeholder: "MM YYYY",
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#1B2432",
                  borderRadius: "14px",
                },
              }}
            />
          </div>
          <div className="row-form-field">
            <Label htmlFor={`role-${index}`} className="field-label">
              End Date
            </Label>
            <DatePicker
              openTo="year"
              views={["year", "month"]}
              value={exp.end ? dayjs(exp.end) : null}
              onChange={handleEndDateChange}
              format="MM YYYY"
              disabled={exp.current} // Disable if the experience is current
              minDate={exp.start ? dayjs(exp.start).add(1, "month") : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: false,
                  placeholder: "MM YYYY",
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#1B2432",
                  borderRadius: "14px",
                },
              }}
            />
          </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ExperienceDatePickers;
