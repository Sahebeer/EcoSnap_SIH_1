import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
  Delete,
  CheckCircle,
  Error,
} from '@mui/icons-material';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isUploading = false,
  uploadProgress = 0,
  uploadStatus = 'idle',
  error,
  accept = 'image/*',
  maxSize = 10,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return false;
    }
    
    // Check file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      alert('Invalid file type');
      return false;
    }
    
    return true;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return '#00ff88';
      case 'error':
        return '#ff6b6b';
      case 'uploading':
        return '#00ccff';
      default:
        return 'rgba(255, 255, 255, 0.6)';
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle sx={{ color: '#00ff88' }} />;
      case 'error':
        return <Error sx={{ color: '#ff6b6b' }} />;
      case 'uploading':
        return <CloudUpload sx={{ color: '#00ccff' }} />;
      default:
        return <CloudUpload sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />;
    }
  };

  return (
    <Box className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {!selectedFile ? (
        <Paper
          elevation={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${isDragOver ? '#00ff88' : 'rgba(255, 255, 255, 0.3)'}`,
            borderRadius: 4,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragOver 
              ? 'rgba(0, 255, 136, 0.1)' 
              : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#00ff88',
              background: 'rgba(0, 255, 136, 0.05)',
              transform: 'translateY(-2px)',
            },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease',
            },
            '&:hover::before': {
              transform: 'translateX(100%)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                mb: 1,
              }}
            >
              {isDragOver ? 'Drop your file here' : 'Upload Proof Image'}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 2,
              }}
            >
              Drag and drop your image here, or click to browse
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip
                label={`Max ${maxSize}MB`}
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
              <Chip
                label="JPG, PNG, GIF"
                size="small"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: `2px solid ${getStatusColor()}`,
            borderRadius: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #00ff88, #00ccff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PhotoCamera sx={{ fontSize: 30, color: 'white' }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedFile.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  mb: 1,
                }}
              >
                {formatFileSize(selectedFile.size)}
              </Typography>

              {isUploading && (
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #00ff88, #00ccff)',
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      mt: 0.5,
                      display: 'block',
                    }}
                  >
                    {uploadProgress}% uploaded
                  </Typography>
                </Box>
              )}

              {error && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#ff6b6b',
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  {error}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon()}
              <IconButton
                onClick={onFileRemove}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': {
                    color: '#ff6b6b',
                    background: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default UploadZone;
