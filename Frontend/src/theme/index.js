import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#6366f1',
      dark: '#4338ca',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#808390',
      light: '#A8AAAE',
      dark: '#4B4D52',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#28C76F',
      light: '#48DA89',
      dark: '#1F9D57',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FF9F43',
      light: '#FFB86C',
      dark: '#E07D21',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#EA5455',
      light: '#EE7374',
      dark: '#C83233',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#00CFE8',
      light: '#1FD5EB',
      dark: '#009CB0',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F4F5FA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#2F2B3D',
      secondary: '#6D6B77',
      disabled: '#A5A3AE'
    },
    divider: 'rgba(47, 43, 61, 0.12)'
  },
  typography: {
    fontFamily: ['Public Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.02em', color: '#2F2B3D' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', color: '#2F2B3D' },
    h3: { fontWeight: 600, color: '#2F2B3D' },
    h4: { fontWeight: 600, color: '#2F2B3D' },
    h5: { fontWeight: 600, color: '#2F2B3D' },
    h6: { fontWeight: 600, color: '#2F2B3D' }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F4F5FA',
          color: '#2F2B3D'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          backgroundImage: 'none',
          boxShadow: '0 4px 18px 0 rgba(47, 43, 61, 0.1)',
          border: '1px solid rgba(47, 43, 61, 0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 600,
          boxShadow: 'none',
          padding: '8px 18px'
        },
        containedPrimary: {
          boxShadow: '0 2px 6px 0 rgba(79, 70, 229, 0.4)',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.6)'
          }
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#4f46e5',
          '& .MuiTableCell-head': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: '#4f46e5',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '1px solid rgba(47, 43, 61, 0.12)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(47, 43, 61, 0.08)',
          color: '#2F2B3D',
          padding: '14px 18px'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(47, 43, 61, 0.03)'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '& fieldset': {
            borderColor: 'rgba(47, 43, 61, 0.22)'
          },
          '&:hover fieldset': {
            borderColor: '#4f46e5'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4f46e5',
          color: '#FFFFFF'
        }
      }
    }
  }
})

export default theme
