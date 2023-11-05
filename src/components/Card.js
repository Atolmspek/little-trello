import React, { useState } from "react";
import { Text, Box, Button, ButtonGroup, Input, Spacer, FormControl, Flex } from "@chakra-ui/react";


function Card(props) {


  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [newText, setNewText] = useState(props.text);



  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setNewText(props.text);
  };

  const handleMouseEnter = () => {
    
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSaveClick = (event) => {
    event.preventDefault()
    props.editCard(props.idCard, newText);
    setEditing(false);
  };

  const handleDelete = () => {
    props.deleteCard(props.idCard);
  };

  const handleNameChange = (e) => {
    setNewText(e.target.value);
  };

  

  const viewTemplate = (
   
   
    <Box
      className="container"
      boxShadow="base"
      bg="#CBD5E0"
      p={3}
      mb={4}
      padding="4"
      width="100%"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >



      <Text>{props.text}</Text>
     
      <Spacer/>
        {isHovered && (
          <Flex minWidth='max-content' alignItems='right' > 
          <Spacer />
           <ButtonGroup gap='0' >
            <Button
              size="sm"
              colorScheme="teal"
              ml="auto" 
              onDoubleClick={handleEditClick}
            >
              Edit
            </Button>
            <Button
              size="sm"
              colorScheme="red"
             onDoubleClick={() => handleDelete(props.idCard)}
            //  onMouseDown={() => handleDelete(props.idCard)} Plausible solution as well but it causes and exception when there's only an item on the list.
              >X
            </Button>
            </ButtonGroup>
          </Flex>
        )}
      
    </Box>
    
 
    
  );

  const editingTemplate = (
    <FormControl>
      <Input
        type="text"
        value={newText}
        onChange={handleNameChange}
        autoFocus
      />
      <Flex>
        <Button colorScheme="teal" size="sm" onClick={handleSaveClick}>
          Save
        </Button>
        <Button colorScheme="red" size="sm" onClick={handleCancelClick}>
          Cancel
        </Button>
      </Flex>
    </FormControl>
  );

  return (
   
    <Box
      
    >
      {isEditing ? editingTemplate : viewTemplate}
    </Box>
  );
}

export default Card;