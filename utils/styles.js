import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>({
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  button: {
    margin: theme.spacing(1),
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    height: 200,
    width: 200,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
  },
  form: {
    maxWidth: 800,
    margin: '0 auto'
  },
  grow: {
    flexGrow: 1
  },
  main: {
    minHeight: '80vh'
  },
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    }
  },
  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial'
  },
  relative: {
    position: 'relative'
  },
  root: {
    display: 'flex',
  },
  section: {
    marginBottom: 10,
    marginTop: 10,
  },
  selected: {
    backgroundColor: 'mediumseagreen'
  }
}));

export default useStyles;
