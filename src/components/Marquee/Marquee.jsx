import React, { useEffect, useState } from "react";
import { Box, Card, Text, Input, Spinner, Button } from "@chakra-ui/react";
import {
  fetchMarqueeData,
  updateMarqueeData,
  selectMarqueeData,
  selectMarqueeLoading,
  selectMarqueeError,
} from "../../app/Slices/MarqueeSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Marquee() {
  const dispatch = useDispatch();
  const marqueeData = useSelector(selectMarqueeData);
  const error = useSelector(selectMarqueeError);
  const isLoading = useSelector(selectMarqueeLoading);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchMarqueeData());
  }, [dispatch]);

  useEffect(() => {
    if (marqueeData && marqueeData.length > 0) {
      setTitle(marqueeData[0].title);
    }
  }, [marqueeData]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(updateMarqueeData(title));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating Marquee data:", error);
      // Handle error, e.g., display an error message
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color:"red"
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <Box
      display="flex"
      height={250}
      alignItems="center"
      justifyContent="center"
    >
      <Card height={200} width={400}>
        <Text
          fontSize="xl"
          fontWeight="semibold"
          alignContent="center"
          mt={4}
          mb={4}
          ml={125}
        >
          Game Marquee
        </Text>
        <Input
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          name="title"
          isRequired
          isReadOnly={!editMode}
          mb={5}
          width={240}
          ml={20}
        />
        {editMode ? (
          <Button width={60} ml={20} onClick={handleSaveChanges}>
            Save Changes
          </Button>
        ) : (
          <Button width={60} ml={20} onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </Card>
    </Box>
  );
}
