"use client";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "..." },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.json();
      const assistantMessage = jsonResponse.content;

      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: assistantMessage },
        ];
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(67,67,67,0.8))", // Stronger black gradient
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          width: "100%",
          zIndex: 2,
        }}
      >
        <Typography
          align="center"
          variant="h2"
          color="white"
          sx={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)" }}
        >
          AI Customer Support
        </Typography>
      </Box>

      {/* Foreground Content */}
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Stack
          direction={"column"}
          width="500px"
          height="700px"
          border="1px solid rgba(255, 255, 255, 0.5)"
          p={2}
          spacing={3}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.9)", // Slightly more opaque to contrast the background
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.7)", // Stronger shadow for more depth
            marginTop: 10,
          }}
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages?.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                sx={{ transition: "opacity 0.3s ease-in-out", opacity: 1 }}
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  color="white"
                  borderRadius={16}
                  p={2.5}
                  maxWidth="80%"
                  sx={{
                    wordWrap: "break-word",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                  }}
                >
                  <Typography lineHeight={1.5} variant="body1">
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Message"
              padding="10px"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{ bgcolor: "background.paper" }}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
