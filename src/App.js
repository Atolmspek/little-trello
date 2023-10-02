import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import User from "./components/User";
import AddCard from "./components/AddCard";
import { nanoid } from "nanoid";
import { ChakraProvider, Container, Heading, Box } from "@chakra-ui/react";

function App() {
  const savedTasks = JSON.parse(localStorage.getItem("card")) || [];
  const [card, setCard] = useState(savedTasks);

  function addTask(cards) {
    const newTask = {name: cards.name, id: cards.id  };
    const updatedCards = [...cards, setCard];
    setCard(updatedCards);
    saveTasksToLocalStorage(updatedCards);
  }

  const content = [
    {
      Name:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      id: nanoid(),
    },
    {
      Name:
        "Sed ut perspiciatis undm ad minimllam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      id: nanoid(),
    },
    {
      Name:
        "At vero eos et accusamus et iid rerum f bis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
      id: nanoid(),
    },
  ];

  console.log(savedTasks);

  //localStorage.clear();

  const saveTasksToLocalStorage = localStorage.setItem(
    "card",
    JSON.stringify(content)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setCard((card) => {
      const oldIndex = card.findIndex((original) => original.id === active.id);
      const newIndex = card.findIndex((target) => target.id === over.id);

      return arrayMove(card, oldIndex, newIndex);
    });
  };

  return (
    <ChakraProvider>
      <Container maxW="container.sm" mt={5}>
        <Box padding="4" bg="black" color="blue" maxW="md" float="left" className="container">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Heading as="h1" size="xl" mb={5}>
              Ejemplo de prueba
            </Heading>
            <SortableContext items={card} strategy={verticalListSortingStrategy}>
              {card.map((user) => (
                <User user={user} id={user} key={user.id} />
              ))}
            </SortableContext>
          </DndContext>
          
          <AddCard props={addTask}/>
        </Box>
      </Container>

      
    </ChakraProvider>
  );
}

export default App;
