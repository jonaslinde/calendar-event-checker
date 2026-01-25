import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';

export interface Props {
    optionSettings: OptionCheckBoxProps[];
}
export interface OptionCheckBoxProps {
    checked: boolean,
    label: string,
    onChange: (newValue: boolean) => void
}
export const OptionCheckBox = ({ checked, label, onChange }: OptionCheckBoxProps) => {
    return (
        <FormControlLabel
            control={<Checkbox />}
            checked={checked}
            label={label}
            onChange={(e) => onChange(e.target.checked)}
            sx={{ ml: 1 }}
        />
    );
}
export function DisplayEventsShowOptions({ optionSettings = [] }: Props) {
    return (
        <>
            <FormControl>
                <FormLabel>Visa status:</FormLabel>
                <FormGroup >
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label='Alla'
                        sx={{ ml: 1 }}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label='Ok'
                        sx={{ ml: 1 }}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label='Överlappande'
                        sx={{ ml: 1 }}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label='Samma dag'
                        sx={{ ml: 1 }}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label='Dubletter'
                        sx={{ ml: 1 }}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label='Sammanslagna'
                        sx={{ ml: 1 }}
                    />
                </FormGroup>
                <FormHelperText>Be careful</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Dubbletter:</FormLabel>
                <FormGroup>
                    {optionSettings.map(({ checked, label, onChange }, idx) => (
                        <OptionCheckBox
                            checked={checked}
                            label={label}
                            onChange={onChange}
                            key={'option-' + idx}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </>
    )
}
