import React from "react";
import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  useBreakpointValue,
  Center,
  Card,
  IconButton,
} from "@chakra-ui/react";
import { login, isAuthenticated } from "../../utils/Auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import loginImg from "../../assets/login.png";

export default function Login() {
  const showImage = useBreakpointValue({ base: false, md: true });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [cardHeight, setCardHeight] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.replace("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      if (isAuthenticated()) {
        window.location.replace("/dashboard");
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Center minH={"100vh"}>
      <Flex direction="row" align="center">
        <Card
          variant="outlined"
          boxShadow={"xl"}
          mb={showImage ? 8 : 0}
          ref={(card) => {
            if (card && !cardHeight) {
              setCardHeight(card.offsetHeight);
            }
          }}
        >
          <Stack spacing={8} p={8} direction="row">
            <form onSubmit={handleSubmit}>
              <Heading fontSize={"2xl"} textAlign={"center"} mb={10} mt={10}>
                Sign in to your account
              </Heading>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Flex>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  />
                </Flex>
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox mt={2}>Remember me</Checkbox>
                </Stack>
                {error && (
                  <Text color={"red.500"} textAlign={"center"}>
                    {error}
                  </Text>
                )}
                <Button
                  type="submit"
                  colorScheme={"blue"}
                  variant={"solid"}
                  w={"full"}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
            {showImage && (
              <Image
                alt={"Login Image"}
                objectFit={"cover"}
                height={cardHeight}
                src={loginImg}
              />
            )}
          </Stack>
        </Card>
      </Flex>
    </Center>
  );
}
