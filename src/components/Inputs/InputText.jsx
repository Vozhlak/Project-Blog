import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './Inputs.module.scss';

const InputText = ({ type, label, placeholder, name, validateRules, defaultValue }) => {
  const {
    register,
    formState: { errors },
    setValue,
    customErrors,
    setError
  } = useFormContext();

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
    if (!defaultValue) {
      setValue(name, '');
    }
    
  }, [defaultValue]);
  
  useEffect(() => {
    if (customErrors) {
      customErrors.forEach(item => {
        const nameInput = Object.keys(item);
        setError(...nameInput, {type: 'error network', message: item[nameInput]});
      });
    }
  }, [customErrors])

  return (
    <label className={styles.labelInput}>
      {label}
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        {...register(name, {
          ...validateRules,
          onChange: (e) => setValue(name, e.target.value)
        })}
      />
      {errors[name] && <div style={{ color: 'red' }}>{errors[name].message}</div>}
    </label>
  );
};

export default InputText;
