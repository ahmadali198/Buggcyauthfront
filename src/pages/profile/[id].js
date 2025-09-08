// pages/profile/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  FormControl,
  FormLabel,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Cookie from "js-cookie";

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const [user, setUser] = useState(null); // user being viewed
  const [me, setMe] = useState(null); // logged-in user
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = Cookie.get("token");
      if (!token) throw new Error("No token found");

      const [meRes, userRes] = await Promise.all([
        axios.get(`${API_URL}api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setMe(meRes.data.user);
      setUser(userRes.data.user);

      // Only allow edit if viewing own profile
      if (meRes.data.user.id === userRes.data.user.id) {
        setFormData({ ...userRes.data.user });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error fetching profile", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = Cookie.get("token");
      const res = await axios.put(`${API_URL}api/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setMe(res.data.user);
      toast({ title: "Profile updated!", status: "success" });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error updating profile", status: "error" });
    }
  };

  if (loading || !user) {
    return (
      <ProtectedRoute>
        <Layout>
          <Center minH="70vh">
            <Spinner size="xl" />
          </Center>
        </Layout>
      </ProtectedRoute>
    );
  }

  const isOwnProfile = me && me.id === user.id;

  return (
    <ProtectedRoute>
      <Layout>
        <Box p={8} maxW="600px" mx="auto">
          <Card shadow="md" borderRadius="lg" overflow="hidden">
            <CardHeader bg="blue.500" color="white" textAlign="center" py={6}>
              <VStack spacing={3}>
                <Avatar name={user.name} src={user.profilePicture} size="xl" />
                <Heading size="lg">{user.name}</Heading>
                <Text>{user.email}</Text>
              </VStack>
            </CardHeader>
            <CardBody p={6}>
              {isOwnProfile ? (
                editMode ? (
                  <VStack spacing={4}>
                    {Object.keys(formData).map((field) => {
                      // skip id and password fields
                      if (["id", "password"].includes(field)) return null;
                      return (
                        <FormControl key={field}>
                          <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                          <Input
                            value={formData[field] || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, [field]: e.target.value })
                            }
                          />
                        </FormControl>
                      );
                    })}
                    <HStack spacing={4} pt={4}>
                      <Button colorScheme="green" onClick={handleUpdate}>
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    </HStack>
                  </VStack>
                ) : (
                  <HStack spacing={4}>
                    <Button colorScheme="yellow" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                    <Button colorScheme="blue" onClick={() => router.push("/users")}>
                      Back to Users
                    </Button>
                  </HStack>
                )
              ) : (
                <Button colorScheme="blue" onClick={() => router.push("/users")}>
                  Back to Users
                </Button>
              )}
            </CardBody>
          </Card>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
