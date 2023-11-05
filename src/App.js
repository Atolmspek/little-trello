import React, { useState } from "react";
import Card from "./components/Card";
import AddCard from "./components/AddCard";
import { nanoid } from "nanoid";
import {
  FormControl,
  ChakraProvider,
  Container,
  Box,
  Flex,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Navbar from "./components/Navbar";

export default function App() {
  //localStorage.clear();
  const localStorageJSON = localStorage.getItem("card");
  const userData = localStorageJSON ? JSON.parse(localStorageJSON) : [];

  const [lists, setLists] = useState(userData);

  const saveTasksToLocalStorage = (updatedCards) =>
    localStorage.setItem("card", JSON.stringify(updatedCards));

  const addCard = (text, listId) => {
    const newCard = { text, idCard: nanoid() };
    const updatedLists = lists.map((list) => {
      if (listId === list.id) {
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

  const createList = () => {
    const newList = {
      title: "Click to edit me",
      id: nanoid(),
      cards: [],
    };
    setLists([...lists, newList]);
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

  const handleTitleClick = (index) => {
    const updatedLists = lists.map((list, listIndex) => {
      if (listIndex === index) {
        return { ...list, editMode: true };
      }
      return list;
    });
    setLists(updatedLists);
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

    setLists(updatedLists);
    saveTasksToLocalStorage(updatedLists);
  }

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return; 
    }

    const { source, destination } = result;

    const move = (source, destination, droppableSource, droppableDestination) => {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);
  
      destClone.splice(droppableDestination.index, 0, removed);
  
      const result = {};
      result[droppableSource.droppableId] = sourceClone;
      result[droppableDestination.droppableId] = destClone;
  
      return result;
  };

    if (source.droppableId === destination.droppableId) {
      // Movement on same list
      const listIndex = lists.findIndex((list) => list.id === source.droppableId);
      if (listIndex !== -1) {
        const list = lists[listIndex];
        const updatedCards = [...list.cards];
        const [movedCard] = updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, movedCard);
        const updatedLists = [...lists];
        updatedLists[listIndex] = { ...list, cards: updatedCards };
        setLists(updatedLists);
        saveTasksToLocalStorage(updatedLists);
      }
    } else {
      // Movement among different lists
      const sourceListIndex = lists.findIndex((list) => list.id === source.droppableId);
      const destinationListIndex = lists.findIndex((list) => list.id === destination.droppableId);

      if (sourceListIndex !== -1 && destinationListIndex !== -1) {
        const sourceList = lists[sourceListIndex];
        const destinationList = lists[destinationListIndex];
        const updatedSourceCards = [...sourceList.cards];
        const updatedDestinationCards = [...destinationList.cards];


        const [movedCard] = updatedSourceCards.splice(source.index, 1);
        updatedDestinationCards.splice(destination.index, 0, movedCard);

        const updatedLists = [...lists];
        updatedLists[sourceListIndex] = { ...sourceList, cards: updatedSourceCards };
        updatedLists[destinationListIndex] = { ...destinationList, cards: updatedDestinationCards };

        setLists(updatedLists);
        saveTasksToLocalStorage(updatedLists);
      }
    }
  };

  return (
    <ChakraProvider>
      <Navbar createList={createList} />
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, result.source, result.destination)}>
        <Flex flexWrap="wrap">
          {lists.map((list, index) => (
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div ref={provided.innerRef}>
                  <Container key={list.id} maxW="400px" mt={5}>
                    <Box
                      padding="4"
                      bg="gray.100"
                      borderRadius="lg"
                      boxShadow="md"
                    >
                      {list.editMode ? (
                        <Flex>
                          <FormControl>
                            <Input
                              required
                              value={list.editedTitle}
                              onChange={(e) => {
                                const updatedLists = lists.map((item, i) => {
                                  if (i === index) {
                                    return {
                                      ...item,
                                      editedTitle: e.target.value,
                                    };
                                  }
                                  return item;
                                });
                                setLists(updatedLists);
                              }}
                            />
                            <Button
                              type="submit"
                              onClick={() => handleTitleEditSave(index)}
                            >
                              Save
                            </Button>
                          </FormControl>
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
                      <div>
                        {list.cards.map((card, cardIndex) => (
                          <Draggable
                            key={card.idCard}
                            draggableId={card.idCard}
                            index={cardIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  idCard={card.idCard}
                                  text={card.text}
                                  key={card.idCard}
                                  deleteCard={deleteCard}
                                  editCard={editCard}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      <AddCard addTask={(text) => addCard(text, list.id)} />{" "}
                    </Box>
                  </Container>
                </div>
              )}
            </Droppable>
          ))}
        </Flex>
      </DragDropContext>
    </ChakraProvider>
  );
}