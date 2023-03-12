import React from 'react';
import styles from './Button.module.scss';

const Button = ({ label }) => (
  <button
    className={styles.button}
    type='submit'>
    {label}
  </button>
);

export default Button;
