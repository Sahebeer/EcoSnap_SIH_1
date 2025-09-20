import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Fade,
  Backdrop,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
  Videocam,
  LocationOn,
  Close,
  Add,
  Title,
} from '@mui/icons-material';
import UploadZone from './UploadZone';

interface FloatingUploadBubbleProps {
  onUpload: (data: { file: File; title: string; location?: string; type: 'photo' | 'video' }) => void;
}

const FloatingUploadBubble: React.FC<FloatingUploadBubbleProps> = ({ onUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug log to verify component is rendering
  console.log('FloatingUploadBubble component rendered');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError('');
    setUploadStatus('idle');
    setUploadProgress(0);
    
    // Determine if it's a photo or video
    if (file.type.startsWith('video/')) {
      setUploadType('video');
    } else {
      setUploadType('photo');
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadError('');
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setUploadStatus('success');
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Call the upload handler
      await onUpload({
        file: selectedFile,
        title: title,
        location: location || undefined,
        type: uploadType,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');

      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setTitle('');
        setLocation('');
        setUploadStatus('idle');
        setUploadProgress(0);
        setIsOpen(false);
      }, 1500);

    } catch (error: any) {
      setUploadStatus('error');
      setUploadError(error.message || 'Upload failed');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setTitle('');
    setLocation('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError('');
  };

  return (
    <>
      {/* Floating Upload Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        <Tooltip title="Upload Eco Action" placement="left">
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #00ff88, #00ccff)',
              boxShadow: '0 8px 32px rgba(0, 255, 136, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00cc6a, #0099cc)',
                boxShadow: '0 12px 40px rgba(0, 255, 136, 0.6)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
          >
            <CloudUpload sx={{ fontSize: 32, color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Upload Modal */}
      <Backdrop
        open={isOpen}
        sx={{
          zIndex: 1300,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Fade in={isOpen}>
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90vw', sm: '500px', md: '600px' },
              maxHeight: '90vh',
              overflow: 'auto',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              p: 3,
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Upload Eco Action
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': {
                    color: '#ff6b6b',
                    background: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Upload Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                What would you like to upload?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  icon={<PhotoCamera />}
                  label="Photo"
                  onClick={() => setUploadType('photo')}
                  sx={{
                    background: uploadType === 'photo' 
                      ? 'linear-gradient(135deg, #00ff88, #00ccff)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: uploadType === 'photo' ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    '&:hover': {
                      background: uploadType === 'photo' 
                        ? 'linear-gradient(135deg, #00cc6a, #0099cc)' 
                        : 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                />
                <Chip
                  icon={<Videocam />}
                  label="Video"
                  onClick={() => setUploadType('video')}
                  sx={{
                    background: uploadType === 'video' 
                      ? 'linear-gradient(135deg, #00ff88, #00ccff)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: uploadType === 'video' ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    '&:hover': {
                      background: uploadType === 'video' 
                        ? 'linear-gradient(135deg, #00cc6a, #0099cc)' 
                        : 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Upload Zone */}
            <Box sx={{ mb: 3 }}>
              <UploadZone
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                isUploading={uploadStatus === 'uploading'}
                uploadProgress={uploadProgress}
                uploadStatus={uploadStatus}
                error={uploadError}
                accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                maxSize={uploadType === 'video' ? 100 : 10} // 100MB for videos, 10MB for photos
              />
            </Box>

            {/* Title Input */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Action Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Planted Trees in Park"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Title sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00ff88',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Box>

            {/* Location Input */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Location (Optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Central Park, New York"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00ff88',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#00ff88',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#ff6b6b',
                    color: '#ff6b6b',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedFile || !title.trim() || uploadStatus === 'uploading'}
                startIcon={<Add />}
                sx={{
                  background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00cc6a, #0099cc)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Action'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Backdrop>
    </>
  );
};

export default FloatingUploadBubble;
