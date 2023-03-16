import React from 'react';
import styles from './Button.module.scss';

const Button = ({ label, disabled }) => (
  <button
    className={styles.button}
    type='submit'
    disabled={disabled}>
    {label}
  </button>
);

export default Button;
