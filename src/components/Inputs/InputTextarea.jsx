import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './Inputs.module.scss';

const InputTextarea = ({ label, placeholder, name, validateRules, defaultValue }) => {
  const {
    register,
    formState: { errors },
    setValue
  } = useFormContext();

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
    if (!defaultValue) {
      setValue(name, '');
    }
  }, [defaultValue]);

  return (
    <label className={styles.labelInput}>
      {label}
      <textarea
        className={`${styles.input} ${styles.inputTextarea}`}
        placeholder={placeholder}
        {...register(name, {
          ...validateRules,
          onChange: (e) => setValue(name, e.target.value)
        })}
      />
      {errors[name] && <div style={{ color: 'red' }}>{errors[name].message}</div>}
    </label>
  );
};

export default InputTextarea;
