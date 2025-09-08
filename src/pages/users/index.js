"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Cookie from "js-cookie";
import {
  Avatar,
  Box,
  Button as ChakraButton,
  Center,
  Flex,
  Grid,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUsers = async () => {
    try {
      const token = Cookie.get("token");
      const res = await axios.get(`${API_URL}api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
      toast({ title: "Error fetching users", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Center minH="50vh">
            <Spinner size="xl" />
          </Center>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Box p={6}>
          <Flex justify="space-between" mb={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Users
            </Text>
            <ChakraButton
              onClick={() =>
                setViewMode(viewMode === "table" ? "grid" : "table")
              }
            >
              Switch to {viewMode === "table" ? "Grid" : "Table"} View
            </ChakraButton>
          </Flex>

          {viewMode === "table" ? (
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Profile</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Avatar size="sm" src={user.avatarUrl} />
                    </Td>
                    <Td>
                      <Link href={`/profile/${user.id}`} passHref>
                        <ChakraButton size="sm" colorScheme="blue">
                          View
                        </ChakraButton>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={6}>
              {users.map((user) => (
                <Box
                  key={user.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  textAlign="center"
                >
                  <Center mb={2}>
                    <Avatar size="xl" src={user.avatarUrl} />
                  </Center>
                  <Stack spacing={1}>
                    <Text fontWeight="bold">{user.name}</Text>
                    <Text>{user.email}</Text>
                    <Link href={`/profile/${user.id}`} passHref>
                      <ChakraButton size="sm" colorScheme="blue">
                        View
                      </ChakraButton>
                    </Link>
                  </Stack>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Layout>
    </ProtectedRoute>
  );
}
