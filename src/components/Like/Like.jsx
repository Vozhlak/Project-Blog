import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './Like.module.scss';
import { ReactComponent as LikeSVG } from '../../assets/like.svg';
import { isLikedArticle } from '../../store/articleSlice';
import useGetStateNetwork from '../../hooks/useGetStateNetwork'
import options from '../../utils/getOptionsToast';

const Like = ({ favoritesCount, isFavorite, slug }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.users);
  const {status, error} = useSelector(state => state.articles);
  const [disabled, setDisabled] = useState(false);
  const isOnline = useGetStateNetwork();

  const onLiked = (urlArticle) => {
    if (!isOnline) {
      toast.error('Not newtwork!!!', options);
    } else {
      setDisabled(true);
      dispatch(isLikedArticle({ isLiked: isFavorite, slug: urlArticle }));
    }
  };

  const classes = () => {
    if (isAuth) {
      return isFavorite ? styles.like : `${styles.nolike} ${styles.auth}`;
    }
    return styles.nolike;
  };

  useEffect(() => {
    setDisabled(false);
  }, [status, error, isFavorite])

  return (
    <>
      <button
        className={styles.btn}
        type='button'
        onClick={() => onLiked(slug)}
        disabled={!isAuth || disabled}>
        <LikeSVG className={classes()} />
      </button>
      {favoritesCount}
    </>
  );
};

export default Like;
