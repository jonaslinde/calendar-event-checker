import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import type { DisplayEventStatus } from "../hooks/useDisplayEvents";

export interface DisplayEventStatusIconProps {
    status: DisplayEventStatus;
    fontSize?: string | number;
    sx?: object;
}

export function DisplayEventStatusIcon({
    status,
    fontSize = '1rem',
    sx = {}
}: DisplayEventStatusIconProps) {
    const defaultSx = {
        verticalAlign: 'middle',
        ml: 0.5,
        ...sx
    };

    switch (status) {
        case "ok":
            return <CheckCircleIcon sx={{ color: '#4caf50', fontSize, ...defaultSx }} />;
        case "sameDay":
            return <WarningIcon sx={{ color: '#ff9800', fontSize, ...defaultSx }} />;
        case "overlapping":
            return <ErrorIcon sx={{ color: '#f44336', fontSize, ...defaultSx }} />;
        default:
            return <CheckCircleIcon sx={{ color: '#4caf50', fontSize, ...defaultSx }} />;
    }
}