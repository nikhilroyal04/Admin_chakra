import React from 'react';
import {
  Box,
  Card,
  Checkbox,
  Text,
  Flex,
} from '@chakra-ui/react';

const todos = [
  {
    id: 1,
    text: "Meeting with John",
    completed: false
  },
  {
    id: 2,
    text: "Payment received from John Doe of $385.90",
    completed: true
  },
  {
    id: 3,
    text: "Project Meeting",
    completed: false
  },
  {
    id: 4,
    text: "New Sale recorded #ML-3467",
    completed: false
  },
  {
    id: 5,
    text: "Payment was made of $64.95 to Michael Anderson",
    completed: true
  },
  {
    id: 6,
    text: "Payment was made of $664.95 to Rohan Anderson",
    completed: false
  },
];

const Activity = () => {

  const handleToggle = (id) => {
    // For demo purpose, just console logging
    console.log("Toggle todo with id:", id);
  };

  return (
    <Card variant="outline" mb="4">
      <Flex flexDirection="column" p="4">
        <Flex alignItems="flex-start" mb="4">
          <Box>
            <Text color="gray.500" fontSize="sm">Keep track of your tasks</Text>
          </Box>
        </Flex>
        {todos.map((todo) => (
          <Flex key={todo.id} alignItems="center" mb="2">
            <Checkbox
              isChecked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              mr="2"
            />
            <Text fontSize="md" color={todo.completed ? "gray.500" : "gray.800"} textDecoration={todo.completed ? "line-through" : "none"}>
              {todo.text}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
};

export default Activity;
