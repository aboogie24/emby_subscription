import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Flex, Link, Heading, Button } from "@chakra-ui/react";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/debug-token", { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const checkDebugToken = async () => {
    try {
      const res = await axios.get("http://localhost:8000/debug-token", {
        withCredentials: true
      });
      alert(`Decoded user: ${res.data.decoded_username || "No token"}`);
      console.log("Debug Token Response:", res.data);
    } catch (err) {
      alert("Debug failed");
      console.error("Debug Token Error:", err.response?.data || err.message);
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:8000/logout", {}, { withCredentials: true });
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Box bg="gray.900" px={4} py={3}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Heading size="md" color="green.400">Emby Portal</Heading>
        <Flex alignItems={"center"}>
          {!isLoggedIn ? (
            <>
              <Link as={RouterLink} to="/" color="white" px={3}>Signup</Link>
              <Link as={RouterLink} to="/login" color="white" px={3}>Login</Link>
            </>
          ) : (
            <>
              <Link as={RouterLink} to="/account" color="white" px={3}>Account</Link>
              <Button onClick={handleLogout} size="sm" colorScheme="red" ml={2}>
                Logout
              </Button>
              <Button onClick={checkDebugToken} size="sm" colorScheme="yellow" ml={2}>
                Debug Token
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
