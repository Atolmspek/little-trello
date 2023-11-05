import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/react";
import {nanoid} from 'nanoid';

function AddCard(props) {
  const [Text, setText] = useState("");
  const [isAdding, setAdding] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = () => {
    setAdding(!isAdding);
  }

  const cancelClick = () => {
    setAdding(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    props.addTask(Text);
    setText("");
    setAdding(false);

    
  };

  const newCard = (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl margin="auto">
        <Input
          size='xs'
          type="text"
          id="new-todo-input"
          name="text"
          color="red"
          autoComplete="off"
          value={Text}
          onChange={handleChange}
          required
          bg="white"
        />
        <Button type="submit" colorScheme="red" size="xs" mt={2}>
          ➕ Save
        </Button>
        <Button colorScheme="blue" onClick={cancelClick} ml={1} mt={2} size="xs">Cancel</Button>

      </FormControl>
    </Box>
  );

  const setAdd = (
    <Box as="form">
      <FormControl margin="auto">
        <Button type="submit" onClick={handleClick} colorScheme="teal" size="xs" mt={2}>
          ➕ Add new card
        </Button>
      </FormControl>
    </Box>
  );

  return isAdding ? newCard : setAdd;
}

export default AddCard;