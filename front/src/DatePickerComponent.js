import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerCustom.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);

const DatePickerComponent = ({
  selectedDate,
  onDateChange,
  placeholder,
  minDate,
  maxDate,
}) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onDateChange}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      minDate={minDate}
      maxDate={maxDate}
      className="form-control"
      calendarClassName="custom-calendar"
      locale="es"
    />
  );
};

export default DatePickerComponent;
