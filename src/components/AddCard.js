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
      <FormControl margin="auto">
        <Input size='xs'
          type="text"
          id="new-todo-input"
          name="text"
          color="red"
          autoComplete="off"
          value={Text}
          onChange={handleChange}
          required
          bg="white"/>
           <Button type="submit" colorScheme="teal"  size="xs"  mt={2}>
        ➕ Add card
      </Button>
      </FormControl>
     
    </Box>
  );
}

export default AddCard;