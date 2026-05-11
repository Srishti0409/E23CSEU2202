"use client";
import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Stack, 
  CircularProgress, 
  Box, 
  AppBar, 
  Toolbar 
} from '@mui/material';
import axios from 'axios';

// 1. Define the Interface for the Notification object
interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calling your local backend proxy on port 5000
    axios.get('http://localhost:5000/notifications')
      .then(res => {
        setNotifications(res.data.notifications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch failed", err);
        setError("Failed to load notifications. Make sure your backend is running.");
        setLoading(false);
      });
  }, []);

  // 2. Explicitly define return types for MUI Chip colors
  const getCategoryColor = (type: string): "primary" | "secondary" | "success" | "default" => {
    switch (type) {
      case 'Placement': return 'primary';
      case 'Result': return 'secondary';
      case 'Event': return 'success';
      default: return 'default';
    }
  };

  // 3. This is the section from your screenshot - Fixed with 'sx' prop
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh', pb: 4 }}>
      <AppBar position="static" sx={{ mb: 4, bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Bennett University | Campus Updates
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          Recent Notifications
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}

        <Stack spacing={2}>
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <Card key={note.ID} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={note.Type} 
                      color={getCategoryColor(note.Type)} 
                      size="small" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.6 }}>
                    {note.Message}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            !error && <Typography>No new notifications at this time.</Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
}