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
  fetchUpiData,
  selectUpiData,
  selectUpiLoading,
  selectUpiError,
  AddUpiData,
  deleteUpiData,
  updateUpiData,
} from "../../../app/Slices/UpiSlice";

export default function UpiList() {
  const [searchValue, setSearchValue] = useState("");
  const [isAddUpiModalOpen, setIsAddUpiModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(null);
  const [editedUpiData, setEditedUpiData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [newUpiData, setNewUpiData] = useState({
    upi_hash: "",
    upi_code: "",
    upi_title: "",
    status: "",
    created_on: Date.now(),
    updated_on: Date.now(),
  });

  const UpiData = useSelector(selectUpiData);
  const isLoading = useSelector(selectUpiLoading);
  const error = useSelector(selectUpiError);
  const dispatch = useDispatch();
  const Toast = useToast();

  var currentDate = new Date();

  useEffect(() => {
    dispatch(fetchUpiData());
  }, [dispatch]);

  const handleAddUpi = (e) => {
    e.preventDefault();
    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("upi_hash", newUpiData.upi_hash);
    formData.append("upi_code", newUpiData.upi_code);
    formData.append("upi_title", newUpiData.upi_title);
    formData.append("status", newUpiData.status);
    formData.append("created_on", newUpiData.created_on);
    formData.append("updated_on", newUpiData.updated_on);
    dispatch(AddUpiData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "UPI updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewUpiData({
          upi_hash: "",
          upi_code: "",
          upi_title: "",
          status: "",
          created_on: "",
          updated_on: "",
        });
        setIsAddUpiModalOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Toast({
          title: "Failed to add UPI",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setIsSaveLoading(true);

    dispatch(deleteUpiData(selectedUpiId))
      .then(() => {
        dispatch(fetchUpiData());
        setIsDeleteConfirmationModalOpen(false);
        setSelectedUpiId(null);
        setIsSaveLoading(false);
        Toast({
          title: "UPI added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete UPI",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting Upi: ", error);
      });
  };

  const handleEditUpi = (Upi) => {
    setSelectedUpiId(Upi.bank_id);
    setEditedUpiData(Upi);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);

    const formData = {
      upi_hash: editedUpiData.upi_hash,
      upi_code: editedUpiData.upi_code,
      upi_title: editedUpiData.upi_title,
      status: editedUpiData.status,
      created_on: currentDate,
      updated_on: currentDate,
    };

    dispatch(updateUpiData(editedUpiData.upi_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedUpiId(null);
        dispatch(fetchUpiData());
        setIsSaveLoading(false);
        setNewUpiData({
          upi_hash: "",
          upi_code: "",
          upi_title: "",
          status: "",
          created_on: "",
          updated_on: "",
        });
        Toast({
          title: "UPI added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating UPI",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating Upi: ", error);
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
          Upi List
        </Text>
        <Flex align="center">
          <Button
            mr={5}
            ml="4"
            colorScheme="teal"
            onClick={() => setIsAddUpiModalOpen(true)}
          >
            Add Upi
          </Button>
        </Flex>
      </Flex>
      <Box bg="gray.100" p="6" borderRadius="lg">
        {UpiData.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            No Upi available
          </Text>
        ) : (
          <Table variant="simple" minWidth="100%">
            <Thead>
              <Tr>
                <Th>Upi Id</Th>
                <Th> Upi Title</Th>
                <Th>Upi Code</Th>
                <Th>Upi hash</Th>
                <Th>Status</Th>
                <Th>Edit/Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {UpiData.map((Upi, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Upi.upi_id}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Upi.upi_title}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Upi.upi_code}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    {Upi.upi_hash}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Badge
                      colorScheme={Upi.status === "active" ? "green" : "red"}
                    >
                      {Upi.status}
                    </Badge>
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.200">
                    <Flex>
                      <Button
                        size="xs"
                        colorScheme="teal"
                        mr="1"
                        onClick={() => handleEditUpi(Upi)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          setSelectedUpiId(Upi.upi_id);
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

      {/* Add Upi Modal */}
      <Modal
        isOpen={isAddUpiModalOpen}
        onClose={() => setIsAddUpiModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddUpi}>
          {" "}
          <ModalContent>
            <ModalHeader>Add Upi</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form input fields for adding a new Upi */}
              <Input
                mb="3"
                placeholder="Upi Title"
                value={newUpiData.upi_title}
                onChange={(e) =>
                  setNewUpiData({
                    ...newUpiData,
                    upi_title: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Upi Code"
                value={newUpiData.upi_code}
                onChange={(e) =>
                  setNewUpiData({
                    ...newUpiData,
                    upi_code: e.target.value,
                  })
                }
                isRequired
              />
              <Input
                mb="3"
                placeholder="Upi Hash"
                value={newUpiData.upi_hash}
                onChange={(e) =>
                  setNewUpiData({
                    ...newUpiData,
                    upi_hash: e.target.value,
                  })
                }
                isRequired
              />

              <Select
                mb="3"
                placeholder="Select Status"
                value={newUpiData.status}
                onChange={(e) =>
                  setNewUpiData({
                    ...newUpiData,
                    status: e.target.value,
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
                onClick={() => setIsAddUpiModalOpen(false)}
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
          <ModalBody>Are you sure you want to delete this UPI ?</ModalBody>
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
    <ModalHeader>Edit UPI</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box>
        <Text mb="1" color="gray.600">
          UPI Title
        </Text>
        <Input
          mb="3"
          placeholder="UPI Title"
          value={editedUpiData?.upi_title || ""}
          onChange={(e) =>
            setEditedUpiData({
              ...editedUpiData,
              upi_title: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          UPI Code
        </Text>
        <Input
          mb="3"
          placeholder="UPI Code"
          value={editedUpiData?.upi_code || ""}
          onChange={(e) =>
            setEditedUpiData({
              ...editedUpiData,
              upi_code: e.target.value,
            })
          }
          required
        />
      </Box>
      <Box>
        <Text mb="1" color="gray.600">
          UPI Hash
        </Text>
        <Input
          mb="3"
          placeholder="UPI Hash"
          value={editedUpiData?.upi_hash || ""}
          onChange={(e) =>
            setEditedUpiData({
              ...editedUpiData,
              upi_hash: e.target.value,
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
          value={editedUpiData?.status || ""}
          onChange={(e) =>
            setEditedUpiData({
              ...editedUpiData,
              status: e.target.value,
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
