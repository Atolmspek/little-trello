import React from 'react'
import {
    Button,
    Flex,
} from "@chakra-ui/react";

export default function Navbar(props) {
    return (
        <nav>
            <Flex justifyContent="space-between" alignItems="center">
                <p>🗒️Little Trello🗒️</p>
                <Button colorScheme="red" onClick={props.createList} size="sm" mt={2} mr={3} ml={2}>
                    New List
                </Button>
            </Flex>
        </nav>
    );
}
