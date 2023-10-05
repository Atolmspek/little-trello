import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text, Box, Button } from "@chakra-ui/react";

function User({ user }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: user.id,
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
      <Text>{user.Name}</Text>
      {isHovered && (
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => user.deleteCard(user.id)}
         
        >
          X
        </Button>
      )}
    </Box>
  );
}

export default User;
