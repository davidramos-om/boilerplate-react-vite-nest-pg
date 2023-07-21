import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, label, type, ...other }: Props) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          // helperText={error ? error?.message : helperText}
          {...other}
          label={error ? error?.message : label}
          // autoComplete="off"
          // autoComplete="chrome-off"
          autoComplete="new-password"
        />
      )}
    />
  );
}
