import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import styles from './Form.module.scss';

const Form = ({ title, children, fn, customStyles }) => {
  const methods = useForm();

  return (
    <div className={customStyles || styles.wrapForm}>
      <h2 className={styles.titleForm}>{title}</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(fn)}>{children}</form>
      </FormProvider>
    </div>
  );
};

export default Form;
