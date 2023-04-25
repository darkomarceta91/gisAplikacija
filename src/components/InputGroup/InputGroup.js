import React from "react";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const InputGroup = ({
  name,
  placeholder,
  nameValue,
  value,
  type,
  register,
  rules,
  error,
  disabled,
  options, // Add options as a prop
}) => {
  return (
    <Form.Group className="mb-3" controlId={`InputGroup-${uuidv4()}`}>
      <Form.Label className="mb-1">{name}</Form.Label>
      {type === "select" ? (
        <Form.Select
          {...register(`${nameValue}`, rules)}
          placeholder={placeholder}
          disabled={disabled}
        >
          {options.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          {...register(`${nameValue}`, rules)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};

export default InputGroup;
