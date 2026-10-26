import { useId } from "react";

interface DatePickerProps {
  label: string;
  name: string;
  defaultValue: string; // YYYY-MM-DD
}

// The browser's own date picker with a label. It already works with the keyboard and on phones.
export default function DatePicker({ label, name, defaultValue }: DatePickerProps) {
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="date" name={name} defaultValue={defaultValue} required />
    </div>
  );
}
