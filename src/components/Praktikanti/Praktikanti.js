import classes from './Praktikanti.module.css'

const Praktikanti = (props) => {
  return <>
  <li className={classes.person}>{props.name}</li>
  </>;
};

export default Praktikanti;
