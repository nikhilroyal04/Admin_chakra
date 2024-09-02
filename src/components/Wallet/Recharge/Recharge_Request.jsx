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
  fetchRechargeData,
  selectRechargeData,
  selectRechargeLoading,
  selectRechargeError,
  AddRechargeData,
  deleteRechargeData,
  updateRechargeData,
} from "../../../app/Slices/RechargeSlice";
import {
  fetchUsersData,
  selectUsersData,
} from "../../../app/Slices/UsersSlice";
import { fetchUpiData, selectUpiData } from "../../../app/Slices/UpiSlice";

export default function RechargeList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddRechargeModalOpen, setIsAddRechargeModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedRechargeId, setSelectedRechargeId] = useState(null);
  const [editedRechargeData, setEditedRechargeData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newRechargeData, setNewRechargeData] = useState({
    user_id: "",
    upi_id: "",
    amount: "",
    status: "pending",
    remarks: "",
    created_on: Date(),
  });

  const RechargeData = useSelector(selectRechargeData);
  const usersData = useSelector(selectUsersData);
  const upiData = useSelector(selectUpiData);
  const isLoading = useSelector(selectRechargeLoading);
  const error = useSelector(selectRechargeError);
  const dispatch = useDispatch();
  const Toast = useToast();

  var currentDate = Date();

  useEffect(() => {
    dispatch(fetchRechargeData());
    dispatch(fetchUsersData());
  }, [dispatch]);

  const handleAddRecharge = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("user_id", newRechargeData.user_id);
    formData.append("upi_id", newRechargeData.upi_id);
    formData.append("amount", newRechargeData.amount);
    formData.append("status", newRechargeData.status);
    formData.append("remarks", newRechargeData.remarks);
    formData.append("created_on", currentDate);
    dispatch(AddRechargeData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Recharge added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewRechargeData({
          user_id: "",
          upi_id: "",
          amount: "",
          status: "",
          remarks: "",
          created_on: "",
        });
        setIsAddRechargeModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to adding Recharge",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error adding Recharge: ", error);
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteRechargeData(selectedRechargeId))
      .then(() => {
        dispatch(fetchRechargeData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedRechargeId(null);
        setIsSaveLoading(false);
        Toast({
          title: "Recharge deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete Recharge",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Recharge: ", error);
      });
  };

  const handleEditRecharge = (Recharge) => {
    setSelectedRechargeId(Recharge.recharge_id);
    setEditedRechargeData(Recharge);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      user_id: editedRechargeData.user_id,
      upi_id: editedRechargeData.upi_id,
      amount: editedRechargeData.amount,
      status: editedRechargeData.status,
      remarks: editedRechargeData.remarks,
      created_on: editedRechargeData.created_on,
    };

    dispatch(updateRechargeData(editedRechargeData.recharge_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedRechargeId(null);
        dispatch(fetchRechargeData());
        setIsSaveLoading(false);
        setNewRechargeData({
          upi_id: "",
          game_id: "",
          amount: "",
          status: "",
          remarks: "",
          created_on: "",
        });
        Toast({
          title: "Recharge updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating Recharge",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Recharge: ", error);
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
          Recharge Request
        </Text>
        <Flex align="center">
          <Button
          mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddRechargeModalOpen(true)}
          >
            Add Recharge
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {RechargeData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Recharge available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>User Id</Th>
                <Th>Upi Id</Th>
                <Th>Amount</Th>
                <Th>Created On</Th>
                <Th>Remarks</Th>
                <Th>Status</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {RechargeData.map((Recharge, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Recharge.user_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Recharge.upi_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Recharge.amount}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Recharge.created_on}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Recharge.remarks}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={
                        Recharge.status === "completed"
                          ? "green"
                          : Recharge.status === "pending"
                          ? "yellow"
                          : Recharge.status === "failed"
                          ? "red"
                          : ""
                      }
                    >
                      {Recharge.status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditRecharge(Recharge)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedRechargeId(Recharge.recharge_id);
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

      {/* Add Recharge Modal */}
      <Modal
        isOpen={isAddRechargeModalOpen}
        onClose={() => setIsAddRechargeModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddRecharge}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Recharge</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Recharge */}
              <Select
                mb="3"
                placeholder="Select User"
                value={newRechargeData.user_id}
                onChange={(e) =>
                  setNewRechargeData({
                    ...newRechargeData,
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
                placeholder="Select Upi"
                value={newRechargeData.upi_id}
                onChange={(e) =>
                  setNewRechargeData({
                    ...newRechargeData,
                    upi_id: e.target.value,
                  })
                }
                isRequired
              >
                {upiData.map((user) => (
                  <option key={user.upi_id} value={user.upi_id}>
                    {user.upi_code}
                  </option>
                ))}
              </Select>
              <Input
                mb="3"
                placeholder="Amount"
                value={newRechargeData.amount}
                onChange={(e) =>
                  setNewRechargeData({
                    ...newRechargeData,
                    amount: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Remarks"
                value={newRechargeData.remarks}
                onChange={(e) =>
                  setNewRechargeData({
                    ...newRechargeData,
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
                onClick={() => setIsAddRechargeModalOpen(false)}
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
            Are you sure you want to delete this Recharge Request ?
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
    <ModalHeader>Edit Recharge</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        <Text mb="1" color="gray.600">
          Remarks
        </Text>
        <Input
          mb="3"
          placeholder="Remarks"
          value={editedRechargeData?.remarks || ""}
          onChange={(e) =>
            setEditedRechargeData({
              ...editedRechargeData,
              remarks: e.target.value,
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
          value={editedRechargeData?.status || ""}
          onChange={(e) =>
            setEditedRechargeData({
              ...editedRechargeData,
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
