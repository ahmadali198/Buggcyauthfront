// pages/dashboard.js
import { useState, useEffect } from "react";
import { 
  Box, Heading, Text, Card, CardHeader, CardBody, 
  SimpleGrid, Stack, Button, useToast, Spinner, Center
} from "@chakra-ui/react";
import { 
  FiUsers, FiUserPlus, FiCalendar, FiTrendingUp 
} from "react-icons/fi";
import axios from "axios";
import ProtectedRoute from "../components/ProtectedRoute"; 
import Layout from "../components/Layout";

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [overviewRes, recentRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/users/analytics/overview`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/users/analytics/recent`, { headers })
      ]);

      setOverview(overviewRes.data);
      setRecentUsers(recentRes.data);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError("Failed to fetch dashboard data");
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        if (typeof window !== 'undefined') {
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/login';
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') fetchDashboardData();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Center minH="100vh">
            <Spinner size="xl" />
          </Center>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <Center minH="100vh">
            <Box textAlign="center">
              <Text color="red.500" mb={4}>{error}</Text>
              <Button onClick={fetchDashboardData}>Retry</Button>
            </Box>
          </Center>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Box p={8}>
          <Heading mb={8}>Analytics Dashboard</Heading>

          <SimpleGrid columns={[1, 2, 4]} spacing={6} mb={8}>
            {[ 
              { title: "Total Users", icon: FiUsers, value: overview?.totalUsers, desc: "All registered users" },
              { title: "New Users (30d)", icon: FiUserPlus, value: overview?.newUsers, desc: "Last 30 days" },
              { title: "Weekly Users", icon: FiCalendar, value: overview?.weeklyUsers, desc: "Last 7 days" },
              { title: "Today's Users", icon: FiTrendingUp, value: overview?.todayUsers, desc: "Registered today" },
            ].map((card, index) => (
              <Card key={index} shadow="md" _hover={{ shadow: "lg", transform: "scale(1.02)" }} transition="all 0.2s">
                <CardHeader>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Text fontWeight="bold">{card.title}</Text>
                    <card.icon size={20} />
                  </Box>
                </CardHeader>
                <CardBody>
                  <Text fontSize="2xl" fontWeight="bold">{card.value || 0}</Text>
                  <Text fontSize="sm" color="gray.600">{card.desc}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Card>
            <CardHeader>
              <Heading size="md">Recent Registrations</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <Box key={user.id} p={4} bg="gray.50" borderRadius="md" _hover={{ bg: "gray.100" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Text fontWeight="bold">{user.name}</Text>
                          <Text fontSize="sm" color="gray.600">{user.email}</Text>
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="sm">{formatDate(user.createdAt)}</Text>
                          <Text fontSize="sm" textTransform="capitalize">{user.provider}</Text>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Text textAlign="center" color="gray.500">No recent users found</Text>
                )}
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
