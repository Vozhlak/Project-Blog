import { useDispatch, useSelector } from 'react-redux';
import styles from './Like.module.scss';
import { ReactComponent as LikeSVG } from '../../assets/like.svg';
import { isLikedArticle } from '../../store/articleSlice';

const Like = ({ favoritesCount, isFavorite, slug }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.users);

  const onLiked = (urlArticle) => {
    dispatch(isLikedArticle({ isLiked: isFavorite, slug: urlArticle }));
  };

  const classes = () => {
    if (isAuth) {
      return isFavorite ? styles.like : `${styles.nolike} ${styles.auth}`;
    }
    return styles.nolike;
  };

  return (
    <>
      <button
        className={styles.btn}
        type='button'
        onClick={() => onLiked(slug)}
        disabled={!isAuth}>
        <LikeSVG className={classes()} />
      </button>
      {favoritesCount}
    </>
  );
};

export default Like;
