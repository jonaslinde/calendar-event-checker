import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';

export interface Props {
    statusOptions: OptionCheckBoxProps[];
    mergeOptions: OptionCheckBoxProps[];
}
export interface OptionCheckBoxProps {
    checked: boolean,
    label: string,
    onChange: (newValue: boolean) => void
}
export const OptionCheckBox = ({ checked, label, onChange }: OptionCheckBoxProps) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={(_event, value) => onChange(value)}
                />
            }
            checked={checked}
            label={label}
            sx={{ ml: 1 }}
        />
    );
}
export function DisplayEventsShowOptions({ statusOptions = [], mergeOptions = [] }: Props) {
    return (
        <>
            <FormControl>
                <FormLabel>Visa status:</FormLabel>
                <FormGroup>
                    {statusOptions.map(({ checked, label, onChange }, idx) => (
                        <OptionCheckBox
                            checked={checked}
                            label={label}
                            onChange={onChange}
                            key={`status-${idx}`}
                        />
                    ))}
                </FormGroup>
                <FormHelperText>Välj en eller flera statusar</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Dubbletter:</FormLabel>
                <FormGroup>
                    {mergeOptions.map(({ checked, label, onChange }, idx) => (
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
