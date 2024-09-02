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
  fetchReferData,
  selectReferData,
  selectReferLoading,
  selectReferError,
  AddReferData,
  deleteReferData,
  updateReferData,
} from "../../app/Slices/ReferSlice";
import { fetchUsersData, selectUsersData } from "../../app/Slices/UsersSlice";

export default function Refer() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddReferModalOpen, setIsAddReferModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedReferId, setSelectedReferId] = useState(null);
  const [editedReferData, setEditedReferData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newReferData, setNewReferData] = useState({
    user_id: "",
    my_id: "",
    status: "",
    created_on: Date(),
  });

  const ReferData = useSelector(selectReferData);
  const usersData = useSelector(selectUsersData);
  const isLoading = useSelector(selectReferLoading);
  const error = useSelector(selectReferError);
  const dispatch = useDispatch();
  const Toast = useToast();

  var currentDate = Date();

  useEffect(() => {
    dispatch(fetchReferData());
    dispatch(fetchUsersData());
  }, [dispatch]);

  const handleAddRefer = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("user_id", newReferData.user_id);
    formData.append("my_id", newReferData.my_id);
    formData.append("status", newReferData.status);
    formData.append("created_on", currentDate);
    dispatch(AddReferData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Play Record added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewReferData({
          user_id: "",
          my_id: "",
          status: "",
          created_on: "",
        });
        setIsAddReferModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to adding Refer",
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

    dispatch(deleteReferData(selectedReferId))
      .then(() => {
        dispatch(fetchReferData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedReferId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Refer deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Refer",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Refer: ", error);
      });
  };

  const handleEditRefer = (Refer) => {
    setSelectedReferId(Refer.team_id);
    setEditedReferData(Refer);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      user_id: editedReferData.user_id,
      my_id: editedReferData.my_id,
      status: editedReferData.status,
      created_on: editedReferData.created_on,
    };

    dispatch(updateReferData(editedReferData.team_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedReferId(null);
        dispatch(fetchReferData());
        setIsSaveLoading(false);
        setNewReferData({
          user_id: "",
          my_id: "",
          status: "",
          created_on: "",
        });
        Toast({
          title: "Refer updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating Refer",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Refer: ", error);
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
          Refer List
        </Text>
        <Flex align="center">
          <Button
            ml="4"
            mr={5}
            colorScheme="teal"
            onClick={() => setIsAddReferModalOpen(true)}
          >
            Add Refer
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {ReferData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Refer available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>My Id</Th>
                <Th>User Id</Th>
                <Th>Status</Th>
                <Th>Created On</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ReferData.map((Refer, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Refer.my_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Refer.user_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={
                        Refer.status === "completed"
                          ? "green"
                          : Refer.status === "pending"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {Refer.status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Refer.created_on}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditRefer(Refer)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedReferId(Refer.team_id);
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

      {/* Add Refer Modal */}
      <Modal
        isOpen={isAddReferModalOpen}
        onClose={() => setIsAddReferModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddRefer}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Refer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Refer */}
              <Input
                mb="3"
                placeholder="My Id"
                value={newReferData.my_id}
                onChange={(e) =>
                  setNewReferData({
                    ...newReferData,
                    my_id: e.target.value,
                  })
                }
                isRequired
              />
              <Select
                mb="3"
                placeholder="Select User"
                value={newReferData.user_id}
                onChange={(e) =>
                  setNewReferData({
                    ...newReferData,
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
                placeholder="Select Status"
                value={newReferData.status}
                onChange={(e) =>
                  setNewReferData({
                    ...newReferData,
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
                onClick={() => setIsAddReferModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this Refer ?</ModalBody>
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
          <ModalHeader>Edit Refer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="1" color="gray.600">
              Status
            </Text>
            <Select
              mb="3"
              placeholder="Select Status"
              value={editedReferData?.status || ""}
              onChange={(e) =>
                setEditedReferData({
                  ...editedReferData,
                  status: e.target.value,
                })
              }
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </Select>
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
