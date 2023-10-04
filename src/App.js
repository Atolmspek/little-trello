import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import User from "./components/User";
import AddCard from "./components/AddCard";
import { nanoid } from "nanoid";
import {
  ChakraProvider,
  Container,
  Button,
  Box,
  VStack,
} from "@chakra-ui/react";

function App() {
  const content = [
    {
      id: 1,
      cards: [
        { Name: "hola", id: nanoid() },
        { Name: "hallo", id: nanoid() },
      ],
    },
    {
      id: 2,
      cards: [
        { Name: "hi!", id: nanoid() },
        { Name: "Konichiwa", id: nanoid() },
      ],
    },
  ];

  const [lists, setLists] = useState(content);

  const saveTasksToLocalStorage = (updatedCards) =>
    localStorage.setItem("card", JSON.stringify(updatedCards));

  function addTask(rowId, Name) {
    const newTask = { Name, id: nanoid() };

    const updatedLists = lists.map((list) => {
      if (list.id === rowId) {
        return {
          ...list,
          cards: [...list.cards, newTask],
        };
      }
      return list;
    });

    setLists(updatedLists);
    saveTasksToLocalStorage(updatedLists);
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setLists((currentLists) => {
      const updatedLists = [...currentLists];

      const sourceListIndex = updatedLists.findIndex(
        (list) => list.id === active.id
      );
      const targetListIndex = updatedLists.findIndex(
        (list) => list.id === over.id
      );

      const sourceList = updatedLists[sourceListIndex];
      const targetList = updatedLists[targetListIndex];

      const oldIndex = sourceList.cards.findIndex(
        (card) => card.id === active.id
      );
      const newIndex = targetList.cards.findIndex(
        (card) => card.id === over.id
      );

      const movedCard = sourceList.cards[oldIndex];

      // Remueve la tarjeta de la lista de origen
      sourceList.cards.splice(oldIndex, 1);

      // Inserta la tarjeta en la lista de destino
      targetList.cards.splice(newIndex, 0, movedCard);

      return updatedLists;
    });
  };

  // Función para agregar una nueva lista
  function createList() {
    const newList = {
      id: nanoid(),
      cards: [],
    };
    setLists([...lists, newList]);
  }

  return (
    <ChakraProvider>
      {/* Renderiza las listas */}
      {lists.map((list) => (
        <Container key={list.id} maxW="container.sm" mt={5}>
          <Box padding="4" bg="gray.100" borderRadius="lg" boxShadow="md">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={list.cards}
                strategy={verticalListSortingStrategy}
              >
                <VStack spacing={4}>
                  {list.cards.map((card) => (
                    <User user={card} key={card.id} />
                  ))}
                </VStack>
              </SortableContext>
            </DndContext>
            <AddCard addTask={(Name) => addTask(list.id, Name)} />
          </Box>
        </Container>
      ))}
      <Button colorScheme="teal" onClick={createList}>
        New List
      </Button>
    </ChakraProvider>
  );
}

export default App;

