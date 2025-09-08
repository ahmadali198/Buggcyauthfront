import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Avatar,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Flex,
  useToast,
  Spinner,
  Center,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Cookie from "js-cookie";
import axios from "axios";
const MyProfilePage = () => {
  const [me, setMe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatarFile: null
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchMe = async () => {
    try {
      const token = Cookie.get("token");
      const res = await axios.get(`${API_URL}api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMe(res.data.user);
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        avatarFile: null
      });
    } catch (err) {
      toast({ title: "Error loading profile", status: "error" });
    } finally {
      setLoading(false);
    }
  };

 const handleUpdate = async () => {
  try {
    const token = Cookie.get("token");
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    if (formData.avatarFile) {
      fd.append("profilePicture", formData.avatarFile); // 👈 FIX
    }

    const res = await axios.put(`${API_URL}api/users/me`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setMe(res.data.user); // ✅ user will now include avatarUrl
    setEditMode(false);
    toast({ title: "Profile updated!", status: "success" });
  } catch (err) {
    toast({ title: "Error updating profile", status: "error" });
  }
};


  useEffect(() => {
    fetchMe();
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
        <Box p={8} maxW="600px" mx="auto">
          <Heading mb={6}>My Profile</Heading>
          <Card shadow="md">
            <CardHeader>
              <Heading size="md">Profile Info</Heading>
            </CardHeader>
            <CardBody>
              <HStack spacing={6}>
                <Avatar name={me.name} src={me.avatarUrl} size="lg" />
                <VStack align="start" spacing={4} flex="1" w="100%">
                  {editMode ? (
                    <>
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl>
  <FormLabel>Avatar</FormLabel>
  <Input
    type="file"
    onChange={(e) => {
      const file = e.target.files[0];
      setFormData({ ...formData, avatarFile: file });
      if (file) {
        setMe((prev) => ({
          ...prev,
          avatarUrl: URL.createObjectURL(file), // 👈 preview instantly
        }));
      }
    }}
  />
</FormControl>

                      <HStack pt={2}>
                        <Button colorScheme="green" onClick={handleUpdate}>
                          Save
                        </Button>
                        <Button
  onClick={() => {
    setEditMode(false);
    setFormData({
      name: me.name,
      email: me.email,
      avatarFile: null,
    });
  }}
>
  Cancel
</Button>

                      </HStack>
                    </>
                  ) : (
                    <>
                      <Text fontSize="lg" fontWeight="bold">{me.name}</Text>
                      <Text>{me.email}</Text>
                      <Button size="sm" colorScheme="blue" onClick={() => setEditMode(true)}>
                        Edit Profile
                      </Button>
                    </>
                  )}
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default MyProfilePage;
