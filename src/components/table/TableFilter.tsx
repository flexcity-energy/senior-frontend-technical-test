import { useState, useEffect } from "react";
import { InputGroup, Form } from "react-bootstrap";

/**
 * Table filter props
 */
interface TableFilterProps {
  /**
   * Filter initial value
   */
  value: string | number;

  /**
   * Filter input onChange
   */
  onChange: (value: string | number) => void;

  /**
   * Debounce for optimization, to prevent filtering each time input changes
   */
  debounce?: number;

  /**
   * Class name
   */
  className: string;
}

/**
 * Table filter component for filtering data on any column in table
 */
const TableFilter = ({
  value: initialValue,
  onChange,
  debounce = 500,
  className,
}: TableFilterProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  // Init input value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Apply filter only at the end of timeout
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
