import { useState } from "react";
import { Box, Input, Button, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true // Allow cookies
      });

      console.log("Login rponse:", res.data)
      setTimeout(() => navigate("/account"), 100);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message); 
      alert("Login failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <Box bg="gray.800" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack bg="gray.700" p={8} borderRadius="md" spacing={4} width="350px">
        <Heading color="white">Login</Heading>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} bg="white"/>
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} bg="white"/>
        <Button colorScheme="green" width="100%" onClick={handleLogin}>Login</Button>
      </VStack>
    </Box>
  );
}
