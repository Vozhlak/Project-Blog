import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import authorImg from '../../assets/img-author.svg';
import { logout } from '../../store/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuth } = useSelector((state) => state.users);
  const { username, image } = user;
  const avatar = image || authorImg;

  const logoutFn = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  return (
    <header className={styles.wrapper}>
      <h1 className={styles['header-logo']}>
        <Link
          className={styles['link-logo']}
          to='/'>
          Realworld Blog
        </Link>
      </h1>
      {isAuth ? (
        <div className={styles['auth-user']}>
          <Link
            className={styles['link-create-article']}
            to='/new-article'>
            Create article
          </Link>
          <div className={styles.author}>
            <Link
              className={styles.username}
              to='/profile'>
              {username}
            </Link>
            <img
              className={styles.avatar}
              src={avatar}
              alt={avatar}
            />
          </div>
          <button
            className={styles['btn-logout']}
            type='button'
            onClick={logoutFn}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link
            className={styles.link}
            to='sign-in'>
            Sign In
          </Link>
          <Link
            className={`${styles.link} ${styles.link__signup}`}
            to='sign-up'>
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
