// src/components/Footer.js
import { Box, Text, Flex } from "@chakra-ui/react";
import NextLink from "next/link"; // Rename the import

const Footer = () => {
  return (
    <Box as="footer" py={4} bg="gray.100" _dark={{ bg: "gray.900" }}>
      <Flex justify="center" align="center" direction="column">
        <Text fontSize="sm">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </Text>
        <Flex gap={4} mt={2}>
          <NextLink href="/privacy" passHref>
            <Text as="span" fontSize="sm" cursor="pointer" _hover={{ textDecoration: "underline" }}>
              Privacy Policy
            </Text>
          </NextLink>
          <NextLink href="/terms" passHref>
            <Text as="span" fontSize="sm" cursor="pointer" _hover={{ textDecoration: "underline" }}>
              Terms of Service
            </Text>
          </NextLink>
          <NextLink href="/contact" passHref>
            <Text as="span" fontSize="sm" cursor="pointer" _hover={{ textDecoration: "underline" }}>
              Contact
            </Text>
          </NextLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;