import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  TrendingUp,
  Co2Outlined,
  CalendarToday,
  LocationOn,
  Star,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import { actionsAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [scrollY, setScrollY] = useState(0);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch actions from API
  const fetchActions = async () => {
    try {
      setLoading(true);
      const response = await actionsAPI.getUserActions({
        type: filterType === 'all' ? undefined : filterType as any,
        sortBy: 'date',
        sortOrder: 'desc'
      });
      setActions(response.actions);
    } catch (error: any) {
      console.error('Error fetching actions:', error);
      showNotification('Failed to load actions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [filterType]);

  // Listen for page focus to refresh actions when returning from create page
  useEffect(() => {
    const handleFocus = () => {
      fetchActions();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Filter actions based on search term
  const filteredActions = actions.filter(action =>
    action.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            My Eco Actions
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
            Track your environmental impact and see how your actions are making a difference
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {[
              { title: 'Total Actions', value: '24', icon: <Co2Outlined />, color: '#ff6b6b' },
              { title: 'Points Earned', value: '1,250', icon: <TrendingUp />, color: '#ffa500' },
              { title: 'This Month', value: '8', icon: <CalendarToday />, color: '#4ecdc4' },
              { title: 'Verified', value: '20', icon: <Star />, color: '#45b7d1' },
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  Filter
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/actions/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ffa500, #ff6b6b)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Add Action
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Actions List */}
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
            Recent Actions
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
            </Box>
          ) : filteredActions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                No actions found
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first eco action!'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredActions.map((action, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={action.id}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                  onClick={() => {
                    setSelectedAction(action);
                    setDetailModalOpen(true);
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {action.proofImage ? (
                      <img
                        src={`http://localhost:5001${action.proofImage}`}
                        alt={action.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', action.proofImage);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: '100%',
                          background: `linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 165, 0, 0.2))`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Co2Outlined sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.3)' }} />
                      </Box>
                    )}
                  </Box>
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: '600',
                          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Chip
                        label={action.status}
                        size="small"
                        sx={{
                          background: action.status === 'verified' 
                            ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' 
                            : 'linear-gradient(135deg, #ffa500, #ff8c00)',
                          color: 'white',
                          fontWeight: '600',
                        }}
                      />
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2,
                        lineHeight: 1.6,
                      }}
                    >
                      {action.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      >
                        {action.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: '#ffa500', mr: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'white',
                            fontWeight: '600',
                          }}
                        >
                          {action.points} pts
                        </Typography>
                      </Box>
                      
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
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Action Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
          },
        }}
      >
        {selectedAction && (
          <>
            <DialogTitle
              sx={{
                color: 'white',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {selectedAction.title}
            </DialogTitle>
            <DialogContent>
              {selectedAction.proofImage && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img
                    src={`http://localhost:5001${selectedAction.proofImage}`}
                    alt={selectedAction.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', selectedAction.proofImage);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              )}
              
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                {selectedAction.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  label={selectedAction.status}
                  sx={{
                    background: selectedAction.status === 'verified' 
                      ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' 
                      : 'linear-gradient(135deg, #ffa500, #ff8c00)',
                    color: 'white',
                    fontWeight: '600',
                  }}
                />
                <Chip
                  icon={<Star />}
                  label={`${selectedAction.points} points`}
                  sx={{
                    background: 'linear-gradient(135deg, #ffa500, #ff8c00)',
                    color: 'white',
                    fontWeight: '600',
                  }}
                />
              </Box>
              
              {selectedAction.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {selectedAction.location}
                  </Typography>
                </Box>
              )}
              
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Created: {new Date(selectedAction.createdAt).toLocaleDateString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDetailModalOpen(false)}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ActionsPage;