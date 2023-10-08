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

/* There seems to be a bug or something I'm missing with my lackluster React knowledge

It seems you can't have the edit/delete buttons on the same container as the card component,
otherwise react-dnd will consider every click on those buttons as a drag and drop attempt,
killing the functionalty of said buttons.

I've gotta try another library but for now this is it.
*/

export default function App(props) {
  //localStorage.clear();

  const localStorageJSON = localStorage.getItem("card");
  const userData = localStorageJSON ? JSON.parse(localStorageJSON) : [];

  const [lists, setLists] = useState(userData);

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
  
    
    setLists(updatedLists);
    saveTasksToLocalStorage(updatedLists);
  }

  const handleDragEnd = (event) => {

    console.log('Drag end was called');
    const { active, over } = event;
  
    setLists((lists) => {
      const updatedLists = [...lists];
  
      const sourceCardId = active.id.idCard;
      const destinationCardId = over.id.idCard;
  
      const sourceListIndex = updatedLists.findIndex((list) =>
        list.cards.some((card) => card.idCard === sourceCardId)
      );
  
      const destinationListIndex = updatedLists.findIndex((list) =>
        list.cards.some((card) => card.idCard === destinationCardId)
      );
  
      if (sourceListIndex !== -1 && destinationListIndex !== -1) {
        const sourceList = updatedLists[sourceListIndex];
        const destinationList = updatedLists[destinationListIndex];
  
        const sourceIndex = sourceList.cards.findIndex(
          (card) => card.idCard === sourceCardId
        );
        const destinationIndex = destinationList.cards.findIndex(
          (card) => card.idCard === destinationCardId
        );
  
        if (sourceIndex !== -1 && destinationIndex !== -1) {
          const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
          destinationList.cards.splice(destinationIndex, 0, movedCard);
        }
      }
  
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
                      card={card}
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