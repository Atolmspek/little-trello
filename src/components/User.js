import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text, Box } from "@chakra-ui/react";

function User({ user }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: user.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
    className="container"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      boxShadow="base"
      bg='darkgrey'
      p={3}
      mb={4}
    >
      <Text>{user.Name}</Text>
    </Box>
  );
}

export default User;