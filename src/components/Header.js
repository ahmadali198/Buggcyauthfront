// components/Header.js
import { 
  Flex, 
  Heading, 
  Spacer, 
  Button, 
  useColorMode, 
  useColorModeValue,
  ButtonGroup
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Link from "next/link"; // Use Next.js Link
import { useRouter } from "next/router"; // Use Next.js router
import Cookie from "js-cookie";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter(); // Next.js router
  const bg = useColorModeValue("white", "gray.800");
  const token = Cookie.get("token");
  
  const handleLogout = () => {
    Cookie.remove("token");
    router.push("/login"); // Use Next.js router
  };
  
  return (
    <Flex 
      as="header" 
      align="center" 
      justify="space-between" 
      p={4} 
      bg={bg}
      boxShadow="md"
    >
      <Link href="/" passHref>
        <Heading as="h1" size="lg" cursor="pointer">
          MyApp
        </Heading>
      </Link>
      
      <Spacer />
      
      <Flex align="center" gap={4}>
        <ButtonGroup>
          {token ? (
            <>
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/settings")}>
                Settings
              </Button>
              <Button onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </ButtonGroup>
        
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;