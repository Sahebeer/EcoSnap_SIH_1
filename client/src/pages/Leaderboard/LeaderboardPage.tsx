import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  Co2Outlined,
  Star,
  LocationOn,
  Visibility,
  Share,
  FilterList,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { leaderboardAPI } from '../../services/api';

const LeaderboardPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const data = await leaderboardAPI.getGlobalLeaderboard();
        setLeaderboardData(data?.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        // Keep mock data as fallback
        setLeaderboardData(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeTab]);

  // Mock data for demonstration
  const mockLeaderboard = [
    {
      id: 1,
      rank: 1,
      name: 'Sahebjot Singh',
      points: 2840,
      actions: 45,
      location: 'Mumbai, Maharashtra',
      badge: 'Eco Champion',
      verified: true,
    },
    {
      id: 2,
      rank: 2,
      name: 'Amish Patel',
      points: 2650,
      actions: 38,
      location: 'Delhi, Delhi',
      badge: 'Green Warrior',
      verified: true,
    },
    {
      id: 3,
      rank: 3,
      name: 'Krish Sharma',
      points: 2420,
      actions: 42,
      location: 'Bangalore, Karnataka',
      badge: 'Eco Pioneer',
      verified: true,
    },
    {
      id: 4,
      rank: 4,
      name: 'Afreen Khan',
      points: 2180,
      actions: 35,
      location: 'Chennai, Tamil Nadu',
      badge: 'Sustainability Hero',
      verified: true,
    },
    {
      id: 5,
      rank: 5,
      name: 'Kishan Gupta',
      points: 1950,
      actions: 28,
      location: 'Kolkata, West Bengal',
      badge: 'Eco Advocate',
      verified: true,
    },
    {
      id: 6,
      rank: 6,
      name: 'Abhinav Verma',
      points: 1750,
      actions: 32,
      location: 'Pune, Maharashtra',
      badge: 'Eco Enthusiast',
      verified: true,
    },
    {
      id: 7,
      rank: 7,
      name: 'Raj Kumar',
      points: 1650,
      actions: 25,
      location: 'Hyderabad, Telangana',
      badge: 'Green Supporter',
      verified: true,
    },
  ];

  const tabs = ['Global', 'Regional', 'Monthly', 'All Time'];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return 'rgba(255, 255, 255, 0.3)';
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
            Leaderboard
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
            Discover the top eco-warriors making a difference in our community
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {[
              { title: 'Total Participants', value: '2,847', icon: <Person />, color: '#ff6b6b' },
              { title: 'Total Points', value: '1.2M+', icon: <TrendingUp />, color: '#ffa500' },
              { title: 'Actions Completed', value: '45.2K', icon: <Co2Outlined />, color: '#4ecdc4' },
              { title: 'Countries', value: '127', icon: <LocationOn />, color: '#45b7d1' },
            ].map((stat, index) => (
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
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: '#ff6b6b',
                  },
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab} label={tab} />
              ))}
            </Tabs>
          </Card>
        </Box>

        {/* Leaderboard List */}
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
            Top Eco Warriors
          </Typography>
          
          <Grid container spacing={3}>
            {loading ? (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Loading leaderboard...
                  </Typography>
                </Box>
              </Grid>
            ) : leaderboardData.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    No leaderboard data available yet. Be the first to make an impact!
                  </Typography>
                </Box>
              </Grid>
            ) : (
              leaderboardData.map((user, index) => (
              <Grid size={{ xs: 12 }} key={user.id}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {/* Rank */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${getRankColor(user.rank)}, ${getRankColor(user.rank)}dd)`,
                          boxShadow: `0 8px 25px ${getRankColor(user.rank)}40`,
                          position: 'relative',
                        }}
                      >
                        {user.rank <= 3 && (
                          <EmojiEvents sx={{ fontSize: 24, color: 'white' }} />
                        )}
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: '700',
                            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          #{user.rank}
                        </Typography>
                      </Box>

                      {/* User Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                fontWeight: '600',
                                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                                mr: 2,
                              }}
                            >
                              {user.name}
                            </Typography>
                            <Chip
                              label={user.badge}
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                                color: 'white',
                                fontWeight: '600',
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOn sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)', mr: 0.5 }} />
                              <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                {user.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Co2Outlined sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)', mr: 0.5 }} />
                              <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                {user.actions} actions
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {/* Points */}
                      <Box sx={{ textAlign: 'right', mr: 2 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            color: 'white',
                            fontWeight: '700',
                            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                            mb: 0.5,
                          }}
                        >
                          {user.points.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          points
                        </Typography>
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          <Share />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
            )}
          </Grid>

          {/* Load More Button */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                },
              }}
            >
              Load More
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaderboardPage;