import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text, Box, Button } from "@chakra-ui/react";

function Card({ user: props }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
    });

  const [isHovered, setIsHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };



  return (
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
      <Text>{props.Name}</Text>
      {isHovered && (
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => props.deleteCard(props.id)}
         
        >
          X
        </Button>
      )}
    </Box>
  );
}

export default Card;
