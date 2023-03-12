import React from 'react';
import styles from './TagList.module.scss';

const TagList = ({ data }) => {
  const r = (Math.random() + 1).toString(36).substring(8);
  const uniqTags = Array.from(new Set(data));
  const tagList = uniqTags.length ? (
    <ul className={styles['tags-list']}>
      {uniqTags.map(
        (el) =>
          el !== '' && (
            <i
              key={`${el}_${r}`}
              className={styles['tags-list__item']}>
              {el}
            </i>
          )
      )}
    </ul>
  ) : null;

  return tagList;
};

export default TagList;
