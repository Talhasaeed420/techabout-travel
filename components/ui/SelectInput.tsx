import { useId } from "react";

interface SelectInputProps {
  label: string;
  options: { value: string; label: string }[];
  name?: string;
  value?: string; // use value + onChange when the page controls the dropdown
  defaultValue?: string; // use defaultValue in a normal form
  onChange?: (value: string) => void;
}

// A label and a dropdown. onChange gives you the chosen value as text.
export default function SelectInput({ label, options, name, value, defaultValue, onChange }: SelectInputProps) {
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} value={value} defaultValue={defaultValue} onChange={onChange ? (event) => onChange(event.target.value) : undefined}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
