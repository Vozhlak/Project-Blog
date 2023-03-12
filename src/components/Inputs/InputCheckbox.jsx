import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './Inputs.module.scss';

const InputCheckbox = ({ name, validateRules }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();
  return (
    <label className={styles.labelCheckbox}>
      <div className={styles.wrapCheckbox}>
        <input
          className={styles.realCheckbox}
          type='checkbox'
          {...register(name, validateRules)}
        />
        <span className={styles.customCheckbox} />I agree to the processing of my personal information
      </div>
      {errors[name] && <div style={{ color: 'red' }}>{errors[name].message}</div>}
    </label>
  );
};

export default InputCheckbox;
