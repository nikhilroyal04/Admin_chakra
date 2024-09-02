import React from "react";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Chart from "react-apexcharts";
import { FaRegCalendarAlt, FaRegClock, FaRegEnvelope } from "react-icons/fa";
import Activity from "./Activity";

export default function Dashboard() {
  // Sample data for the chart
  const chartData = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  };

  return (
    <Box p="1">
      <Box
        display={{ md: "grid" }}
        gridTemplateColumns={{ md: "repeat(3, 1fr)" }}
        gridGap="4"
        
      >
        <Box
          p="4"
          boxShadow="md"
          borderRadius="md"
          bg="white"
          textAlign="center"
          mb={2}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb="2"
          >
            <FaRegCalendarAlt size={28} color="#38B2AC" />
          </Box>
          <Text fontSize="xl" fontWeight="semibold">Upcoming Events</Text>
        </Box>
        <Box
          p="4"
          boxShadow="md"
          borderRadius="md"
          bg="white"
          textAlign="center"
          mb={2}

        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb="2"
          >
            <FaRegClock size={28} color="#ED8936" />
          </Box>
          <Text fontSize="xl" fontWeight="semibold">Time Management</Text>
        </Box>
        <Box
          p="4"
          boxShadow="md"
          borderRadius="md"
          bg="white"
          textAlign="center"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb="2"
          >
            <FaRegEnvelope size={28} color="#4299E1" />
          </Box>
          <Text fontSize="xl" fontWeight="semibold">New Messages</Text>
        </Box>
      </Box>
      <Box
        mt="4"
        display={{ md: "grid" }}
        gridTemplateColumns={{ md: "2fr 1fr" }}
        gridGap="4"
      >
        <Box p="4" boxShadow="md" borderRadius="md" bg="white">
          <Heading as="h2" size="md" mb="4">
            Apex Chart
          </Heading>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={320}
          />
        </Box>
        <Box p="4" boxShadow="md" borderRadius="md" bg="white">
          <Heading as="h2" size="lg" mb="4" ml={15}>
            Todo Lists
          </Heading>
          <Text>
            <Activity />
          </Text>
        </Box>
      </Box>
      <Box mt="4" boxShadow="md" borderRadius="md" bg="white">
        <Heading as="h2" size="md" mb="4">
          Table
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Age</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>John</Td>
              <Td>25</Td>
              <Td>john@example.com</Td>
            </Tr>
            <Tr>
              <Td>Jane</Td>
              <Td>30</Td>
              <Td>jane@example.com</Td>
            </Tr>
            <Tr>
              <Td>Mike</Td>
              <Td>35</Td>
              <Td>mike@example.com</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
