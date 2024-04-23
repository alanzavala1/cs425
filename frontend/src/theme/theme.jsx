import { createTheme } from '@mui/material';
import { createColor } from '../utils/colors';

export const theme = createTheme({
  palette: {
    green: createColor('#2DC754'),
    red: createColor('#FF5733'),
    blue: createColor('#0068FF'),
    background: { default: '#808080' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 50 },
      },
    },
  },
});
