interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// A checkbox with its label. Clicking the text ticks it too.
export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="choice">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
