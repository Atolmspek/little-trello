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
  Flex,
  VStack,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";

function App() {

  localStorage.clear();
  const content = [
    {
      id: nanoid(),
      cards: [
        { Name: "hola", id: nanoid() },
        { Name: "hallo", id: nanoid() },
      ],
    },
    {
      id: nanoid(),
      cards: [
        { Name: "hi!", id: nanoid() },
        { Name: "Konichiwa", id: nanoid() },
      ],
    },
  ];

  const localStorageJSON = localStorage.getItem('card');
  const userData = localStorageJSON ? JSON.parse(localStorageJSON) : [];

  const [lists, setLists] = useState(userData);

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
        (list) => list.cards.some((card) => card.id === active.id)
      );
      const targetListIndex = updatedLists.findIndex(
        (list) => list.cards.some((card) => card.id === over.id)
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
      <Navbar createList={createList}/>
     <Flex flexWrap="wrap">
      {lists.map((list) => (
        <Container key={list.id} maxW="400px" mt={5}>
      
          <Box 
             padding="4"
             bg="gray.100"
             borderRadius="lg"
             boxShadow="md"
             
             >
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={list.cards}
                strategy={verticalListSortingStrategy}
              >
                
                  {list.cards.map((card) => (
                    <User user={card} key={card.id} />
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

