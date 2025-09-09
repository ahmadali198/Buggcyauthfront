import { useState } from "react";
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Stack, Heading, Text, useToast, Select,
  Avatar, Center, Grid, GridItem
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    profilePicture: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, profilePicture: "Only image files are allowed" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: "File size must be less than 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, [name]: file }));
      setErrors(prev => ({ ...prev, profilePicture: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.age) newErrors.age = "Age is required";
    else if (parseInt(formData.age) < 13) newErrors.age = "You must be at least 13 years old";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fix the errors in the form.", status: "error", duration: 3000 });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("age", formData.age);
      if (formData.gender) formDataToSend.append("gender", formData.gender);
      if (formData.profilePicture) formDataToSend.append("profilePicture", formData.profilePicture);

      // ✅ Upload form including file
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/signup`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast({ title: "Signup successful!", description: "You can now log in.", status: "success", duration: 3000 });
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Signup failed";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      toast({ title: "Error", description: errorMessage, status: "error", duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Box 
        bg="white" 
        p={6} 
        rounded="xl" 
        shadow="lg" 
        w={{ base: "100%", sm: "480px" }}
        maxH="95vh"
        overflow="hidden"
      >
        <Stack spacing={4}>
          <Stack align="center">
            <Heading fontSize="2xl" color="blue.600">Create an Account</Heading>
            <Text fontSize="sm" color="gray.600">Sign up to continue</Text>
          </Stack>

          <form onSubmit={handleSubmit} noValidate>
            <Grid templateColumns="1fr 1fr" gap={3}>
              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={errors.name}>
                  <FormLabel fontSize="sm">Name</FormLabel>
                  <Input 
                    size="sm" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                  />
                  {errors.name && <Text color="red.500" fontSize="xs">{errors.name}</Text>}
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={errors.email}>
                  <FormLabel fontSize="sm">Email</FormLabel>
                  <Input 
                    size="sm"
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="john@example.com" 
                  />
                  {errors.email && <Text color="red.500" fontSize="xs">{errors.email}</Text>}
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={errors.password}>
                  <FormLabel fontSize="sm">Password</FormLabel>
                  <Input 
                    size="sm"
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="********" 
                  />
                  {errors.password && <Text color="red.500" fontSize="xs">{errors.password}</Text>}
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl isRequired isInvalid={errors.age}>
                  <FormLabel fontSize="sm">Age</FormLabel>
                  <Input 
                    size="sm"
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    placeholder="25" 
                  />
                  {errors.age && <Text color="red.500" fontSize="xs">{errors.age}</Text>}
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel fontSize="sm">Gender</FormLabel>
                  <Select 
                    size="sm"
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    placeholder="Select"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isInvalid={errors.profilePicture}>
                  <FormLabel fontSize="sm">Profile Picture (optional)</FormLabel>
                  <Input 
                    size="sm"
                    type="file" 
                    accept="image/*" 
                    name="profilePicture" 
                    onChange={handleChange} 
                    py={1}
                    px={1}
                    fontSize="xs"
                    height="auto"
                  />
                  {errors.profilePicture && <Text color="red.500" fontSize="xs">{errors.profilePicture}</Text>}
                </FormControl>
              </GridItem>

              <GridItem colSpan={2} display="flex" justifyContent="center">
  <Button 
    colorScheme="blue" 
    type="submit" 
    isLoading={loading} 
    loadingText="Signing up" 
    width="50%"
    size="sm"
    mt={2}
  >
    Sign Up
  </Button>
</GridItem>
</Grid>
<Text textAlign="center" fontSize="xs" pt={1}>
  Already have an account?{" "}
  <Button variant="link" colorScheme="blue" size="sm" onClick={() => router.push("/login")} pt={0}>
    Log in
  </Button>
</Text>

</form>


        </Stack>
      </Box>
    </Flex>
  );
}