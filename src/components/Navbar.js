import React from 'react'
import {
    Button,
    Flex,
} from "@chakra-ui/react";

export default function Navbar(props) {
    return (
        <nav>
            
            <Flex justifyContent="flex-end"> 
            <p> 🗒️Your little Trello🗒️</p>
                <Button colorScheme="red" onClick={props.createList} size="xs" mt={2} mr={3} ml={2}>
                    New List
                </Button>
            </Flex>
        </nav>
    )
}
