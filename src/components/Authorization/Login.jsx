import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Authorization.module.scss';
import { loginUser, clearStatusAndErrors } from '../../store/userSlice';
import { fetchArticles } from '../../store/articleSlice';
import Form from '../Form';
import { InputText } from '../Inputs';
import Button from '../Button';
import options from '../../utils/getOptionsToast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.users);
  const [email, setEmail] = useState('');

  const fieldsInputs = [
    {
      name: 'email',
      validate: {
        required: 'The email field must be filled in',
        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Incorrect email' }
      }
    },
    {
      name: 'password',
      validate: {
        required: 'The password field must be filled in',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        },
        maxLength: {
          value: 40,
          message: 'Password must contain no more than 40 characters'
        }
      }
    }
  ];

  const onSubmit = (data) => {
    setEmail(data.email);
    dispatch(loginUser({ ...data }));
  };

  const getValidateRules = (rules, name) => {
    let obj = {};
    rules.forEach((item) => {
      if (item.name === name) {
        obj = item.validate;
      }
    });
    return obj;
  };

  useEffect(() => {
    if (status === 'success') {
      toast.success(`Authentication ${email}`, options);
      dispatch(clearStatusAndErrors());
      setTimeout(() => {
        dispatch(fetchArticles());
        navigate('/');
      }, 500);
    }

    if (status === 'failed') {
      toast.error(`email or password ${error.errorsValue['email or password']}`, options);
      dispatch(clearStatusAndErrors());
    }
  }, [status, error]);

  return (
    <div className={styles['wrapper-form']}>
      <Form
        title='Sign In'
        fn={onSubmit}>
        <InputText
          type='text'
          name='email'
          label='email'
          placeholder='Email'
          validateRules={getValidateRules(fieldsInputs, 'email')}
        />
        <InputText
          type='text'
          name='password'
          label='password'
          placeholder='Password'
          validateRules={getValidateRules(fieldsInputs, 'password')}
        />
        <div className={styles.btnLogin}>
          <Button
            label='Login'
            type='submit'
          />
        </div>
        <span className={styles['form-span']}>
          Don’t have an account?
          <Link
            className={styles['form-span-link']}
            to='/sign-up'>
            Sign Up
          </Link>
        </span>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Login;
