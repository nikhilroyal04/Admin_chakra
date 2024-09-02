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
  useToast,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchBank_AccountData,
  selectBank_AccountData,
  selectBank_AccountLoading,
  selectBank_AccountError,
  AddBank_AccountData,
  deleteBank_AccountData,
  updateBank_AccountData,
} from "../../../app/Slices/BankSlice";
import {
  fetchUsersData,
  selectUsersData,
} from "../../../app/Slices/UsersSlice";

export default function Bank_Account() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddBank_AccountModalOpen, setIsAddBank_AccountModalOpen] =
    useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState(null);
  const [editedBankAccountData, setEditedBankAccountData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newBank_AccountData, setNewBank_AccountData] = useState({
    bank_name: "",
    bank_ifsc: "",
    bank_number: "",
    bank_holder_name: "",
    bank_status: "",
    user_id: "",
  });

  const Bank_AccountData = useSelector(selectBank_AccountData);
  const isLoading = useSelector(selectBank_AccountLoading);
  const error = useSelector(selectBank_AccountError);
  const dispatch = useDispatch();
  const usersData = useSelector(selectUsersData);
  const Toast = useToast();

  useEffect(() => {
    dispatch(fetchBank_AccountData());
    dispatch(fetchUsersData());
  }, [dispatch]);

  const handleAddBank_Account = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("bank_name", newBank_AccountData.bank_name);
    formData.append("bank_ifsc", newBank_AccountData.bank_ifsc);
    formData.append("bank_number", newBank_AccountData.bank_number);
    formData.append("bank_holder_name", newBank_AccountData.bank_holder_name);
    formData.append("bank_status", newBank_AccountData.bank_status);
    formData.append("user_id", newBank_AccountData.user_id);
    dispatch(AddBank_AccountData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Bank Account updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewBank_AccountData({
          bank_name: "",
          bank_ifsc: "",
          bank_number: "",
          bank_holder_name: "",
          bank_status: "",
          user_id: "",
        });
        setIsAddBank_AccountModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add Bank Account",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteBank_AccountData(selectedBankAccountId))
      .then(() => {
        dispatch(fetchBank_AccountData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedBankAccountId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Bank Account added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Bank Account",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Bank Account: ", error);
      });
  };

  const handleEditBankAccount = (bankAccount) => {
    setSelectedBankAccountId(bankAccount.bank_id);
    setEditedBankAccountData(bankAccount);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      bank_name: editedBankAccountData.bank_name,
      bank_ifsc: editedBankAccountData.bank_ifsc,
      bank_number: editedBankAccountData.bank_number,
      bank_holder_name: editedBankAccountData.bank_holder_name,
      bank_status: editedBankAccountData.bank_status,
      user_id: editedBankAccountData.user_id,
    };

    dispatch(updateBank_AccountData(editedBankAccountData.bank_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedBankAccountId(null);
        dispatch(fetchBank_AccountData());
        setIsSaveLoading(false);
        setNewBank_AccountData({
          bank_name: "",
          bank_ifsc: "",
          bank_number: "",
          bank_holder_name: "",
          bank_status: "",
          user_id: "",
        });
        Toast({
          title: "Bank Account added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Bank Account",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Bank Account: ", error);
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
          Bank_Account List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddBank_AccountModalOpen(true)}
          >
            Add Bank_Account
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {Bank_AccountData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Bank_Account available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>User Id</Th>
                <Th>BankHolder Name</Th>
                <Th>Bank Name</Th>
                <Th>Bank IFSC</Th>
                <Th>Account Number</Th>
                <Th>Status</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Bank_AccountData.map((bankAccount, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {bankAccount.user_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {bankAccount.bank_holder_name}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {bankAccount.bank_name}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {bankAccount.bank_ifsc}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {bankAccount.bank_number}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={
                        bankAccount.bank_status === "active" ? "green" : "red"
                      }
                    >
                      {bankAccount.bank_status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditBankAccount(bankAccount)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedBankAccountId(bankAccount.bank_id);
                          setIsDeleteConfirmationModalOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Add Bank_Account Modal */}
      <Modal
        isOpen={isAddBank_AccountModalOpen}
        onClose={() => setIsAddBank_AccountModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddBank_Account}>
          {" "}
          {/* Wrap modal content inside form */}
          <ModalContent>
            <ModalHeader>Add Bank_Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Bank_Account */}
              <Select
                mb="3"
                placeholder="Select User"
                value={newBank_AccountData.user_id}
                onChange={(e) =>
                  setNewBank_AccountData({
                    ...newBank_AccountData,
                    user_id: e.target.value,
                  })
                }
                isRequired
              >
                {usersData.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name}
                  </option>
                ))}
              </Select>
              <Input
                mb="3"
                placeholder="BankHolder Name"
                value={newBank_AccountData.bank_holder_name}
                onChange={(e) =>
                  setNewBank_AccountData({
                    ...newBank_AccountData,
                    bank_holder_name: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Bank Name"
                value={newBank_AccountData.bank_name}
                onChange={(e) =>
                  setNewBank_AccountData({
                    ...newBank_AccountData,
                    bank_name: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Bank IFSC"
                value={newBank_AccountData.bank_ifsc}
                onChange={(e) =>
                  setNewBank_AccountData({
                    ...newBank_AccountData,
                    bank_ifsc: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Account Number"
                value={newBank_AccountData.bank_number}
                onChange={(e) =>
                  setNewBank_AccountData({
                    ...newBank_AccountData,
                    bank_number: e.target.value,
                  })
                }
                isRequired
              />

              <Select
                mb="3"
                placeholder="Select Status"
                value={newBank_AccountData.bank_status}
                onChange={(e) =>
                  setNewBank_AccountData({
                    ...newBank_AccountData,
                    bank_status: e.target.value,
                  })
                }
                isRequired
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isSaveLoading}
                spinner={<BeatLoader size={8} color="white" />}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddBank_AccountModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>{" "}
        {/* Close form tag */}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this bank account ?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDeleteConfirmation}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit Bank Account</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        <Text mb="1" color="gray.600">
          Bank Name
        </Text>
        <Input
          mb="3"
          placeholder="Bank Name"
          value={editedBankAccountData?.bank_name || ""}
          onChange={(e) =>
            setEditedBankAccountData({
              ...editedBankAccountData,
              bank_name: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          Bank IFSC
        </Text>
        <Input
          mb="3"
          placeholder="Bank IFSC"
          value={editedBankAccountData?.bank_ifsc || ""}
          onChange={(e) =>
            setEditedBankAccountData({
              ...editedBankAccountData,
              bank_ifsc: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          Account Number
        </Text>
        <Input
          mb="3"
          placeholder="Account Number"
          value={editedBankAccountData?.bank_number || ""}
          onChange={(e) =>
            setEditedBankAccountData({
              ...editedBankAccountData,
              bank_number: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          Bank Holder Name
        </Text>
        <Input
          mb="3"
          placeholder="Bank Holder Name"
          value={editedBankAccountData?.bank_holder_name || ""}
          onChange={(e) =>
            setEditedBankAccountData({
              ...editedBankAccountData,
              bank_holder_name: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          Select Status
        </Text>
        <Select
          mb="3"
          placeholder="Select Status"
          value={editedBankAccountData?.bank_status || ""}
          onChange={(e) =>
            setEditedBankAccountData({
              ...editedBankAccountData,
              bank_status: e.target.value,
            })
          }
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </Box>
    </ModalBody>
    <ModalFooter>
      <Button
        colorScheme="teal"
        mr={3}
        onClick={handleSaveChanges}
        isLoading={isSaveLoading}
        spinner={<BeatLoader size={8} color="white" />}
      >
        Save Changes
      </Button>
      <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
        Cancel
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
  );
}
