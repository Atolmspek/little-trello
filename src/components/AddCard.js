import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

function AddCard(props) {
  const [ogText, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addTask(ogText);
    setText("");
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl>
       
        <Input
          type="text"
          id="new-todo-input"
          name="text"
          color="red"
          autoComplete="off"
          value={ogText}
          onChange={handleChange}
          required
        />
      </FormControl>
      <Button type="submit" colorScheme="teal" size="lg" mt={2}>
        Add
      </Button>
    </Box>
  );
}

export default AddCard;