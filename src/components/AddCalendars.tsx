import { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Input,
    TextField,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import type {
    SelectChangeEvent
} from "@mui/material";
// import { useCalendars } from "./../hooks/useCalendars";
import {
    useIcsUrls
} from "../hooks/useIcsUrls";

type Props = {
    onNewIcsText: (icsText: string, source: string) => void;
}
export function AddCalendars({ onNewIcsText }: Props) {
    // const {  
    //     // error, 
    //     // addCalendarFromIcs,
    //   } = useCalendars();

    const [tabValue, setTabValue] = useState(0);
    const [icsText, setIcsText] = useState('');
    const [icsUrl, setIcsUrl] = useState('');

    const {
        addToRecentUrls,
        urls
    } = useIcsUrls();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const text = await file.text();
            onNewIcsText(text, file.name);
        }
        event.target.value = '';
    };

    const handleIcsTextSubmit = () => {
        if (icsText.trim()) {
            onNewIcsText(icsText, 'Manuell');
            setIcsText('');
        }
    };

    const handleSelectedUrlChange = (event: SelectChangeEvent<string>) => {
        const selectedUrl = event.target.value;
        setIcsUrl(selectedUrl);
    };

    const handleUrlSubmit = async () => {
        if (icsUrl.trim()) {
            try {
                let response;

                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 15000);
                try {
                    response = await fetch(icsUrl, {
                        method: 'GET',
                        headers: { Accept: 'text/calendar, text/plain, */*' },
                        mode: 'cors',
                        signal: controller.signal
                    });
                } catch {
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(icsUrl)}`;
                    response = await fetch(proxyUrl, {
                        signal: controller.signal
                    });
                } finally {
                    clearTimeout(id);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }

                const text = await response.text();
                const urlParts = new URL(icsUrl);
                const fallbackName = urlParts.pathname.split('/').pop() || 'Nedladdad kalender';
                onNewIcsText(text, fallbackName);
                addToRecentUrls(icsUrl);
            } catch (err) {
                if (err instanceof Error) {
                    alert(`Fel vid nedladdning: ${err.message}`);
                } else {
                    alert('Okänt fel vid nedladdning av kalendern');
                }
            }
        }
    };

    const isValidHttpUrl = (input: string) => {
        try {
            const u = new URL(input.trim());
            return u.protocol === 'http:' || u.protocol === 'https:';
        } catch {
            return false;
        }
    };

    return (
        <>
            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 4 }}>
                <Tab label="Filuppladdning" />
                <Tab label="Klistra in text" />
                <Tab label="Ladda ner från länk" />
            </Tabs>

            {tabValue === 0 && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={3} sx={{ py: 2 }}>
                    <Button variant="contained" component="label" size="large" sx={{ px: 4, py: 1.5 }}>
                        Välj fil
                        <Input
                            type="file"
                            inputProps={{ accept: '.ics,text/calendar' }}
                            onChange={handleFileChange}
                            sx={{ display: 'none' }}
                        />
                    </Button>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Välj en .ics-fil från din dator
                    </Typography>
                </Box>
            )}

            {tabValue === 1 && ( // lägg till kalender genom att skriva eller klista in kalender/ics (och data från excel?!)
                <Box display="flex" flexDirection="column" gap={3} sx={{ py: 2 }}>
                    <TextField
                        multiline
                        rows={10}
                        placeholder="Klistra in .ics-innehåll här..."
                        value={icsText}
                        onChange={(e) => setIcsText(e.target.value)}
                        variant="outlined"
                        fullWidth
                        label="ICS-innehåll"
                    />
                    <Button
                        variant="contained"
                        onClick={handleIcsTextSubmit}
                        disabled={!icsText.trim()}
                        fullWidth
                        size="large"
                        sx={{ py: 1.5 }}
                    >
                        Lägg till kalender
                    </Button>
                </Box>
            )}

            {tabValue === 2 && ( // Lägg till kalender via url
                <Box display="flex" flexDirection="column" gap={3} sx={{ py: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="recent-urls-label">Senaste länkar</InputLabel>
                        <Select
                            labelId="recent-urls-label"
                            value={icsUrl}
                            onChange={handleSelectedUrlChange}
                            label="Senaste länkar"
                            displayEmpty
                            renderValue={(val) => val || 'Välj en tidigare länk'}
                        >
                            <MenuItem value="">
                                <em>Välj en tidigare länk</em>
                            </MenuItem>
                            {urls.map((url) => (
                                <MenuItem key={url} value={url}>
                                    <Box>
                                        <Typography variant="body2" noWrap>
                                            {url.length > 60 ? `${url.substring(0, 60)}...` : url}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        placeholder="https://example.com/calendar.ics"
                        value={icsUrl}
                        onChange={(e) => setIcsUrl(e.target.value)}
                        variant="outlined"
                        fullWidth
                        label="Länk till kalender (URL)"
                    />
                    <Button
                        variant="contained"
                        onClick={handleUrlSubmit}
                        disabled={!isValidHttpUrl(icsUrl)}
                        fullWidth
                        size="large"
                        sx={{ py: 1.5 }}
                    >
                        Ladda ner kalender
                    </Button>
                </Box>
            )}

            {/*error && (
                <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
            )*/}
        </>
    );

}