// components/Navbar.js
import { 
  Box, 
  Flex, 
  Button, 
  Heading, 
  Spacer, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  useBreakpointValue,
  Show,
  Hide
} from "@chakra-ui/react";
import { FiUsers, FiUser, FiLogOut, FiHome, FiMenu } from "react-icons/fi";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const token = Cookie.get("token");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user");
    router.replace("/login");
  };

  return (
    <Box bg="blue.600" color="white" px={4} py={3} shadow="md">
      <Flex align="center">
        <Heading size={{ base: "md", md: "lg" }} cursor="pointer" onClick={() => router.push("/")}>
          User Management System
        </Heading>

        <Spacer />

        <Flex align="center" gap={{ base: 2, md: 4 }}>
          {!token && (
            <Button 
              size={{ base: "sm", md: "md" }}
              variant="ghost" 
              color="white" 
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}

          {token && (
            <>
              <Show above="md">
                <Button 
                  leftIcon={<FiHome />} 
                  size="md"
                  variant="ghost" 
                  color="white" 
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>

                <Button 
                  leftIcon={<FiUsers />} 
                  size="md"
                  variant="ghost" 
                  color="white" 
                  onClick={() => router.push("/users")}
                >
                  All Users
                </Button>

                <Button 
                  leftIcon={<FiUser />} 
                  size="md"
                  variant="ghost" 
                  color="white" 
                  onClick={() => router.push("/profile")}
                >
                  My Profile
                </Button>

                <Button 
                  leftIcon={<FiLogOut />} 
                  size="md"
                  variant="outline" 
                  color="white" 
                  borderColor="white" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Show>

              <Hide above="md">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Navigation menu"
                    icon={<FiMenu />}
                    variant="outline"
                    color="white"
                    borderColor="white"
                    size="sm"
                  />
                  <MenuList bg="white">
                    <MenuItem 
                      icon={<FiHome />} 
                      onClick={() => router.push("/dashboard")}
                      color="gray.700"
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem 
                      icon={<FiUsers />} 
                      onClick={() => router.push("/users")}
                      color="gray.700"
                    >
                      All Users
                    </MenuItem>
                    <MenuItem 
                      icon={<FiUser />} 
                      onClick={() => router.push("/profile")}
                      color="gray.700"
                    >
                      My Profile
                    </MenuItem>
                    <MenuItem 
                      icon={<FiLogOut />} 
                      onClick={handleLogout}
                      color="gray.700"
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Hide>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;