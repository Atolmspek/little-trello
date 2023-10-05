import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import User from "./components/User";
import AddCard from "./components/AddCard";
import { nanoid } from "nanoid";
import {
  ChakraProvider,
  Container,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";

function App() {
  localStorage.clear();
  const content = [
    {
      title: "Tarjeta 1",
      id: nanoid(),
      cards: [
        { Name: "hola", id: nanoid() },
        { Name: "hallo", id: nanoid() },
      ],
    },
    {
      title: "Tarjeta 2",
      id: nanoid(),
      cards: [
        { Name: "hi!", id: nanoid() },
        { Name: "Konichiwa", id: nanoid() },
      ],
    },
  ];

  const localStorageJSON = localStorage.getItem("card");
  const userData = localStorageJSON ? JSON.parse(localStorageJSON) : [];

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

  function deleteCard(id) {
    console.log(id);
    const remainingCards = lists.filter((list) => id !== list.id);
    setLists(remainingCards);
   // saveTasksToLocalStorage(remainingCards);
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setLists((currentLists) => {
      const updatedLists = [...currentLists];

      const sourceListIndex = updatedLists.findIndex((list) =>
        list.cards.some((card) => card.id === active.id)
      );
      const targetListIndex = updatedLists.findIndex((list) =>
        list.cards.some((card) => card.id === over.id)
      );

      if (sourceListIndex === -1 || targetListIndex === -1) {
        return currentLists;
      }

      const sourceList = updatedLists[sourceListIndex];
      const targetList = updatedLists[targetListIndex];

      const oldIndex = sourceList.cards.findIndex(
        (card) => card.id === active.id
      );
      const newIndex = targetList.cards.findIndex(
        (card) => card.id === over.id
      );

      const movedCard = sourceList.cards[oldIndex];

      //Removes card from the original position
      sourceList.cards.splice(oldIndex, 1);

      // Adds the card to the destination position
      targetList.cards.splice(newIndex, 0, movedCard);

      return updatedLists;
    });
  };

  function createList() {
    const newList = {
      title: "Prueba",
      id: nanoid(),
      cards: [],
    };
    setLists([...lists, newList]);
  }

  return (
    <ChakraProvider>
      <Navbar createList={createList} />
      <Flex flexWrap="wrap">
        {lists.map((list) => (
          
          <Container key={list.id} maxW="400px" mt={5}>
            <Box padding="4" bg="gray.100" borderRadius="lg" boxShadow="md">
              <Text fontWeight={700} mb={3}>{list.title}</Text>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={list.cards}
                  strategy={verticalListSortingStrategy}
                >
                  {list.cards.map((card) => (
                    <User user={card} key={card.id} deleteCard={() => deleteCard(card.id)} />
                  ))}
                 
                </SortableContext>
              </DndContext>
              <AddCard addTask={(Name) => addTask(list.id, Name)} />
            </Box>
          </Container>
        ))}
      </Flex>
    </ChakraProvider>
  );
}

export default App;
