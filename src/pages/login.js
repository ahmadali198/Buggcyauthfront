import { 
  Flex, 
  Heading, 
  useToast, 
  Box, 
  Text, 
  Spinner,
  VStack,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Divider,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue
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

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, pink.50)",
    "linear(to-br, blue.900, purple.900, pink.900)"
  );

  // Redirect if already logged in
  useEffect(() => {
    const token = Cookie.get("token");
    if (token) router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  }, []);

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
    <Flex minHeight="100vh" align="center" justify="center" bgGradient={bgGradient} p={4}>
      <Container maxW="lg" centerContent>
        <VStack spacing={8} align="center" w="100%">
          <VStack spacing={3} textAlign="center">
            <Heading size="2xl" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text" fontWeight="800">
              Welcome Back
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="400px">
              Sign in to your account to continue
            </Text>
          </VStack>

          <Box background="white" borderRadius="16px" padding="2.5rem" boxShadow="0 20px 60px rgba(0, 0, 0, 0.1)" border="1px solid" borderColor="gray.200" maxWidth="450px" width="100%">
            <VStack spacing={6} as="form" onSubmit={handleEmailLogin} w="100%">
              <Button
                onClick={() => googleLogin()} 
                disabled={googleLoading || isLoading}
                type="button"
                variant="outline"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="12px"
                padding="12px 24px"
                borderRadius="8px"
                border="2px solid"
                borderColor="gray.200"
                cursor="pointer"
                backgroundColor="white"
                color="gray.700"
                fontSize="16px"
                fontWeight="500"
                _hover={{ bg: "gray.50", borderColor: "gray.300" }}
                _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
              >
                {googleLoading ? <Spinner size="sm" /> : <><FcGoogle size={20} /><span>Continue with Google</span></>}
              </Button>

              <HStack w="100%"><Divider /><Text fontSize="sm" color="gray.500" px={3}>OR</Text><Divider /></HStack>

              <VStack spacing={4} w="100%">
                <FormControl isRequired isInvalid={errors.email}>
                  <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #3182ce" }}
                  />
                  {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                </FormControl>

                <FormControl isRequired isInvalid={errors.password}>
                  <FormLabel fontSize="sm" fontWeight="medium">Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      bg="gray.50"
                      border="none"
                      _focus={{ bg: "white", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        aria-label="Toggle password visibility"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="100%"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  bgGradient="linear(to-r, blue.500, blue.600)"
                  _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)" }}
                >
                  Sign In
                </Button>
              </VStack>

              <HStack justifyContent="space-between" w="100%">
                <Text fontSize="sm" color="gray.500">
                  Forgot your password?{" "}
                  <Link color="blue.500" fontWeight="medium">Reset it here</Link>
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Don't have an account?{" "}
                  <Link color="blue.500" fontWeight="medium" onClick={() => router.push("/signup")} cursor="pointer">Sign up</Link>
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
};

export default LoginPage;
