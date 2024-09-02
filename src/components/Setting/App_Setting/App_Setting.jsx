import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppData,
  updateAppData,
  selectAppData,
  selectAppLoading,
  selectAppError,
} from "../../../app/Slices/AppSlice";
import { Box, Input, Button, Spinner, Text, Flex } from "@chakra-ui/react";

export default function AppSettingCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    about_us: "",
    contact_us: "",
    floating_link: "",
    terms_and_conditions: "pending",
    agreement_text: "",
    updated_on: Date(),
  });

  const appSettings = useSelector(selectAppData);
  const isLoading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAppData());
  }, [dispatch]);

  useEffect(() => {
    if (appSettings && appSettings.length > 0) {
      setFormData(appSettings[0]); // Access the first element of the array
    }
  }, [appSettings]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    const { setting_id, ...updatedData } = formData;
    dispatch(updateAppData(updatedData));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <Box borderWidth="1px" borderRadius="lg" p="4" m="4">
      <Text fontSize="2xl" fontWeight="bold" mb="3">
        App Setting
      </Text>
      <Box>
        {/* Input fields */}
        <Box mb="3">
          <Text mb="1" fontWeight="bold">
            About us
          </Text>
          <Input
            placeholder="About us text"
            value={formData.about_us}
            onChange={handleChange}
            name="about_us"
            isRequired
            disabled={!isEditing}
          />
        </Box>
        <Box mb="3">
          <Text mb="1" fontWeight="bold">
            Contact us
          </Text>
          <Input
            placeholder="Contact us text"
            value={formData.contact_us || ""}
            onChange={handleChange}
            name="contact_us"
            isRequired
            disabled={!isEditing}
          />
        </Box>
        <Box mb="3">
          <Text mb="1" fontWeight="bold">
            Floating link
          </Text>
          <Input
            placeholder="Floating link text"
            value={formData.floating_link || ""}
            onChange={handleChange}
            name="floating_link"
            isRequired
            disabled={!isEditing}
          />
        </Box>
        <Box mb="3">
          <Text mb="1" fontWeight="bold">
            Terms and conditions
          </Text>
          <Input
            placeholder="Terms and conditions text"
            value={formData.terms_and_conditions || ""}
            onChange={handleChange}
            name="terms_and_conditions"
            isRequired
            disabled={!isEditing}
          />
        </Box>
        <Box mb="3">
          <Text mb="1" fontWeight="bold">
            Agreement
          </Text>
          <Input
            placeholder="Agreement text"
            value={formData.agreement_text || ""}
            onChange={handleChange}
            name="agreement_text"
            isRequired
            disabled={!isEditing}
          />
        </Box>
        <Box mb="3">
          <Text mb="1" fontWeight="bold">
            Updated On
          </Text>
          <Input
            placeholder="Updated On"
            value={formData.updated_on}
            onChange={handleChange}
            name="updated_on"
            isRequired
            disabled={!isEditing}
          />
        </Box>
      </Box>
      <Button onClick={isEditing ? handleSaveChanges : handleEdit}>
        {isEditing ? "Save Changes" : "Edit"}
      </Button>
    </Box>
  );
}
