import { FormControlLabel, Checkbox } from '@mui/material';

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
            control={
                <Checkbox
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
            }
            label={label}
            sx={{ ml: 1 }}
        />
    );
}
export function DisplayEventsShowOptions({ optionSettings = [] }: Props) {
    return (
        <>
            {optionSettings.map(({ checked, label, onChange }, idx) => (<OptionCheckBox checked={checked} label={label} onChange={onChange} key={'option-' + idx} />))}
        </>
    )
}
