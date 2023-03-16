/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Authorization.module.scss';
import { registerUser, clearStatusAndErrors } from '../../store/userSlice';
import Form from '../Form';
import { InputText, InputCheckbox } from '../Inputs';
import Button from '../Button';
import options from '../../utils/getOptionsToast';
import useGetStateNetwork from '../../hooks/useGetStateNetwork';

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.users);
  const [errorNetworkInput, setErrorNetworkInput] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const isOnline = useGetStateNetwork();


  const fieldsInputs = [
    {
      name: 'username',
      validate: {
        required: 'The username field must be filled in',
        minLength: {
          value: 3,
          message: 'username must be at least 3 characters'
        },
        maxLength: {
          value: 20,
          message: 'username must contain no more than 20 characters'
        }
      }
    },
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
          message: 'password must be at least 6 characters'
        },
        maxLength: {
          value: 40,
          message: 'password must contain no more than 40 characters'
        },
        validate: (value, e) => {
          const password = e?.repeatPassword;
          return password === value || 'Passwords don`t match';
        }
      }
    },
    {
      name: 'repeatPassword',
      validate: {
        required: 'The repeat password field must be filled in',
        minLength: {
          value: 6,
          message: 'Repeat password must be at least 6 characters'
        },
        maxLength: {
          value: 40,
          message: 'Repeat password must contain no more than 40 characters'
        },
        validate: (value, e) => {
          const password = e?.password;
          return password === value || 'Passwords don`t match';
        }
      }
    },
    {
      name: 'isUsesPersonalData',
      validate: {
        required: 'The check mark should be in the field'
      }
    }
  ];

  const onSubmit = async (data) => {
    if (!isOnline) {
      toast.error('Not network!!!', options);
    } else {
      setDisabled(true);
      dispatch(registerUser({ ...data }));
    }
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
      toast.success('You have successfully registered', options);
      setTimeout(() => {
        navigate('/articles');
        dispatch(clearStatusAndErrors());
      }, 500);
      setDisabled(false);
    }
    
    if (status === 'failed') {
      const errorNetwork = Object.keys(error.errorsValue).map((item) => {
        const name = item;
        const message = error.errorsValue[item];
        return {
          [name]: message
        }
      });
      setErrorNetworkInput(errorNetwork);
      dispatch(clearStatusAndErrors());
      setDisabled(false);
    }
  }, [status, error]);

  return (
    <div className={styles['wrapper-form']}>
      <Form
        title='Create new account'
        error={errorNetworkInput}
        fn={onSubmit}>
        <InputText
          type='text'
          placeholder='Username'
          label='Username'
          name='username'
          validateRules={getValidateRules(fieldsInputs, 'username')}
        />
        <InputText
          type='text'
          placeholder='Email'
          label='Email'
          name='email'
          validateRules={getValidateRules(fieldsInputs, 'email')}
        />
        <InputText
          type='password'
          placeholder='Password'
          label='Password'
          name='password'
          validateRules={getValidateRules(fieldsInputs, 'password')}
        />
        <InputText
          type='password'
          placeholder='Repeat Password'
          label='Repeat Password'
          name='repeatPassword'
          validateRules={getValidateRules(fieldsInputs, 'repeatPassword')}
        />
        <div className={styles.borderCheckbox}>
          <InputCheckbox
            name='isUsesPersonalData'
            validateRules={getValidateRules(fieldsInputs, 'isUsesPersonalData')}
          />
        </div>
        <Button
          label='Create'
          disabled={disabled}
          type='submit'
        />
        <span className={styles['form-span']}>
          Already have an account?
          <Link
            className={styles['form-span-link']}
            to='/sign-in'>
            Sign In
          </Link>
        </span>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Registration;
