// // components/ProtectedRoute.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import Cookie from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookie.get("token");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return children;
};

export default ProtectedRoute;
