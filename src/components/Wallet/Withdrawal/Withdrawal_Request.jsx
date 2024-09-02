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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Badge,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchWithdrawalData,
  selectWithdrawalData,
  selectWithdrawalLoading,
  selectWithdrawalError,
  AddWithdrawalData,
  deleteWithdrawalData,
  updateWithdrawalData,
} from "../../../app/Slices/WithdrawalSlice";
import {
  fetchUsersData,
  selectUsersData,
} from "../../../app/Slices/UsersSlice";
import {
  fetchBank_AccountData,
  selectBank_AccountData,
} from "../../../app/Slices/BankSlice";

export default function WithdrawalList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddWithdrawalModalOpen, setIsAddWithdrawalModalOpen] =
    useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null);
  const [editedWithdrawalData, setEditedWithdrawalData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newWithdrawalData, setNewWithdrawalData] = useState({
    user_id: "",
    bank_id: "",
    amount: "",
    status: "pending",
    created_on: Date(),
  });

  const WithdrawalData = useSelector(selectWithdrawalData);
  const usersData = useSelector(selectUsersData);
  const bankData = useSelector(selectBank_AccountData);
  const isLoading = useSelector(selectWithdrawalLoading);
  const error = useSelector(selectWithdrawalError);
  const dispatch = useDispatch();
  const Toast = useToast();

  var currentDate = Date();

  useEffect(() => {
    dispatch(fetchWithdrawalData());
    dispatch(fetchUsersData());
    dispatch(fetchBank_AccountData());
  }, [dispatch]);

  const handleAddWithdrawal = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("user_id", newWithdrawalData.user_id);
    formData.append("bank_id", newWithdrawalData.bank_id);
    formData.append("amount", newWithdrawalData.amount);
    formData.append("status", newWithdrawalData.status);
    formData.append("created_on", currentDate);
    dispatch(AddWithdrawalData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Withdrawal added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewWithdrawalData({
          user_id: "",
          bank_id: "",
          amount: "",
          status: "",
          created_on: "",
        });
        setIsAddWithdrawalModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to adding Withdrawal",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error adding Withdrawal: ", error);
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteWithdrawalData(selectedWithdrawalId))
      .then(() => {
        dispatch(fetchWithdrawalData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedWithdrawalId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Withdrawal deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Withdrawal",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Withdrawal: ", error);
      });
  };

  const handleEditWithdrawal = (Withdrawal) => {
    setSelectedWithdrawalId(Withdrawal.withdrawal_id);
    setEditedWithdrawalData(Withdrawal);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      user_id: editedWithdrawalData.user_id,
      bank_id: editedWithdrawalData.bank_id,
      amount: editedWithdrawalData.amount,
      status: editedWithdrawalData.status,
      created_on: editedWithdrawalData.created_on,
    };

    dispatch(updateWithdrawalData(editedWithdrawalData.withdrawal_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedWithdrawalId(null);
        dispatch(fetchWithdrawalData());
        setIsSaveLoading(false);
        setNewWithdrawalData({
          bank_id: "",
          game_id: "",
          amount: "",
          status: "",
          created_on: "",
        });
        Toast({
          title: "Withdrawal updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating Withdrawal",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Withdrawal: ", error);
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
          Withdrawal Request
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddWithdrawalModalOpen(true)}
          >
            Add WithdrawalRequest
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {WithdrawalData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Withdrawal available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>User Id</Th>
                <Th>Bank Id</Th>
                <Th>Amount</Th>
                <Th>Created On</Th>
                <Th>Status</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {WithdrawalData.map((Withdrawal, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Withdrawal.user_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Withdrawal.bank_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Withdrawal.amount}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Withdrawal.created_on}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={
                        Withdrawal.status === "completed"
                          ? "green"
                          : Withdrawal.status === "pending"
                          ? "yellow"
                          : Withdrawal.status === "failed"
                          ? "red"
                          : ""
                      }
                    >
                      {Withdrawal.status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditWithdrawal(Withdrawal)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedWithdrawalId(Withdrawal.withdrawal_id);
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

      {/* Add Withdrawal Modal */}
      <Modal
        isOpen={isAddWithdrawalModalOpen}
        onClose={() => setIsAddWithdrawalModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddWithdrawal}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Withdrawal Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Withdrawal */}
              <Select
                mb="3"
                placeholder="Select User"
                value={newWithdrawalData.user_id}
                onChange={(e) =>
                  setNewWithdrawalData({
                    ...newWithdrawalData,
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
              <Select
                mb="3"
                placeholder="Select Bank"
                value={newWithdrawalData.bank_id}
                onChange={(e) =>
                  setNewWithdrawalData({
                    ...newWithdrawalData,
                    bank_id: e.target.value,
                  })
                }
                isRequired
              >
                {bankData
                  .filter((bank) => bank.user_id == newWithdrawalData.user_id)
                  .map((bank) => (
                    <option key={bank.bank_id} value={bank.bank_id}>
                      {bank.bank_number}
                    </option>
                  ))}
              </Select>

              <Input
                mb="3"
                placeholder="Amount"
                value={newWithdrawalData.amount}
                onChange={(e) =>
                  setNewWithdrawalData({
                    ...newWithdrawalData,
                    amount: e.target.value,
                  })
                }
                isRequired
              />
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
                onClick={() => setIsAddWithdrawalModalOpen(false)}
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
            Are you sure you want to delete this Withdrawal Request ?
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
    <ModalHeader>Edit Withdrawal</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        <Text mb="1" color="gray.600">
          Status
        </Text>
        <Select
          mb="3"
          placeholder="Select Status"
          value={editedWithdrawalData?.status || ""}
          onChange={(e) =>
            setEditedWithdrawalData({
              ...editedWithdrawalData,
              status: e.target.value,
            })
          }
          required
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
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
