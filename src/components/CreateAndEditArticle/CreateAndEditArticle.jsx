import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { Spin } from 'antd';
import styles from './CreateAndEditArticle.module.scss';
import Form from '../Form';
import { InputText, InputTextarea } from '../Inputs';
import Button from '../Button';
import TagsList from '../CreateTagsList/TagsList';
import { createArticle, editArticle, clearStatusAndError } from '../../store/articleSlice';
import options from '../../utils/getOptionsToast';
import useGetStateNetwork from '../../hooks/useGetStateNetwork';

const CreateArticle = ({ type }) => {
  const { slug } = useParams();
  const { articles, error, status } = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const editArt = type === 'edit' ? articles.find((item) => item.slug === slug) : null;
  const username = editArt?.author?.username;
  const isOnline = useGetStateNetwork();


  const validateRules = {
    title: {
      validate: {
        required: 'The title field must be filled in'
      }
    },
    description: {
      validate: {
        required: 'The description field must be filled in'
      }
    },
    body: {
      validate: {
        required: 'The body field must be filled in'
      }
    }
  };

  const getTags = (arrTags) => {
    const tagsValue = arrTags.map((item) => item.tag);
    setTags(tagsValue);
  };

  const onSubmit = (data) => {
    if (!isOnline) {
      toast.error('Not network!!!', options);
    } else {
      setDisabled(true);
      const markdown = <ReactMarkdown>{data.body}</ReactMarkdown>;
      if (type === 'create') {
        if (tags.length > 0) {
          dispatch(
            createArticle({
              ...data,
              body: markdown.props.children,
              tagList: tags
            })
          );
        } else {
          dispatch(createArticle({ ...data, body: markdown.props.children }));
        }
      }
  
      if (type === 'edit') {
        if (tags.length > 0) {
          dispatch(
            editArticle({
              slug,
              data: { ...data, body: markdown.props.children, tagList: tags }
            })
          );
        } else {
          dispatch(
            editArticle({
              slug,
              data: { ...data, body: markdown.props.children }
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    if (status === 'success' && type === 'create') {
      toast.success('You have successfully created the article', options);
      setTimeout(() => {
        navigate(`/articles/${localStorage.getItem('slug')}`);
        dispatch(clearStatusAndError());
        localStorage.removeItem('slug');
      }, 1000);
      setDisabled(false);
    }

    if (status === 'success' && type === 'edit') {
      toast.success('You have successfully updated the article', options);
      setTimeout(() => {
        navigate(`/articles/${slug}`);
        dispatch(clearStatusAndError());
      }, 1000);
      setDisabled(false);
    }

    if (status === 'failed') {
      toast.error(error.errorValues, options);
      setTimeout(() => {
        dispatch(clearStatusAndError());
      }, 800);
      setDisabled(false);
    }

    if (type === 'edit' && username) {
      if (username !== localStorage.getItem('username')) {
        navigate(`/articles/${slug}`);
      }
    }
    
  }, [status, error, type, editArt]);

  return !editArt && type === 'edit' ? (
    <Spin
      className={styles.spin}
      size='large'
    />
  ) : (
    <div className={styles.wrapFormCreateArticle}>
      <Form
        title={`${type === 'edit' ? 'Edit article' : 'Create new article'}`}
        fn={onSubmit}
        customStyles={styles.wrapForm.toString()}>
        <InputText
          type='text'
          label='Title'
          placeholder='Title'
          name='title'
          defaultValue={editArt?.title}
          validateRules={validateRules.title.validate}
        />
        <InputText
          type='text'
          label='Short description'
          placeholder='Short description'
          name='description'
          defaultValue={editArt?.description}
          validateRules={validateRules.description.validate}
        />
        <InputTextarea
          label='Text'
          name='body'
          placeholder='Text'
          defaultValue={editArt?.body}
          validateRules={validateRules.body.validate}
        />
        <TagsList
          getTags={getTags}
          tags={editArt?.tagList}
        />
        <div className={styles.wrapBtn}>
          <Button label='Send' disabled={disabled} />
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default CreateArticle;
