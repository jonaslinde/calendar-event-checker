import React, { useState } from 'react';
import { Container, Typography, Box, Button, Input, Paper } from '@mui/material';

function App() {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Här kan vi senare läsa in filen och parsa den
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ladda upp kalender (.ics)
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Button variant="contained" component="label">
            Välj fil
            <Input
              type="file"
              inputProps={{ accept: '.ics,text/calendar' }}
              onChange={handleFileChange}
              sx={{ display: 'none' }}
            />
          </Button>
          {fileName && (
            <Typography variant="body1">Vald fil: {fileName}</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
