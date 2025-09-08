"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Box, Center, Spinner, Stack, Text } from "@chakra-ui/react";

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h="100vh">
        <Text>User not found</Text>
      </Center>
    );
  }

  return (
    <Center h="100vh">
      <Box p={6} borderWidth="1px" borderRadius="lg" textAlign="center">
        <Avatar size="2xl" src={user.profilePicture} mb={4} />
        <Stack spacing={2}>
          <Text fontSize="2xl" fontWeight="bold">{user.name}</Text>
          <Text>{user.email}</Text>
          <Text>Age: {user.age}</Text>
          <Text>Gender: {user.gender}</Text>
        </Stack>
      </Box>
    </Center>
  );
}
