import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import axios from 'axios';
import { Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import styles from './Article.module.scss';
import Like from '../Like';
import TagList from '../TagList/TagList';
import { deleteArticle, clearStatusAndError } from '../../store/articleSlice';
import useGetStateNetwork from '../../hooks/useGetStateNetwork';
import options from '../../utils/getOptionsToast';

const Article = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, status, error } = useSelector((state) => state.articles);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDialog, setIsOpenisOpenDialog] = useState(false);
  const [article, setArticle] = useState({});
  const [disabled, setDisabled] = useState(false);
  const isOnline = useGetStateNetwork();

  const onDeleteArticle = (urlArticle) => {
    if (!isOnline) {
      toast.error('Not network!!!', options);
    } else {
      setDisabled(true);
      dispatch(deleteArticle(urlArticle));
    }
  };

  const getItemArticle = (data) => {
    if (data) {
      setArticle({
        author: {
          username: data.author.username,
          avatar: data.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
        },
        slug: data.slug,
        title: data.title,
        description: data.description,
        body: data.body,
        tags: data.tagList,
        favorited: data.favorited,
        countFavorites: data.favoritesCount,
        dateCreate: format(new Date(data?.createdAt), 'MMMM d, yyyy')
      });
    }
  }

  useEffect(() => {
    const getArticle = async () => {
      try {
        const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        });
        if (response.status === 200) {
          getItemArticle(response.data.article);
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log('error', e);
      }
    };

    getArticle();
  }, [articles]);

  useEffect(() => {
    if (status === 'success') {
      navigate('/articles');
      dispatch(clearStatusAndError());
      setDisabled(false);
    }

    if (status === 'failed') {
      dispatch(clearStatusAndError());
      setDisabled(false);
    }
  }, [status, error]);

  return isLoading ? (
    <Spin
      className={styles.spin}
      size='large'
    />
  ) : (
    <>
      <div className={styles['wrap-page']}>
        <div className={styles['wrapper-author']}>
          <div className={styles['wrapper-info']}>
            <span className={styles.nameAuthor}>{article.author.username}</span>
            <span className={styles.dateCreate}>{article.dateCreate}</span>
          </div>
          <img
            className={styles.avatar}
            src={article.author.avatar}
            alt={article.author.avatar}
            onLoad={(e) => {
              e.target.src = 'https://static.productionready.io/images/smiley-cyrus.jpg';
            }}
            onError={(e) => {
              e.target.src = 'https://static.productionready.io/images/smiley-cyrus.jpg';
            }}
          />
        </div>
        <div className={styles['title-and-like']}>
          <h1 className={styles.title}>{article.title}</h1>
          <span className={styles.like}>
            <Like
              favoritesCount={article.countFavorites}
              isFavorite={article.favorited}
              slug={slug}
            />
          </span>
        </div>
        <TagList data={article.tags} />
        <div className={styles.wrapBtnAndDesc}>
          <p className={styles.description}>{article.description}</p>
          {article.author.username === localStorage.getItem('username') && (
            <div className={styles.wrapBtn}>
              <button
                className={`${styles.btn} ${styles.delete}`}
                type='button'
                onClick={() => setIsOpenisOpenDialog((isOpen) => !isOpen)}>
                Delete
              </button>
              <dialog className={`${isOpenDialog ? styles.dialog : styles.dialogHidden}`}>
                <span>Are you sure to delete this article?</span>
                <div className={`${styles.wrapBtnDialog}`}>
                  <button
                    className={styles.btnDialog}
                    type='button'
                    onClick={() => setIsOpenisOpenDialog((isOpen) => !isOpen)}>
                    No
                  </button>
                  <button
                    className={styles.btnDialog}
                    type='button'
                    disabled={disabled}
                    onClick={() => onDeleteArticle(slug)}>
                    Yes
                  </button>
                </div>
              </dialog>
              <Link
                className={`${styles.btn} ${styles.edit}`}
                to={`/articles/${slug}/edit`}>
                Update
              </Link>
            </div>
          )}
        </div>
        <div className={styles['article-body']}>
          <ReactMarkdown className={styles.body}>{article.body}</ReactMarkdown>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Article;
