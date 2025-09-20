import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  Star,
  Timeline,
  Co2Outlined,
  WaterDrop,
  Bolt,
  Recycling,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrollY, setScrollY] = useState(0);
  const [showStats, setShowStats] = useState(true);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for demonstration
  const stats = {
    totalPoints: user?.totalPoints || 2450,
    level: user?.level || 'Eco-Warrior',
    actionsThisMonth: 12,
    co2Saved: 45.2,
    waterSaved: 120.5,
    energySaved: 89.3,
    wasteReduced: 23.1,
  };

  const recentActions = [
    {
      id: 1,
      type: 'Recycling',
      title: 'Recycled Plastic Bottles',
      points: 50,
      date: '2 hours ago',
      impact: { co2: 2.1, water: 5.2, energy: 1.8 },
    },
    {
      id: 2,
      type: 'Energy Saving',
      title: 'Used LED Bulbs',
      points: 75,
      date: '1 day ago',
      impact: { co2: 3.2, water: 0, energy: 4.5 },
    },
    {
      id: 3,
      type: 'Water Conservation',
      title: 'Shorter Shower',
      points: 30,
      date: '2 days ago',
      impact: { co2: 0.8, water: 15.3, energy: 0.5 },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0,
        },
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'fixed',
          top: `${50 + scrollY * 0.1}%`,
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #00ff88, #00ccff)',
          opacity: 0.05,
          filter: 'blur(60px)',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '33%': { transform: 'translateY(-30px) rotate(2deg)' },
            '66%': { transform: 'translateY(15px) rotate(-2deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: `${30 + scrollY * 0.05}%`,
          right: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
          opacity: 0.05,
          filter: 'blur(50px)',
          animation: 'float 25s ease-in-out infinite reverse',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section with Parallax */}
        <Box
          sx={{
            pt: 8,
            pb: 6,
            textAlign: 'center',
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <Typography
            variant="h2"
            fontWeight="700"
            sx={{
              background: 'linear-gradient(135deg, #00ff88, #00ccff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '4rem' },
            }}
          >
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Your eco-journey continues with {stats.totalPoints} points
          </Typography>

          {/* Level Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #00ff88, #00ccff)',
              borderRadius: 50,
              px: 3,
              py: 1,
              mb: 4,
              boxShadow: '0 10px 30px rgba(0, 255, 136, 0.3)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
          >
            <Star sx={{ mr: 1, color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              {stats.level}
            </Typography>
          </Box>
        </Box>

        {/* Stats Grid with Scroll Animations */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {[
            {
              title: 'CO₂ Saved',
              value: `${stats.co2Saved}kg`,
              icon: <Co2Outlined />,
              color: '#00ff88',
              progress: 75,
            },
            {
              title: 'Water Saved',
              value: `${stats.waterSaved}L`,
              icon: <WaterDrop />,
              color: '#00ccff',
              progress: 60,
            },
            {
              title: 'Energy Saved',
              value: `${stats.energySaved}kWh`,
              icon: <Bolt />,
              color: '#ffa500',
              progress: 85,
            },
            {
              title: 'Waste Reduced',
              value: `${stats.wasteReduced}kg`,
              icon: <Recycling />,
              color: '#ff6b6b',
              progress: 45,
            },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
                minWidth: 0,
              }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  transform: `translateY(${scrollY * 0.1 + index * 20}px)`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: `translateY(${scrollY * 0.1 + index * 20 - 10}px)`,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`,
                      mb: 2,
                      boxShadow: `0 10px 30px ${stat.color}40`,
                    }}
                  >
                    {React.cloneElement(stat.icon, { 
                      sx: { fontSize: 30, color: 'white' } 
                    })}
                  </Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                    {stat.title}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                        borderRadius: 3,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Recent Actions Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 3,
              transform: `translateX(${scrollY * 0.1}px)`,
              transition: 'transform 0.3s ease',
            }}
          >
            Recent Actions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {recentActions.map((action, index) => (
              <Box
                key={action.id}
                sx={{
                  flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' },
                  minWidth: 0,
                }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    transform: `translateX(${scrollY * 0.05 + index * 30}px)`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: `translateX(${scrollY * 0.05 + index * 30 - 15}px) scale(1.02)`,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                          mr: 2,
                        }}
                      >
                        <Co2Outlined />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {action.date}
                        </Typography>
                      </Box>
                      <Chip
                        label={`+${action.points} pts`}
                        sx={{
                          background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          CO₂ Saved
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                          {action.impact.co2}kg
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Water Saved
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#00ccff', fontWeight: 600 }}>
                          {action.impact.water}L
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Energy Saved
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffa500', fontWeight: 600 }}>
                          {action.impact.energy}kWh
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Monthly Progress Section */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            p: 4,
            mb: 6,
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.3s ease',
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
            This Month's Progress
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Actions Completed
                </Typography>
                <Typography variant="h3" sx={{ color: '#00ff88', fontWeight: 700 }}>
                  {stats.actionsThisMonth}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={80}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #00ff88, #00ccff)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Points Earned
                </Typography>
                <Typography variant="h3" sx={{ color: '#00ccff', fontWeight: 700 }}>
                  {stats.totalPoints}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #00ccff, #ffa500)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;