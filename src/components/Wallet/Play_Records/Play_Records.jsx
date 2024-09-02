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
  fetchPlayRecordsData,
  selectPlayRecordsData,
  selectPlayRecordsLoading,
  selectPlayRecordsError,
  AddPlayRecordsData,
  deletePlayRecordsData,
  updatePlayRecordsData,
} from "../../../app/Slices/PlayRecordsSlice";
import {
  fetchUsersData,
  selectUsersData,
} from "../../../app/Slices/UsersSlice";

export default function PlayRecordsList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddPlayRecordsModalOpen, setIsAddPlayRecordsModalOpen] =
    useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedPlayRecordsId, setSelectedPlayRecordsId] = useState(null);
  const [editedPlayRecordsData, setEditedPlayRecordsData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newPlayRecordsData, setNewPlayRecordsData] = useState({
    game_id: "",
    user_id: "",
    amount: "",
    status: "",
    bid_choice: "",
    created_on: Date.now(),
  });

  const PlayRecordsData = useSelector(selectPlayRecordsData);
  const usersData = useSelector(selectUsersData);
  const isLoading = useSelector(selectPlayRecordsLoading);
  const error = useSelector(selectPlayRecordsError);
  const dispatch = useDispatch();
  const Toast = useToast();

  var currentDate = Date();

  useEffect(() => {
    dispatch(fetchPlayRecordsData());
    dispatch(fetchUsersData());
  }, [dispatch]);

  const handleAddPlayRecords = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("game_id", newPlayRecordsData.game_id);
    formData.append("user_id", newPlayRecordsData.user_id);
    formData.append("amount", newPlayRecordsData.amount);
    formData.append("status", newPlayRecordsData.status);
    formData.append("bid_choice", newPlayRecordsData.bid_choice);
    formData.append("created_on", currentDate);
    dispatch(AddPlayRecordsData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Play Record added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewPlayRecordsData({
          game_id: "",
          user_id: "",
          amount: "",
          status: "",
          bid_choice: "",
          created_on: "",
        });
        setIsAddPlayRecordsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to adding PlayRecords",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error adding PlayRecord: ", error);
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deletePlayRecordsData(selectedPlayRecordsId))
      .then(() => {
        dispatch(fetchPlayRecordsData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedPlayRecordsId(null);
        setIsSaveLoading(false);
        Toast({
          title: "PlayRecords deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete PlayRecords",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting PlayRecords: ", error);
      });
  };

  const handleEditPlayRecords = (PlayRecords) => {
    setSelectedPlayRecordsId(PlayRecords.play_record_id);
    setEditedPlayRecordsData(PlayRecords);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      game_id: editedPlayRecordsData.game_id,
      user_id: editedPlayRecordsData.user_id,
      amount: editedPlayRecordsData.amount,
      status: editedPlayRecordsData.status,
      bid_choice: editedPlayRecordsData.bid_choice,
      created_on: editedPlayRecordsData.created_on,
    };

    dispatch(
      updatePlayRecordsData(editedPlayRecordsData.play_record_id, formData)
    )
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedPlayRecordsId(null);
        dispatch(fetchPlayRecordsData());
        setIsSaveLoading(false);
        setNewPlayRecordsData({
          game_id: "",
          user_id: "",
          amount: "",
          status: "",
          bid_choice: "",
          created_on: "",
        });
        Toast({
          title: "PlayRecords updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating PlayRecords",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating PlayRecords: ", error);
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
          PlayRecords List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddPlayRecordsModalOpen(true)}
          >
            Add PlayRecord
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {PlayRecordsData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No PlayRecords available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Game Id</Th>
                <Th>User Id</Th>
                <Th>Amount</Th>
                <Th>Bid Coice</Th>
                <Th>Status</Th>
                <Th>Created On</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {PlayRecordsData.map((PlayRecords, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {PlayRecords.game_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {PlayRecords.user_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {PlayRecords.amount}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {PlayRecords.bid_choice}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={
                        PlayRecords.status === "completed"
                          ? "green"
                          : PlayRecords.status === "pending"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {PlayRecords.status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {PlayRecords.created_on}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditPlayRecords(PlayRecords)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedPlayRecordsId(PlayRecords.play_record_id);
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

      {/* Add PlayRecords Modal */}
      <Modal
        isOpen={isAddPlayRecordsModalOpen}
        onClose={() => setIsAddPlayRecordsModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddPlayRecords}>
          {" "}
          <ModalContent>
            <ModalHeader>Add PlayRecord</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new PlayRecords */}
              <Input
                mb="3"
                placeholder="Game Id"
                value={newPlayRecordsData.game_id}
                onChange={(e) =>
                  setNewPlayRecordsData({
                    ...newPlayRecordsData,
                    game_id: e.target.value,
                  })
                }
                isRequired
              />
              <Select
                mb="3"
                placeholder="Select User"
                value={newPlayRecordsData.user_id}
                onChange={(e) =>
                  setNewPlayRecordsData({
                    ...newPlayRecordsData,
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
                placeholder="Amount"
                value={newPlayRecordsData.amount}
                onChange={(e) =>
                  setNewPlayRecordsData({
                    ...newPlayRecordsData,
                    amount: e.target.value,
                  })
                }
                isRequired
              />
              <Select
                mb="3"
                placeholder="Select Bid Choice"
                value={newPlayRecordsData.bid_choice}
                onChange={(e) =>
                  setNewPlayRecordsData({
                    ...newPlayRecordsData,
                    bid_choice: e.target.value,
                  })
                }
                isRequired
              >
                <option value="choice1">Choice 1</option>
                <option value="choice2">Choice 2</option>
                <option value="choice3">Choice 3</option>
              </Select>

              <Select
                mb="3"
                placeholder="Select Status"
                value={newPlayRecordsData.status}
                onChange={(e) =>
                  setNewPlayRecordsData({
                    ...newPlayRecordsData,
                    status: e.target.value,
                  })
                }
                isRequired
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
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
                onClick={() => setIsAddPlayRecordsModalOpen(false)}
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
            Are you sure you want to delete this PlayRecords ?
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
    <ModalHeader>Edit PlayRecords</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        <Text mb="1" color="gray.600">
          Amount
        </Text>
        <Input
          mb="3"
          placeholder="Amount"
          value={editedPlayRecordsData?.amount || ""}
          onChange={(e) =>
            setEditedPlayRecordsData({
              ...editedPlayRecordsData,
              amount: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          Select Bid Choice
        </Text>
        <Select
          mb="3"
          placeholder="Select Bid Choice"
          value={editedPlayRecordsData?.bid_choice || ""}
          onChange={(e) =>
            setEditedPlayRecordsData({
              ...editedPlayRecordsData,
              bid_choice: e.target.value,
            })
          }
          required
        >
          <option value="choice1">Choice 1</option>
          <option value="choice2">Choice 2</option>
          <option value="choice3">Choice 3</option>
        </Select>
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          Select Status
        </Text>
        <Select
          mb="3"
          placeholder="Select Status"
          value={editedPlayRecordsData?.status || ""}
          onChange={(e) =>
            setEditedPlayRecordsData({
              ...editedPlayRecordsData,
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
