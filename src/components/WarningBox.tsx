import { Box } from "@mui/material";

export interface WarningBoxProps {
    absolute?: boolean;
    top?: number
    right?: number
    size?: number,
    fontSize?: string
}

export function WarningBox({
    absolute = false,
    top = 0,
    right = 0,
    size = 24,
    fontSize = "12px",  
}: WarningBoxProps) {
    return (
        <Box
        sx={{
          position: absolute ? "absolute" : "static",
          top: absolute ? top : "auto",
          right: absolute ? right : "auto",
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '50%',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: fontSize,
          fontWeight: 'bold',
        }}
      >
        ⚠️
      </Box>        
    )
}