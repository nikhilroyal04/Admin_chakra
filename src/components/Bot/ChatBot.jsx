import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Box, Heading, Flex } from "@chakra-ui/react";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = { text: inputMessage, sender: "user" };
    setMessages([...messages, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages([
        ...messages,
        newMessage,
        { text: botResponse, sender: "bot" },
      ]);
    }, 700);
  };

  const getBotResponse = (message) => {
    return "Services are currently not available, try again later.";
  };

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  const closeChatBot = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <Box
          position="fixed"
          bottom="4"
          right="4"
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
          p="4"
          zIndex="999"
          width="300px"
          height="400px"
          display="flex"
          flexDirection="column"
        >
          <Heading as="h2" size="md" mb="4">
            Chat Bot
          </Heading>
          <Box flex="1" overflowY="auto" mb="4" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <Box
                key={index}
                p="2"
                borderRadius="md"
                bg={message.sender === "user" ? "blue.100" : "green.100"}
                textAlign={message.sender === "user" ? "left" : "left"}
                my="2"
                mx={message.sender === "user" ? "0" : "2"}
                display="flex"
                flexDirection="column"
                maxWidth="fit-content"
                minWidth="5rem"
                wordWrap="break-word"
                position="relative"
              >
                <Box mb={4}>{message.text}</Box>
                <Box
                  fontSize="xs"
                  color="gray.500"
                  position="absolute" 
                  bottom="1"
                  right="3"
                >
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Box>
              </Box>
            ))}
          </Box>

          <Flex>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              flex="1"
              mr="2"
            />
            <Button onClick={sendMessage}>Send</Button>
          </Flex>
          <Button
            mt="4"
            alignSelf="flex-end"
            onClick={closeChatBot}
            variant="ghost"
            colorScheme="gray"
          >
            Close
          </Button>
        </Box>
      )}
      <Button
        position="fixed"
        bottom="8"
        right="5"
        borderRadius="full"
        colorScheme="teal"
        boxShadow="lg"
        onClick={toggleChatBot}
      >
        {isOpen ? "Close" : "Help"}
      </Button>
    </div>
  );
};

export default ChatBot;
