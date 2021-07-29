import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 400,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
    backgroundColor: 'white',
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

export const MenuProp = {
  PaperProps: {
    style: {
      width: 300,
    },
  },
};
