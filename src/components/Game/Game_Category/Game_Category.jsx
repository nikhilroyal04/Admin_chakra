import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
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
  Image,
  useToast,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategoryData,
  selectCategoryData,
  selectCategoryLoading,
  selectCategoryError,
  AddCategoryData,
  deleteCategoryData,
  updateCategoryData,
} from "../../../app/Slices/CategorySlice";

export default function GameCategory() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newCategoryData, setNewCategoryData] = useState({
    category_title: "",
    category_info: "",
    category_type: "",
    category_image: null,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedCategoryData, setEditedCategoryData] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const categoryData = useSelector(selectCategoryData);
  const isLoading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const dispatch = useDispatch();
  const Toast = useToast();

  useEffect(() => {
    dispatch(fetchCategoryData());
  }, [dispatch]);

  const handleAddCategory = (e) => {
    e.preventDefault();

    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("category_title", newCategoryData.category_title);
    formData.append("category_info", newCategoryData.category_info);
    formData.append("category_type", newCategoryData.category_type);
    formData.append("category_image", selectedFile);
    dispatch(AddCategoryData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "Category updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewCategoryData({
          category_title: "",
          category_info: "",
          category_type: "",
          category_image: null,
        });
        setSelectedFile(null);
        setIsAddCategoryModalOpen(false);
        dispatch(fetchCategoryData());
      })
      .catch((error) => {
        setIsSaveLoading(false);
        console.error("Error adding category:", error);
        Toast({
          title: "Failed to add category",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteCategory = () => {
    setIsSaveLoading(true);
    dispatch(deleteCategoryData(categoryToDelete.category_id))
      .then(() => {
        setIsDeleteModalOpen(false);
        setIsSaveLoading(false);
        Toast({
          title: "Category added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        dispatch(fetchCategoryData());
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete category",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting PlayRecords: ", error);
      });
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);
    const formData = new FormData();
    // Append updated category data to FormData
    formData.append("category_title", editedCategoryData.category_title);
    formData.append("category_info", editedCategoryData.category_info);
    formData.append("category_type", editedCategoryData.category_type);

    dispatch(updateCategoryData(editedCategoryData.category_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setIsSaveLoading(false);
        Toast({
          title: "Category added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating category",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating PlayRecords: ", error);
      });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewCategoryData({
        ...newCategoryData,
        category_image: URL.createObjectURL(file),
      });
    } else {
      setSelectedFile(null);
      setNewCategoryData({
        ...newCategoryData,
        category_image: null,
      });
    }
  };

  const handleDeleteConfirmation = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditedCategoryData(category);
    setIsEditModalOpen(true);
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
        <Text fontSize="3xl" fontWeight="bold" ml={5}>
          Category List
        </Text>
        <Button
          colorScheme="teal"
          mr={5}
          onClick={() => setIsAddCategoryModalOpen(true)}
        >
          Add Category
        </Button>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-around">
        {categoryData.map((category, index) => (
          <Box
            key={index}
            w={["100%", "75%", "50%"]}
            maxW="300px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m="2"
            transition="all 0.3s ease-in-out"
            _hover={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Image
              src={category.category_image}
              alt={category.category_title}
              w="100%"
              h="200px"
              objectFit="cover"
              borderRadius="lg"
            />
            <Box p="6">
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                fontSize="xl"
              >
                {category.category_title}
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {category.category_info}
                </Text>
              </Box>
              <Flex mt="4">
                <Button
                  colorScheme="blue"
                  onClick={() => handleEditCategory(category)}
                  pl={3}
                  pr={3}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteConfirmation(category)}
                  ml={3}
                  pl={3}
                  pr={3}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddCategory}>
          <ModalContent>
            <ModalHeader>Add Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                mb="3"
                placeholder="Category Title"
                value={newCategoryData.category_title}
                onChange={(e) =>
                  setNewCategoryData({
                    ...newCategoryData,
                    category_title: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="Category Info"
                value={newCategoryData.category_info}
                onChange={(e) =>
                  setNewCategoryData({
                    ...newCategoryData,
                    category_info: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="Category Type"
                value={newCategoryData.category_type}
                onChange={(e) =>
                  setNewCategoryData({
                    ...newCategoryData,
                    category_type: e.target.value,
                  })
                }
                required
              />
              {newCategoryData.category_image && (
                <Box mb="3">
                  <Image
                    src={newCategoryData.category_image}
                    alt="Category Image Preview"
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                  {selectedFile && (
                    <Text color="gray.600" mt="2" ml="3">
                      {selectedFile.name}
                    </Text>
                  )}
                </Box>
              )}
              <Flex alignItems="center" mb="3">
                <label htmlFor="fileInput">
                  <Button as="span" ml="2" colorScheme="teal">
                    Upload Image
                  </Button>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="teal"
                mr={2}
                isLoading={isSaveLoading}
                spinner={<BeatLoader size={8} color="white" />}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddCategoryModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete "{categoryToDelete?.category_title}
            "?
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="red"
              onClick={handleDeleteCategory}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb="3"
              placeholder="Category Title"
              value={editedCategoryData?.category_title || ""}
              onChange={(e) =>
                setEditedCategoryData({
                  ...editedCategoryData,
                  category_title: e.target.value,
                })
              }
              required
            />
            <Input
              mb="3"
              placeholder="Category Info"
              value={editedCategoryData?.category_info || ""}
              onChange={(e) =>
                setEditedCategoryData({
                  ...editedCategoryData,
                  category_info: e.target.value,
                })
              }
              required
            />
            <Input
              mb="3"
              placeholder="Category Type"
              value={editedCategoryData?.category_type || ""}
              onChange={(e) =>
                setEditedCategoryData({
                  ...editedCategoryData,
                  category_type: e.target.value,
                })
              }
              required
            />
            <Flex alignItems="center" mb="3">
              <label htmlFor="editFileInput">
                <Button as="span" ml="2" colorScheme="teal">
                  Change Image
                </Button>
              </label>
              <input
                id="editFileInput"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditedCategoryData({
                      ...editedCategoryData,
                      category_image: URL.createObjectURL(file),
                    });
                    setSelectedFile(file);
                  }
                }}
              />
            </Flex>
            {editedCategoryData && editedCategoryData.category_image && (
              <Box mb="3">
                <Image
                  src={editedCategoryData.category_image}
                  alt="Category Image Preview"
                  w="100%"
                  h="200px"
                  objectFit="cover"
                />
                {selectedFile && (
                  <Text color="gray.600" mt="2" ml="3">
                    {selectedFile.name}
                  </Text>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isSaveLoading}
              colorScheme="teal"
              mr={2}
              onClick={handleSaveChanges}
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
