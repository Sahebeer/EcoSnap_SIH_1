import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  Verified,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Delete,
  Co2Outlined,
  Person,
  LocationOn,
  CalendarToday,
  Star,
} from '@mui/icons-material';

const AdminActionsPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for demonstration
  const mockActions = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'Planted 5 Trees',
      description: 'Planted native trees in the community park',
      status: 'pending',
      date: '2024-01-15',
      points: 150,
      location: 'Central Park',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    },
    {
      id: 2,
      user: 'Michael Chen',
      action: 'Recycled Electronics',
      description: 'Properly disposed of old electronics at recycling center',
      status: 'verified',
      date: '2024-01-14',
      points: 80,
      location: 'Recycling Center',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    },
    {
      id: 3,
      user: 'Emma Rodriguez',
      action: 'Used Public Transport',
      description: 'Took the bus instead of driving for a week',
      status: 'rejected',
      date: '2024-01-13',
      points: 120,
      location: 'City Transit',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    },
    {
      id: 4,
      user: 'David Kim',
      action: 'Community Cleanup',
      description: 'Organized beach cleanup with 20 volunteers',
      status: 'pending',
      date: '2024-01-12',
      points: 200,
      location: 'Beach Front',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
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
            Action Management
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
            Verify user actions, manage submissions, and moderate content
          </Typography>
        </Box>

        {/* Search and Filter */}
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
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search actions..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b6b',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff6b6b',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    <MenuItem value="all" sx={{ color: 'white' }}>All Status</MenuItem>
                    <MenuItem value="pending" sx={{ color: 'white' }}>Pending</MenuItem>
                    <MenuItem value="verified" sx={{ color: 'white' }}>Verified</MenuItem>
                    <MenuItem value="rejected" sx={{ color: 'white' }}>Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: '#ff6b6b',
                      color: '#ff6b6b',
                    },
                  }}
                >
                  Advanced Filter
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Actions Table */}
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
            User Actions
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
                  {mockActions.map((action) => (
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

export default AdminActionsPage;