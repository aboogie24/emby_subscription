import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import axios from "axios";

export default function Account() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {

    axios.get("http://localhost:8000/account", {
      withCredentials: true 
    })
    .then(res => setAccount(res.data))
    .catch(() => {
      alert("Failed to fetch account");
      navigate("/login");
    }); 
  }, [navigate]);

  if (!account) return <Text color="white">Loading...</Text>;

  return (
    <Box bg="gray.800" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack bg="gray.700" p={8} borderRadius="md" spacing={4} width="350px">
        <Heading color="white">Account Info</Heading>
        <Text color="white"><strong>Username:</strong> {account.username}</Text>
        <Text color="white"><strong>Status:</strong> {account.status}</Text>
        <Text color="white"><strong>Next Renewal:</strong> {account.expiry_date}</Text>
        {account.billing_portal_url && (
          <Button colorScheme="green" width="100%" onClick={() => window.location.href = account.billing_portal_url}>
            Manage Billing
          </Button>
        )}
      </VStack>
    </Box>
  );
}
