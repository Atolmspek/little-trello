import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text, Box, Button, ButtonGroup, Input, Spacer, FormControl, Flex } from "@chakra-ui/react";

function Card(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.card
    });

  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [newText, setNewText] = useState(props.text);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const handleSaveClick = () => {
    console.log('card que dispara el evento ', props.idCard )
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
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
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
              onClick={handleEditClick}
              ml="auto" // Margen izquierdo automático para el botón Edit
            >
              Edit
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => handleDelete(props.idCard)}
            >
              X
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