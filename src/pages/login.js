import { 
  Flex, 
  Heading, 
  useToast, 
  Box, 
  Text, 
  Spinner,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Cookie from "js-cookie";

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    const token = Cookie.get("token");
    if (token) router.push("/dashboard");
  }, [router]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!loginForm.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) newErrors.email = "Email is invalid";
    if (!loginForm.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Google OAuth login
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setGoogleLoading(true);
      try {
        const { access_token } = response;
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/google`,
          { access_token }
        );

        const { user, token } = res.data;
        Cookie.set("token", token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
        Cookie.set("user", JSON.stringify(user), { expires: 7, secure: process.env.NODE_ENV === 'production' });

        toast({ title: "Login Successful!", description: `Welcome, ${user?.name}!`, status: "success", duration: 3000, isClosable: true });
        router.push("/dashboard");
      } catch (error) {
        const message = error.response?.data?.error || "Google login failed";
        toast({ title: "Authentication Error", description: message, status: "error", duration: 5000, isClosable: true });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast({ title: "Google Authentication Failed", description: "Please try again", status: "error", duration: 5000, isClosable: true });
    }
  });

  // Email login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/login`,
        loginForm
      );

      const { user, token } = res.data;
      Cookie.set("token", token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      Cookie.set("user", JSON.stringify(user), { expires: 7, secure: process.env.NODE_ENV === 'production' });

      toast({ title: "Login Successful!", description: `Welcome back, ${user?.name}!`, status: "success", duration: 3000, isClosable: true });
      router.push("/dashboard");
    } catch (error) {
      let message = "Invalid credentials. Please try again.";

      if (error.response) {
        if (error.response.status === 401) message = "Incorrect email or password.";
        else message = error.response.data?.error || error.response.data?.message || message;
      } else if (error.request) {
        message = "No response from server. Please check your connection.";
      } else {
        message = error.message;
      }

      toast({ title: "Login Failed", description: message, status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="50vh" align="center" justify="center" px={4} paddingTop={10}>
      <Box 
        p={6} 
        rounded="md" 
        shadow="md" 
        w="full" 
        maxW="400px"
        borderWidth="1px"
      >
        <VStack spacing={4}>
          <Heading fontSize="xl" textAlign="center">Welcome Back</Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center">Sign in to your account</Text>

          <Button
            onClick={() => googleLogin()} 
            disabled={googleLoading || isLoading}
            variant="outline"
            width="70%"
            display="flex"
            alignItems="center"
            gap="8px"
            size="sm"
          >
            {googleLoading ? <Spinner size="sm" /> : <><FcGoogle size={16} />Continue with Google</>}
          </Button>

          <HStack w="full"><Divider /><Text fontSize="xs" color="gray.500">OR</Text><Divider /></HStack>

          <VStack as="form" onSubmit={handleEmailLogin} w="full" spacing={3}>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel fontSize="sm" mb={1}>Email</FormLabel>
              <Input
                size="sm"
                type="email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
              {errors.email && <Text color="red.500" fontSize="xs" mt={1}>{errors.email}</Text>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel fontSize="sm" mb={1}>Password</FormLabel>
              <InputGroup size="sm">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <InputRightElement width="2.5rem">
                  <IconButton
                    h="1.5rem"
                    size="xs"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    aria-label="Toggle password visibility"
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && <Text color="red.500" fontSize="xs" mt={1}>{errors.password}</Text>}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Signing in"
              width="50%"
              size="sm"
              mt={2}
            >
              Sign In
            </Button>
          </VStack>

          <Text textAlign="center" fontSize="sm">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              colorScheme="blue" 
              size="sm" 
              onClick={() => router.push("/signup")}
            >
              Sign up
            </Button>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;