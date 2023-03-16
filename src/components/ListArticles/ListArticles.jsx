import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pagination, Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { setCurrentPage } from '../../store/articleSlice';
import styles from './ListArticles.module.scss';
import ArticlesItem from '../ArticlesItem';
import useGetStateNetwork from '../../hooks/useGetStateNetwork';
import options from '../../utils/getOptionsToast';

const ListArticles = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(null);
  const { articles, isLoading, totalCountPages, currentPage, perPage, error } = useSelector((state) => state.articles);
  const countPages = Math.ceil(totalCountPages / perPage);
  const isOnline = useGetStateNetwork();

  useEffect(() => {
    if (error.isError) {
      setErrors(error.errorValues.message);
    }
  }, [error]);

  return (
    <div className={styles.wrapper}>
      {errors && !isLoading && <div className={styles.error}>{errors}</div>}
      {isLoading ? <Spin size='large' /> : null}
      {!errors && !isLoading
        ? articles.map((item) => (
            <ArticlesItem
              key={item.slug}
              data={item}
            />
          ))
        : null}
      {!errors && !isLoading ? (
        <Pagination
          className={styles.pagination}
          defaultCurrent={currentPage === 0 ? 1 : currentPage + 1}
          total={countPages * 10}
          onChange={(numberPage) => !isOnline ? toast.error('Not network!!!', options) : dispatch(setCurrentPage(numberPage - 1))}
          showSizeChanger={false}
        />
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default ListArticles;
