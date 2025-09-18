import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  useColorMode,
  HStack,
  Spacer,
  Textarea,
  IconButton
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, DownloadIcon } from '@chakra-ui/icons';

import { UploadPanel } from './components/UploadPanel';
import { MarkdownPreview } from './components/MarkdownPreview';

export default function App(): JSX.Element {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [markdown, setMarkdown] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSuccess = (content: string, sourceName: string) => {
    setMarkdown(content);
    setFileName(sourceName);
    toast({
      title: 'Conversion successful',
      description: `${sourceName} converted to Markdown`,
      status: 'success',
      duration: 4000,
      isClosable: true
    });
  };

  const handleError = (message: string) => {
    toast({
      title: 'Conversion failed',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  };

  const handleDownload = () => {
    if (!markdown) {
      return;
    }

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName || 'document'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxW="5xl" py={14}>
      <VStack spacing={8} align="stretch">
        <HStack>
          <Box>
            <Heading as="h1" size="lg">
              MarkItDown Web UI
            </Heading>
            <Text color="gray.500">Convert documents into LLM-ready Markdown powered by Microsoft's MarkItDown.</Text>
          </Box>
          <Spacer />
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </HStack>

        <UploadPanel onSuccess={handleSuccess} onError={handleError} />

        <Box>
          <HStack mb={2}>
            <Heading as="h2" size="md">
              Markdown Output
            </Heading>
            <Spacer />
            <Button
              leftIcon={<DownloadIcon />}
              onClick={handleDownload}
              isDisabled={!markdown}
              size="sm"
              colorScheme="teal"
            >
              Download .md
            </Button>
          </HStack>
          {markdown ? (
            <MarkdownPreview markdown={markdown} />
          ) : (
            <Box borderWidth="1px" borderRadius="md" p={6} textAlign="center" color="gray.500">
              Upload a file to see the Markdown output here.
            </Box>
          )}
        </Box>

        <Box>
          <Heading as="h2" size="sm" mb={2}>
            Raw Markdown
          </Heading>
          <Textarea value={markdown} readOnly minH="200px" />
        </Box>

        <Box textAlign="center" color="gray.500" fontSize="sm">
          Powered by Microsoft's <a href="https://github.com/microsoft/markitdown" target="_blank" rel="noopener noreferrer">MarkItDown</a> | Maintained by Kunal Runwal
        </Box>
      </VStack>
    </Container>
  );
}

