import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsersData,
  selectUsersData,
  selectUsersLoading,
  selectUsersError,
  AddUserData,
} from "../../app/Slices/UsersSlice";

export default function UserList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    wallet_amount: "",
    status: "",
    password: "abc#123",
    created_on: Date.now(),
    updated_on: Date.now(),
    parent_id: null,
  });

  const usersData = useSelector(selectUsersData);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsersData());
  }, [dispatch]);

  const filteredUsers = usersData.filter(
    (user) =>
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Dispatch the action to add new user data
    dispatch(AddUserData(newUserData))
      .then(() => {
        setNewUserData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          wallet_amount: "",
          status: "",
          password: "",
          created_on: "",
          updated_on: "",
          parent_id: "",
        });
        setIsAddUserModalOpen(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color="red">Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Box p="1" overflowX="auto">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="2xl" fontWeight="bold" ml={5}>
          User List
        </Text>
        <Flex align="center">
          <Input
            placeholder="Search by Email, Phone, or First Name"
            w="300px"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
          mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add User
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {filteredUsers.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No users available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Wallet Amount</Th>
                <Th>Status</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.first_name}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.last_name}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.email}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.phone_number}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {user.wallet_amount}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={user.status === "active" ? "green" : "red"}
                    >
                      {user.status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() =>
                          console.log("Edit user with ID:", user.user_id)
                        }
                      >
                        Edit
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddUser}>
          {" "}
          {/* Wrap modal content inside form */}
          <ModalContent>
            <ModalHeader>Add User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new user */}
              <Input
                mb="3"
                placeholder="First Name"
                value={newUserData.first_name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, first_name: e.target.value })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Last Name"
                value={newUserData.last_name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, last_name: e.target.value })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Phone Number"
                value={newUserData.phone_number}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    phone_number: e.target.value,
                  })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Enter Password"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    password: e.target.value,
                  })
                }
                isRequired 
              />
              <Input
                mb="3"
                placeholder="Wallet Amount"
                value={newUserData.wallet_amount}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    wallet_amount: e.target.value,
                  })
                }
                isRequired 
              />
              <Select
                mb="3"
                placeholder="Select Status"
                value={newUserData.status}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, status: e.target.value })
                }
                isRequired 
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="teal">
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>{" "}
        {/* Close form tag */}
      </Modal>
    </Box>
  );
}
