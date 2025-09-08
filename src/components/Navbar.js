// components/Navbar.js
import { Box, Flex, Button, Heading, Spacer } from "@chakra-ui/react";
import { FiUsers, FiUser, FiLogOut, FiHome } from "react-icons/fi";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const token = Cookie.get("token");

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user");
    router.replace("/login");
  };

  return (
    <Box bg="blue.600" color="white" px={4} py={3} shadow="md">
      <Flex align="center">
        <Heading size="lg" cursor="pointer" onClick={() => router.push("/")}>
          User Management System
        </Heading>

        <Spacer />

        <Flex align="center" gap={4}>
          {!token && (
            <>
              <Button variant="ghost" color="white" onClick={() => router.push("/login")}>
                Login
              </Button>
            </>
          )}

          {token && (
            <>
              <Button leftIcon={<FiHome />} variant="ghost" color="white" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>

              <Button leftIcon={<FiUsers />} variant="ghost" color="white" onClick={() => router.push("/users")}>
                All Users
              </Button>

              <Button leftIcon={<FiUser />} variant="ghost" color="white" onClick={() => router.push("/profile")}>
                My Profile
              </Button>

              <Button leftIcon={<FiLogOut />} variant="outline" color="white" borderColor="white" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
