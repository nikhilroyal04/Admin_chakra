import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  List,
  ListItem,
  Button,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchLinkItems } from "../../app/Slices/menuSlice";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { logout } from "../../utils/Auth";

const SidebarContent = ({ onClose, ...rest }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const pathDirect = pathname;

  const [open, setOpen] = useState(null); // state to track which submenu is open
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768); // state to track if screen is small

  const handleClick = (index, hasSubItems) => {
    if (hasSubItems) {
      setOpen(open === index ? null : index); // toggling submenu open/close
    } else {
      if (isSmallScreen) {
        onClose(); // close the sidebar if the screen is small and item or subitem is clicked
      }
    }
  };

  useEffect(() => {
    dispatch(fetchLinkItems());
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const LinkItems = useSelector((state) => state.menu.LinkItems);

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "72" }} // Adjusted sidebar width
      pos="fixed"
      h="full"
      {...rest}
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4A5568",
          borderRadius: "4px",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "thin",
      }}
      overflow="auto"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text as="a" href="/" fontSize="3xl" fontWeight="semibold">
          Admin Panel
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <br />
      {LinkItems.map((item, index) => (
        <React.Fragment key={index}>
          <List styleType="none">
            <ListItem
              key={index}
              onClick={() => handleClick(index, !!item.subItems)}
              as={NavLink}
              to={item.href}
              selected={pathDirect === item.href}
              sx={{
                mb: 1,
                ...(pathDirect === item.href && {
                  color: "blue.500",
                  backgroundColor: "lightblue",
                  fontWeight: "bold",
                }),
              }}
            >
              <Flex
                justifyContent="space-between"
                alignItems="center"
                pl={10}
                pb={5}
              >
                <HStack spacing="4">
                  <Icon as={item.icon} fontSize="1.7rem" />
                  <Text fontSize="lg" fontWeight="semibold">
                    {item.title}
                  </Text>
                </HStack>
                {item.subItems && (
                  <IconButton
                    onClick={() => handleClick(index, !!item.subItems)}
                    icon={
                      open === index ? <ChevronUpIcon /> : <ChevronDownIcon />
                    }
                    variant="hidden"
                    aria-label={open === index ? "Close" : "Open"}
                    size="sm"
                    pr={10}
                    fontSize={23}
                  />
                )}
              </Flex>
            </ListItem>
          </List>

          {item.subItems && open === index && (
            <List styleType="none" pl={20} pb={2}>
              {item.subItems.map((subItem, subIndex) => (
                <ListItem
                  key={subIndex}
                  onClick={() => handleClick(index, false)}
                  as={NavLink}
                  to={subItem.href}
                  selected={pathDirect === subItem.href}
                  sx={{
                    mb: 1,
                    ...(pathDirect === subItem.href && {
                      color: "blue.500",
                      backgroundColor: "lightblue",
                      fontWeight: "bold",
                    }),
                  }}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    pb={5}
                  >
                    <HStack spacing="3">
                      <Icon as={subItem.icon} fontSize="1.5rem" />
                      <Text fontSize="lg" fontWeight="semibold">
                        {subItem.title}
                      </Text>
                    </HStack>
                  </Flex>
                </ListItem>
              ))}
            </List>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
    logout();
  };
  return (
    <Flex
      ml={{ base: 0, md: "72" }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontWeight="bold"
      >
        Admin Panel
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
    </Box>
  );
};

export default Sidebar;
