import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./components/Card";
import AddCard from "./components/AddCard";
import { nanoid } from "nanoid";
import {
  ChakraProvider,
  Container,
  Box,
  Flex,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";

export default function App(props) {
  //localStorage.clear();
  const content = [
    {
      title: "Tarjeta 1",
      listId: nanoid(),
      cards: [
        { text: "hola", idCard: nanoid() },
        { text: "hallo", idCard: nanoid() },
      ],
    },
    {
      title: "Tarjeta 2",
      listId: nanoid(),
      cards: [
        { text: "hi!", idCard: nanoid() },
        { text: "Konichiwa", idCard: nanoid() },
      ],
    },
  ];

  const localStorageJSON = localStorage.getItem("card");
  const userData = localStorageJSON ? JSON.parse(localStorageJSON) : [];

  const [lists, setLists] = useState(content);

  const saveTasksToLocalStorage = (updatedCards) =>
    localStorage.setItem("card", JSON.stringify(updatedCards));

  const addCard = (text, listId) => {
    const newCard = { text, idCard: nanoid() };

    const updatedLists = lists.map((list) => {
      if (listId === list.listId) {
        return {
          ...list,
          cards: [...list.cards, newCard],
        };
      }
      return list;
    });

    setLists(updatedLists);
    saveTasksToLocalStorage(updatedLists);
  };

  const deleteCard = (idCard) => {
    const updatedLists = lists.map((list) => ({
      ...list,
      cards: list.cards.filter((card) => card.idCard !== idCard),
    }));

    setLists(updatedLists);

    saveTasksToLocalStorage(updatedLists);
  };

  function editCard(idCard, newText) {
   
    const updatedLists = lists.map((list) => {
   
      const updatedCards = list.cards.map((card) => {
        if (idCard === card.idCard) {
          
          return { ...card, text: newText };
        }
        return card;
      });
  
     
      return {
        ...list,
        cards: updatedCards,
      };
    });
  
    // Actualiza el estado con las listas actualizadas
    setLists(updatedLists);
  
    // Guarda en el almacenamiento local
    saveTasksToLocalStorage(updatedLists);
  }

  const handleDragEnd = (event) => {
    console.log('Hola soy drag end');
    const { active, over } = event;

    setLists((currentLists) => {
      const updatedLists = [...currentLists];

      const sourceListIndex = updatedLists.findIndex((list) =>
        list.cards.some((card) => card.idCard === active.idCard)
      );
      const targetListIndex = updatedLists.findIndex((list) =>
        list.cards.some((card) => card.idCard === over.idCard)
      );

      if (sourceListIndex === -1 || targetListIndex === -1) {
        return currentLists;
      }

      const sourceList = updatedLists[sourceListIndex];
      const targetList = updatedLists[targetListIndex];

      const oldIndex = sourceList.cards.findIndex(
        (card) => card.idCard === active.idCard
      );
      const newIndex = targetList.cards.findIndex(
        (card) => card.idCard === over.idCard
      );

      const movedCard = sourceList.cards[oldIndex];

      //Removes card from the original position
      sourceList.cards.splice(oldIndex, 1);

      // Adds the card to the destination position
      targetList.cards.splice(newIndex, 0, movedCard);

      return updatedLists;
    });
  };

  const createList = () => {
    const newList = {
      title: "Click to edit me",
      id: nanoid(),
      cards: [],
    };
    setLists([...lists, newList]);
  };

  const handleTitleClick = (index) => {
    const updatedLists = lists.map((list, listIndex) => {
      if (listIndex === index) {
        return { ...list, editMode: true };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const handleTitleEditSave = (index) => {
    const updatedLists = lists.map((list, listIndex) => {
      if (listIndex === index) {
        return { ...list, title: list.editedTitle, editMode: false };
      }
      return list;
    });
    setLists(updatedLists);
    saveTasksToLocalStorage(updatedLists);
  };

  return (
    <ChakraProvider>
      <Navbar createList={createList} />
      <Flex flexWrap="wrap">
        {lists.map((list, index) => (
          <Container key={list.listId} maxW="400px" mt={5}>
            <Box padding="4" bg="gray.100" borderRadius="lg" boxShadow="md">
              {list.editMode ? (
                <Flex>
                  <Input
                    value={list.editedTitle}
                    onChange={(e) => {
                      const updatedLists = lists.map((item, i) => {
                        if (i === index) {
                          return { ...item, editedTitle: e.target.value };
                        }
                        return item;
                      });
                      setLists(updatedLists);
                    }}
                  />
                  <Button onClick={() => handleTitleEditSave(index)}>
                    Save
                  </Button>
                </Flex>
              ) : (
                <Text
                  fontWeight={700}
                  mb={3}
                  onClick={() => handleTitleClick(index)}
                  cursor="pointer"
                >
                  {list.title}
                </Text>
              )}
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={list.cards}
                  strategy={verticalListSortingStrategy}
                >
                  {list.cards.map((card) => (
                    <Card
                      idCard={card.idCard}
                      text={card.text}
                      key={card.idCard}
                      deleteCard={deleteCard}
                      editCard={editCard}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              <AddCard addTask={(text) => addCard(text, list.listId)} />
            </Box>
          </Container>
        ))}
      </Flex>
    </ChakraProvider>
  );
}
