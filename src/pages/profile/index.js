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
  FormLabel,
  Grid,
  GridItem,
  Stack
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
        fd.append("profilePicture", formData.avatarFile);
      }

      const res = await axios.put(`${API_URL}api/users/me`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMe(res.data.user);
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
        <Box p={4} maxW="500px" mx="auto">
          <Heading fontSize="2xl" color="blue.600" mb={6} textAlign="center">My Profile</Heading>
          
          <Card shadow="md" p={2}>
            <CardHeader pb={2}>
              <Heading fontSize="lg">Profile Info</Heading>
            </CardHeader>
            
            <CardBody>
              <Grid templateColumns={{ base: "1fr", md: "auto 1fr" }} gap={4} alignItems="start">
                <GridItem>
                  <Avatar name={me.name} src={me.avatarUrl} size="lg" />
                </GridItem>
                
                <GridItem>
                  {editMode ? (
                    <Stack spacing={3}>
                      <FormControl>
                        <FormLabel fontSize="sm">Name</FormLabel>
                        <Input
                          size="sm"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Email</FormLabel>
                        <Input
                          size="sm"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Avatar</FormLabel>
                        <Input
                          size="sm"
                          type="file"
                          p={0}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormData({ ...formData, avatarFile: file });
                            if (file) {
                              setMe((prev) => ({
                                ...prev,
                                avatarUrl: URL.createObjectURL(file),
                              }));
                            }
                          }}
                        />
                      </FormControl>

                      <HStack spacing={2} pt={2}>
                        <Button colorScheme="blue" size="sm" onClick={handleUpdate}>
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
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
                    </Stack>
                  ) : (
                    <Stack spacing={3}>
                      <Text fontSize="md" fontWeight="bold">{me.name}</Text>
                      <Text fontSize="sm" color="gray.600">{me.email}</Text>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        width="40%"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile
                      </Button>
                    </Stack>
                  )}
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default MyProfilePage;