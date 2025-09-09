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
  Grid,
  GridItem,
  Stack
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatarFile: null
  });

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
        setFormData({
          name: userRes.data.user.name,
          email: userRes.data.user.email,
          avatarFile: null
        });
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

      setUser(res.data.user);
      setMe(res.data.user);
      setEditMode(false);
      toast({ title: "Profile updated!", status: "success" });
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
        <Box p={4} maxW="600px" mx="auto">
          <Heading fontSize="2xl" color="blue.600" mb={6} textAlign="center">
            {isOwnProfile ? "My Profile" : "User Profile"}
          </Heading>
          
          <Card shadow="md" p={4}>
            <CardHeader pb={2}>
              <Heading fontSize="lg">Profile Info</Heading>
            </CardHeader>
            
            <CardBody>
              <Grid templateColumns={{ base: "1fr", md: "auto 1fr" }} gap={4} alignItems="start">
                <GridItem>
                  <Avatar 
                    name={user.name} 
                    src={formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : user.profilePicture} 
                    size="lg" 
                  />
                </GridItem>
                
                <GridItem>
                  {isOwnProfile && editMode ? (
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
                        <FormLabel fontSize="sm">Profile Picture</FormLabel>
                        <Input
                          size="sm"
                          type="file"
                          p={1}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormData({ ...formData, avatarFile: file });
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
                              name: user.name,
                              email: user.email,
                              avatarFile: null,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </Stack>
                  ) : (
                    <Stack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">{user.name}</Text>
                      <Text fontSize="sm" color="gray.600">{user.email}</Text>
                      <HStack spacing={2}>
                      {isOwnProfile && (
                        <Button 
                          size="sm" 
                          colorScheme="blue" 
                          width="30%"
                          onClick={() => setEditMode(true)}
                        >
                          Edit Profile
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        colorScheme="blue"
                        width="30%"
                        variant="outline"
                        onClick={() => router.push("/users")}
                      >
                        Back to Users
                      </Button>
                      </HStack>
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

export default ProfilePage;