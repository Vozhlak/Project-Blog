import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import styles from './App.module.scss';
import ListArticles from '../ListArticles';
import { fetchArticles } from '../../store/articleSlice';
import ArticleSinglePage from '../Article/Article';
import { Registration, Login } from '../Authorization';
import { auth } from '../../store/userSlice';
import Layout from '../Layout';
import EditProfile from '../EditProfile';
import CreateArticleAndEdit from '../CreateAndEditArticle';
import useGetStateNetwork from '../../hooks/useGetStateNetwork';

function App() {
  const dispatch = useDispatch();

  const { currentPage } = useSelector((state) => state.articles);
  const { isAuth } = useSelector((state) => state.users);
  const isOnline = useGetStateNetwork();

  useEffect(() => {
    if (isAuth) {
      dispatch(auth());
    }

    if (isOnline) {
      dispatch(fetchArticles(currentPage));
    }
  }, [currentPage, isAuth]);

  return (
    <div className={styles.wrapper}>
      <Routes>
        <Route
          path='/'
          element={<Layout />}>
          <Route
            index
            element={<ListArticles />}
          />
          <Route
            path='articles'
            element={<ListArticles />}
          />
          <Route
            path='articles/:slug'
            element={<ArticleSinglePage />}
          />
          <Route
            path='sign-up'
            element={!isAuth ? <Registration /> : <Navigate to='/' />}
          />
          <Route
            path='sign-in'
            element={!isAuth ? <Login /> : <Navigate to='/' />}
          />
          <Route
            path='profile'
            element={isAuth ? <EditProfile /> : <Navigate to='/sign-in' />}
          />
          <Route
            path='new-article'
            element={isAuth ? <CreateArticleAndEdit type='create' /> : <Navigate to='/sign-in' />}
          />
          <Route
            path='/articles/:slug/edit'
            element={isAuth ? <CreateArticleAndEdit type='edit' /> : <Navigate to='/sign-in' />}
          />
          <Route
            path='*'
            element={<PageNotFound />}
          />
        </Route>
      </Routes>
    </div>
  );
}

const PageNotFound = () => <div>Page not found</div>;

export default App;
