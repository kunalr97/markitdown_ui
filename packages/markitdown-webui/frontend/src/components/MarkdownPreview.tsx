import { Box } from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';

interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps): JSX.Element {
  return (
    <Box borderWidth="1px" borderRadius="md" p={6} maxH="400px" overflowY="auto">
      <Markdown
        options={{
          overrides: {
            table: {
              props: {
                style: {
                  borderCollapse: 'collapse',
                  width: '100%'
                }
              }
            },
            th: {
              props: {
                style: {
                  border: '1px solid',
                  padding: '6px'
                }
              }
            },
            td: {
              props: {
                style: {
                  border: '1px solid',
                  padding: '6px'
                }
              }
            }
          }
        }}
      >
        {markdown}
      </Markdown>
    </Box>
  );
}
