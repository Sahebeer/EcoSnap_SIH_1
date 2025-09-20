import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  AdminPanelSettings,
  TrendingUp,
  People,
  Co2Outlined,
  Verified,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Delete,
  Star,
  EmojiEvents,
  Security,
  Analytics,
} from '@mui/icons-material';

const AdminDashboardPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for demonstration
  const mockStats = [
    { title: 'Total Users', value: '2,847', icon: <People />, color: '#ff6b6b', change: '+12%' },
    { title: 'Actions Pending', value: '156', icon: <Co2Outlined />, color: '#ffa500', change: '+5%' },
    { title: 'Verified Actions', value: '1,234', icon: <Verified />, color: '#4ecdc4', change: '+18%' },
    { title: 'System Health', value: '98.5%', icon: <Security />, color: '#45b7d1', change: '+2%' },
  ];

  const mockRecentActions = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'Planted 5 Trees',
      status: 'pending',
      date: '2024-01-15',
      points: 150,
    },
    {
      id: 2,
      user: 'Michael Chen',
      action: 'Recycled Electronics',
      status: 'verified',
      date: '2024-01-14',
      points: 80,
    },
    {
      id: 3,
      user: 'Emma Rodriguez',
      action: 'Used Public Transport',
      status: 'rejected',
      date: '2024-01-13',
      points: 120,
    },
    {
      id: 4,
      user: 'David Kim',
      action: 'Community Cleanup',
      status: 'pending',
      date: '2024-01-12',
      points: 200,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#4ecdc4';
      case 'pending': return '#ffa500';
      case 'rejected': return '#ff6b6b';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle />;
      case 'pending': return <Warning />;
      case 'rejected': return <Cancel />;
      default: return <Warning />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: `${20 + scrollY * 0.1}%`,
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: `${60 + scrollY * 0.05}%`,
            right: '15%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 165, 0, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          },
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '-1px',
              mb: 2,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Monitor system performance, manage users, and oversee action verification
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {mockStats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: `0 8px 25px ${stat.color}40`,
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: 28, color: 'white' } })}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: '700',
                      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                      color: 'white',
                      fontWeight: '600',
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: '600',
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                mb: 3,
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {[
                { title: 'Verify Actions', icon: <Verified />, color: '#4ecdc4' },
                { title: 'Manage Users', icon: <People />, color: '#ff6b6b' },
                { title: 'System Analytics', icon: <Analytics />, color: '#ffa500' },
                { title: 'Security Settings', icon: <Security />, color: '#45b7d1' },
              ].map((action, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={action.icon}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      py: 2,
                      '&:hover': {
                        borderColor: action.color,
                        color: action.color,
                        background: `${action.color}10`,
                      },
                    }}
                  >
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>

        {/* Recent Actions Table */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '600',
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              mb: 3,
            }}
          >
            Recent Actions Pending Review
          </Typography>
          
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      User
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Action
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Points
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockRecentActions.map((action) => (
                    <TableRow
                      key={action.id}
                      sx={{
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'white', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {action.user}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {action.action}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(action.status)}
                          label={action.status}
                          size="small"
                          sx={{
                            background: `linear-gradient(135deg, ${getStatusColor(action.status)}, ${getStatusColor(action.status)}dd)`,
                            color: 'white',
                            fontWeight: '600',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {action.points}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {action.date}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;