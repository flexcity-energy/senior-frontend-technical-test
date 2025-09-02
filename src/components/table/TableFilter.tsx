import { useState, useEffect } from "react";
import { InputGroup, Form } from "react-bootstrap";

interface TableFilterProps {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  className: string;
}

const TableFilter = ({
  value: initialValue,
  onChange,
  debounce = 500,
  className,
}: TableFilterProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <InputGroup className={className} size="lg">
      <Form.Control
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
    </InputGroup>
  );
};

export default TableFilter;
