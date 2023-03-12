import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Spin } from 'antd';
import styles from './Article.module.scss';
import Like from '../Like';
import TagList from '../TagList/TagList';
import { deleteArticle, clearStatusAndError } from '../../store/articleSlice';

const Article = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, status, error } = useSelector((state) => state.articles);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDialog, setIsOpenisOpenDialog] = useState(false);
  const [article, setArticle] = useState({});

  const onDeleteArticle = (urlArticle) => {
    dispatch(deleteArticle(urlArticle));
  };

  useEffect(() => {
    const getArticle = async () => {
      try {
        const dataArticle = await articles.find((item) => item.slug === slug);
        if (dataArticle) {
          setArticle({
            author: {
              username: dataArticle.author.username,
              avatar: dataArticle.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
            },
            slug: dataArticle.slug,
            title: dataArticle.title,
            description: dataArticle.description,
            body: dataArticle.body,
            tags: dataArticle.tagList,
            favorited: dataArticle.favorited,
            countFavorites: dataArticle.favoritesCount,
            dateCreate: format(new Date(dataArticle?.createdAt), 'MMMM d, yyyy')
          });
          setIsLoading(false);
        }
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
    }

    if (status === 'failed') {
      dispatch(clearStatusAndError());
    }
  }, [status, error]);

  return isLoading ? (
    <Spin
      className={styles.spin}
      size='large'
    />
  ) : (
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
  );
};

export default Article;
