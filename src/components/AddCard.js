import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/react";

function AddCard(props) {
  const [Text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addTask(Text);
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
          value={Text}
          onChange={handleChange}
          required
          bg="white" // Cambia el color de fondo a blanco (puedes usar el color que desees)
        />
      </FormControl>
      <Button type="submit" colorScheme="teal" size="lg" mt={2}>
        Add new Card
      </Button>
    </Box>
  );
}

export default AddCard;