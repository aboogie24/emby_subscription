import { useState } from "react";
import { Box, Input, Button, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        username, email
      });
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else if (res.status === 200) {
        NavigationHistoryEntry("/account")
      } else {
        alert("Error: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <Box bg="gray.800" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack bg="gray.700" p={8} borderRadius="md" spacing={4}>
        <Heading color="white">Sign Up for Emby</Heading>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} bg="white"/>
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} bg="white"/>
        <Button colorScheme="green" onClick={handleSignup}>Sign Up & Subscribe</Button>
      </VStack>
    </Box>
  );
}
