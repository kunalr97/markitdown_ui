import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface UploadPanelProps {
  onSuccess: (markdown: string, fileName: string) => void;
  onError: (message: string) => void;
}

const apiBase = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') || '';

export function UploadPanel({ onSuccess, onError }: UploadPanelProps): JSX.Element {
  const [isUploading, setIsUploading] = useState(false);
  const [lastFileName, setLastFileName] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];
      setIsUploading(true);
      setLastFileName(file.name);

      const formData = new FormData();
      formData.append('file', file, file.name);

      try {
        const endpoint = `${apiBase}/api/convert`;
        const response = await axios.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'text'
        });
        onSuccess(response.data, file.name.replace(/\.[^.]+$/, ''));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.detail ?? error.message;
          onError(message);
        } else {
          onError('Unexpected error occurred');
        }
      } finally {
        setIsUploading(false);
      }
    },
    [onError, onSuccess]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true
  });

  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const activeBorderColor = useColorModeValue('teal.400', 'teal.200');

  return (
    <Box
      {...getRootProps()}
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={isDragActive ? activeBorderColor : borderColor}
      borderRadius="lg"
      p={8}
      textAlign="center"
      bg={useColorModeValue('gray.50', 'gray.700')}
      cursor="pointer"
      transition="border-color 0.2s ease"
    >
      <input {...getInputProps()} />
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="semibold">
          {isDragActive ? 'Drop the file here...' : 'Drag and drop a file here, or click to select'}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Supports PDF, DOCX, PPTX, XLSX, TXT, HTML and more.
        </Text>
        {isUploading ? (
          <Center>
            <HStack spacing={3}>
              <Spinner size="sm" />
              <Text>Converting {lastFileName}...</Text>
            </HStack>
          </Center>
        ) : (
          <Button onClick={open} colorScheme="teal">
            Select File
          </Button>
        )}
      </VStack>
    </Box>
  );
}
