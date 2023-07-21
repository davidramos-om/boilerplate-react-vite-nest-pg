import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        No hay resultados
      </Typography>

      <Typography variant="body2">
        No se encontraron resultados con &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Prueba con otras palabras clave, acentos o revisa la ortografía.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Comienza a escribir para buscar
    </Typography>
  );
}
