import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { Spin } from 'antd';
import Form from '../Form';
import { InputText } from '../Inputs';
import Button from '../Button';
import { updateProfile, clearStatusAndErrors } from '../../store/userSlice';
import options from '../../utils/getOptionsToast';
import useGetStateNetwork from '../../hooks/useGetStateNetwork';

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.users);
  const [disabled, setDisabled] = useState(false);
  const isOnline = useGetStateNetwork();

  const textFields = {
    username: {
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
    email: {
      validate: {
        required: 'The email field must be filled in',
        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Incorrect email' }
      }
    },
    newPassword: {
      validate: {
        minLength: {
          value: 6,
          message: 'New password must be at least 6 characters'
        },
        maxLength: {
          value: 40,
          message: 'New password must contain no more than 40 characters'
        }
      }
    },
    imageUrl: {
      validate: {
        pattern: {
          value: /^(http|https):\/\/[^ "]+$/,
          message: 'Incorrect URL image'
        }
      }
    }
  };

  const onSubmit = (data) => {
    if (!isOnline) {
      toast.error('Not network!!!', options);
    } else {
      setDisabled(true);
      if (!data.newPassword) {
        const { newPassword, ...newData } = data;
        dispatch(updateProfile(newData));
      } else {
        dispatch(updateProfile(data));
      }
    }
  };

  useEffect(() => {
    if (status === 'success') {
      toast.success('Your profile has been successfully updated', options);
      dispatch(clearStatusAndErrors());
      setDisabled(false);
    }

    if (status === 'failed') {
      Object.keys(error.errorsValue).forEach((item) => {
        const name = item;
        const message = error.errorsValue[item];
        toast.error(`${name}: ${message}`, options);
      });
      dispatch(clearStatusAndErrors());
      setDisabled(false);
    }
  }, [status, error]);

  return !user ? (
    <Spin
      size='large'
      style={{
        display: 'block',
        margin: '0 auto',
        marginTop: '50px'
      }}
    />
  ) : (
    <>
      <Form
        title='Edite Profile'
        fn={onSubmit}>
        <InputText
          defaultValue={user.username}
          type='text'
          name='username'
          label='Username'
          placeholder='Username'
          validateRules={textFields.username.validate}
        />
        <InputText
          defaultValue={user.email}
          type='text'
          name='email'
          label='Email'
          placeholder='Email'
          validateRules={textFields.email.validate}
        />
        <InputText
          type='password'
          name='newPassword'
          label='New Password'
          placeholder='New Password'
          validateRules={textFields.newPassword.validate}
        />
        <InputText
          defaultValue={user.image}
          type='text'
          name='avatarImg'
          label='Avatar image (url)'
          placeholder='Avatar image'
          validateRules={textFields.imageUrl.validate}
        />
        <Button label='Save' disabled={disabled} />
      </Form>
      <ToastContainer />
    </>
  );
};

export default EditProfile;
