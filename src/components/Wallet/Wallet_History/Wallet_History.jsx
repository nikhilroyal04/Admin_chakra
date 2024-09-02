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
  useToast,
  Select,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import {
  fetchWalletHistoryData,
  selectWalletHistoryData,
  selectWalletHistoryLoading,
  selectWalletHistoryError,
  AddWalletHistoryData,
  deleteWalletHistoryData,
  updateWalletHistoryData,
} from "../../../app/Slices/WalletHistorySlice";
import {
  fetchUsersData,
  selectUsersData,
} from "../../../app/Slices/UsersSlice";

export default function WalletHistoryList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddWalletHistoryModalOpen, setIsAddWalletHistoryModalOpen] =
    useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedWalletHistoryId, setSelectedWalletHistoryId] = useState(null);
  const [editedWalletHistoryData, setEditedWalletHistoryData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newWalletHistoryData, setNewWalletHistoryData] = useState({
    user_id: "",
    transaction_id: "",
    amount: "",
    previous_amount: "",
    remarks: "",
    created_on: Date.now(),
  });

  const WalletHistoryData = useSelector(selectWalletHistoryData);
  const usersData = useSelector(selectUsersData);
  const isLoading = useSelector(selectWalletHistoryLoading);
  const error = useSelector(selectWalletHistoryError);
  const dispatch = useDispatch();
  const Toast = useToast();

  var currentDate = Date();

  useEffect(() => {
    dispatch(fetchWalletHistoryData());
    dispatch(fetchUsersData());
  }, [dispatch]);

  const handleAddWalletHistory = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("user_id", newWalletHistoryData.user_id);
    formData.append("transaction_id", newWalletHistoryData.transaction_id);
    formData.append("amount", newWalletHistoryData.amount);
    formData.append("previous_amount", newWalletHistoryData.previous_amount);
    formData.append("remarks", newWalletHistoryData.remarks);
    formData.append("created_on", currentDate);
    dispatch(AddWalletHistoryData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "WalletHistory added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewWalletHistoryData({
          user_id: "",
          transaction_id: "",
          amount: "",
          previous_amount: "",
          remarks: "",
          created_on: "",
        });
        setIsAddWalletHistoryModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to adding WalletHistory",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error adding WalletHistory: ", error);
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteWalletHistoryData(selectedWalletHistoryId))
      .then(() => {
        dispatch(fetchWalletHistoryData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedWalletHistoryId(null);
        setIsSaveLoading(false);
        Toast({
          title: "WalletHistory deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete WalletHistory",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting WalletHistory: ", error);
      });
  };

  const handleEditWalletHistory = (WalletHistory) => {
    setSelectedWalletHistoryId(WalletHistory.wallet_id);
    setEditedWalletHistoryData(WalletHistory);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      user_id: editedWalletHistoryData.user_id,
      transaction_id: editedWalletHistoryData.transaction_id,
      amount: editedWalletHistoryData.amount,
      previous_amount: editedWalletHistoryData.previous_amount,
      remarks: editedWalletHistoryData.remarks,
      created_on: editedWalletHistoryData.created_on,
    };

    dispatch(
      updateWalletHistoryData(editedWalletHistoryData.wallet_id, formData)
    )
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedWalletHistoryId(null);
        dispatch(fetchWalletHistoryData());
        setIsSaveLoading(false);
        setNewWalletHistoryData({
          transaction_id: "",
          game_id: "",
          amount: "",
          previous_amount: "",
          remarks: "",
          created_on: "",
        });
        Toast({
          title: "WalletHistory updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating WalletHistory",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating WalletHistory: ", error);
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
          WalletHistory
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddWalletHistoryModalOpen(true)}
          >
            Add WalletHistory
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {WalletHistoryData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No WalletHistory available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>User Id</Th>
                <Th>Transaction Id</Th>
                <Th>Amount</Th>
                <Th>Previous Amount</Th>
                <Th>Remarks</Th>
                <Th>Created On</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {WalletHistoryData.map((WalletHistory, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {WalletHistory.user_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {WalletHistory.transaction_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {WalletHistory.amount}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {WalletHistory.previous_amount}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {WalletHistory.remarks}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {WalletHistory.created_on}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditWalletHistory(WalletHistory)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedWalletHistoryId(WalletHistory.wallet_id);
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

      {/* Add WalletHistory Modal */}
      <Modal
        isOpen={isAddWalletHistoryModalOpen}
        onClose={() => setIsAddWalletHistoryModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddWalletHistory}>
          {" "}
          <ModalContent>
            <ModalHeader>Add WalletHistory</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new WalletHistory */}
              <Select
                mb="3"
                placeholder="Select User"
                value={newWalletHistoryData.user_id}
                onChange={(e) =>
                  setNewWalletHistoryData({
                    ...newWalletHistoryData,
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
                placeholder="Transaction Id"
                value={newWalletHistoryData.transaction_id}
                onChange={(e) =>
                  setNewWalletHistoryData({
                    ...newWalletHistoryData,
                    transaction_id: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Amount"
                value={newWalletHistoryData.amount}
                onChange={(e) =>
                  setNewWalletHistoryData({
                    ...newWalletHistoryData,
                    amount: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Previous Amount"
                value={newWalletHistoryData.previous_amount}
                onChange={(e) =>
                  setNewWalletHistoryData({
                    ...newWalletHistoryData,
                    previous_amount: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Remarks"
                value={newWalletHistoryData.remarks}
                onChange={(e) =>
                  setNewWalletHistoryData({
                    ...newWalletHistoryData,
                    remarks: e.target.value,
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
                onClick={() => setIsAddWalletHistoryModalOpen(false)}
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
            Are you sure you want to delete this WalletHistory ?
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
    <ModalHeader>Edit WalletHistory</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        <Text mb="1" color="gray.600">
          Remarks
        </Text>
        <Input
          mb="3"
          placeholder="Remarks"
          value={editedWalletHistoryData?.remarks || ""}
          onChange={(e) =>
            setEditedWalletHistoryData({
              ...editedWalletHistoryData,
              remarks: e.target.value,
            })
          }
          required
        />
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
