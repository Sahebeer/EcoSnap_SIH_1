import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LocalFireDepartment,
  EmojiEvents,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { FloatingUploadBubble } from '../../components/Upload';
import { useNotification } from '../../context/NotificationContext';
import { actionsAPI, authAPI } from '../../services/api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showStats, setShowStats] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [weeklyActions, setWeeklyActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Remove scroll effect listener since we're not using parallax anymore

  // Fetch user data and recent actions
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats
        const userData = await authAPI.getMe();
        setUserStats(userData);
        
        // Fetch recent actions
        const actions = await actionsAPI.getUserActions({ limit: 3 });
        setRecentActions(actions?.actions || []);
        
        // Fetch weekly actions for streak calculation
        const weeklyActionsData = await actionsAPI.getUserActions({ limit: 50 });
        setWeeklyActions(weeklyActionsData?.actions || []);
        
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        showNotification('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [showNotification]);

  // Calculate meaningful eco-impact stats
  const calculateEcoImpact = () => {
    const totalPoints = userStats?.totalPoints || user?.totalPoints || 0;
    const actionsCount = weeklyActions.length;
    
    // Estimate impact based on points (1 point ≈ 0.1kg CO₂ saved)
    const co2Saved = Math.round((totalPoints * 0.1) * 10) / 10;
    const waterSaved = Math.round((totalPoints * 0.5) * 10) / 10; // 1 point ≈ 0.5L water
    const energySaved = Math.round((totalPoints * 0.2) * 10) / 10; // 1 point ≈ 0.2kWh energy
    
    return { co2Saved, waterSaved, energySaved };
  };

  // Calculate streak (consecutive days with actions)
  const calculateStreak = () => {
    if (!weeklyActions || !Array.isArray(weeklyActions) || weeklyActions.length === 0) return 0;
    
    const today = new Date();
    const actionDates = weeklyActions
      .filter(action => action && action.createdAt)
      .map(action => new Date(action.createdAt).toDateString());
    const uniqueDates = Array.from(new Set(actionDates)).sort().reverse();
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toDateString();
      if (uniqueDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate weekly activity (actions per day for last 7 days)
  const calculateWeeklyActivity = () => {
    if (!weeklyActions || !Array.isArray(weeklyActions)) {
      return [];
    }
    
    const activity = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayActions = weeklyActions.filter(action => 
        action && action.createdAt && new Date(action.createdAt).toDateString() === dateStr
      ).length;
      
      activity.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        actions: dayActions,
        date: dateStr
      });
    }
    
    return activity;
  };

  // Get milestone badge based on total points
  const getMilestoneBadge = () => {
    const totalPoints = userStats?.totalPoints || user?.totalPoints || 0;
    
    if (totalPoints >= 1000) return { name: 'Eco Champion', color: '#ffd700', icon: '🏆' };
    if (totalPoints >= 500) return { name: 'Green Warrior', color: '#c0c0c0', icon: '🥈' };
    if (totalPoints >= 250) return { name: 'Eco Pioneer', color: '#cd7f32', icon: '🥉' };
    if (totalPoints >= 100) return { name: 'Eco Enthusiast', color: '#4ecdc4', icon: '🌱' };
    return { name: 'Eco Beginner', color: '#45b7d1', icon: '🌿' };
  };

  const ecoImpact = calculateEcoImpact();
  const streak = calculateStreak();
  const weeklyActivity = calculateWeeklyActivity();
  const milestoneBadge = getMilestoneBadge();

  // Debug logging
  console.log('Dashboard render - weeklyActions:', weeklyActions);
  console.log('Dashboard render - weeklyActivity:', weeklyActivity);
  console.log('Dashboard render - streak:', streak);

  // Real data from API
  const stats = {
    totalPoints: userStats?.totalPoints || user?.totalPoints || 0,
    level: userStats?.level || user?.level || 'Eco-Beginner',
    actionsThisMonth: recentActions.length || 0,
    ...ecoImpact,
  };

  const handleUpload = async (data: { file: File; title: string; location?: string; type: 'photo' | 'video' }) => {
    try {
      // Validate title length
      if (data.title.length < 3 || data.title.length > 100) {
        showNotification('Title must be between 3 and 100 characters', 'error');
        return;
      }

      // Validate location length if provided
      if (data.location && data.location.length > 200) {
        showNotification('Location must be less than 200 characters', 'error');
        return;
      }

      // Create action data
      const actionData = {
        type: 'Other' as any, // Default category for upload bubble actions
        title: data.title,
        description: `Uploaded ${data.type}: ${data.title}. This action was created using the quick upload feature.`,
        points: 50, // Default points for upload bubble actions (backend will recalculate)
        location: data.location,
        proofImage: data.file,
        tags: [],
      };

      // Create the action using the API
      console.log('Creating action with data:', actionData);
      const result = await actionsAPI.createAction(actionData);
      
      showNotification(
        `"${data.title}" uploaded successfully! ${data.location ? `Location: ${data.location}` : ''} Check your actions to see it!`,
        'success'
      );
      
      console.log('Action created successfully:', result);
      
      // Refresh dashboard data to show updated points
      const userData = await authAPI.getMe();
      setUserStats(userData);
      
      const actions = await actionsAPI.getUserActions({ limit: 3 });
      setRecentActions(actions?.actions || []);
      
      const weeklyActionsData = await actionsAPI.getUserActions({ limit: 50 });
      setWeeklyActions(weeklyActionsData?.actions || []);
      
      // Optionally navigate to actions page after a short delay
      setTimeout(() => {
        navigate('/actions');
      }, 2000);
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      showNotification(error.message || 'Upload failed', 'error');
      throw error;
    }
  };

  // Show loading state if data is not ready
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2, width: 200 }} />
          <Typography sx={{ color: 'white' }}>Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

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
          top: '50%',
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
          top: '30%',
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
        {/* Hero Section */}
        <Box
          sx={{
            pt: 8,
            pb: 6,
            textAlign: 'center',
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

        {/* Eco Impact Stats */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 3,
            }}
          >
            🌍 Your Eco Impact This Month
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {[
              {
                title: 'CO₂ Saved',
                value: `${stats.co2Saved}kg`,
                subtitle: `Equivalent to ${Math.round(stats.co2Saved / 0.4)} tree days`,
                icon: <Co2Outlined />,
                color: '#00ff88',
                progress: Math.min((stats.co2Saved / 10) * 100, 100),
              },
              {
                title: 'Water Saved',
                value: `${stats.waterSaved}L`,
                subtitle: `Enough for ${Math.round(stats.waterSaved / 50)} showers`,
                icon: <WaterDrop />,
                color: '#00ccff',
                progress: Math.min((stats.waterSaved / 100) * 100, 100),
              },
              {
                title: 'Energy Saved',
                value: `${stats.energySaved}kWh`,
                subtitle: `Powers ${Math.round(stats.energySaved / 0.1)} LED bulbs for a day`,
                icon: <Bolt />,
                color: '#ffa500',
                progress: Math.min((stats.energySaved / 20) * 100, 100),
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
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
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                    {stat.subtitle}
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
        </Box>

        {/* Streak Counter & Milestone Badge */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 3,
            }}
          >
            🔥 Your Progress & Achievements
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Streak Counter */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                    mb: 2,
                    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                  }}
                >
                  <LocalFireDepartment sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  {streak}
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                  Day Streak! 🔥
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {streak === 0 ? 'Start your eco-journey today!' : 
                   streak === 1 ? 'Great start! Keep it going!' :
                   streak < 3 ? 'Building momentum!' :
                   streak < 7 ? 'You\'re on fire!' : 'Eco-warrior level!'}
                </Typography>
              </Card>
            </Box>

            {/* Milestone Badge */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${milestoneBadge.color}, ${milestoneBadge.color}dd)`,
                    mb: 2,
                    boxShadow: `0 10px 30px ${milestoneBadge.color}40`,
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  {milestoneBadge.icon}
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                  {milestoneBadge.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {stats.totalPoints} points earned
                </Typography>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Weekly Activity Chart */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 3,
            }}
          >
            📊 Weekly Activity
          </Typography>
          
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'end', 
              height: 120,
              px: 2, // Add horizontal padding
              gap: 1, // Add gap between bars
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(255, 255, 255, 0.2)',
                zIndex: 0,
              },
            }}>
              {weeklyActivity.map((day, index) => (
                <Box key={index} sx={{ 
                  textAlign: 'center', 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                }}>
                  <Box
                    sx={{
                      height: Math.max(day.actions * 15 + 8, 8), // Increased base height and multiplier
                      minHeight: 8,
                      width: '80%', // Make bars narrower
                      maxWidth: 40, // Cap the width
                      background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                      borderRadius: '6px 6px 0 0',
                      mb: 1,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0, 255, 136, 0.3)',
                      position: 'relative',
                      zIndex: 1, // Ensure bars appear above grid line
                      '&:hover': {
                        background: 'linear-gradient(135deg, #00ccff, #ffa500)',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.5)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    display: 'block',
                    fontWeight: 500,
                    mb: 0.5,
                  }}>
                    {day.day}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}>
                    {day.actions}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', mt: 2 }}>
              Actions logged in the past 7 days
            </Typography>
          </Card>
        </Box>

        {/* Recent Actions Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Recent Actions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {loading ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Loading your recent actions...
                </Typography>
              </Box>
            ) : recentActions.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No recent actions found. Start by uploading your first eco-action!
                </Typography>
              </Box>
            ) : (
              recentActions.map((action, index) => (
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.02)',
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
                          {new Date(action.createdAt).toLocaleDateString()}
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
                          Type
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                          {action.type}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Status
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#00ccff', fontWeight: 600 }}>
                          {action.status}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Location
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffa500', fontWeight: 600 }}>
                          {action.location || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))
            )}
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

      {/* Floating Upload Bubble */}
      <FloatingUploadBubble onUpload={handleUpload} />
    </Box>
  );
};

export default DashboardPage;