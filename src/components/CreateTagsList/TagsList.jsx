import React, { useState, useEffect, useRef } from 'react';
import styles from './TagsList.module.scss';

const TagsList = ({ getTags, tags: tagList }) => {
  const [tags, setTags] = useState(
    tagList
      ? tagList.map((item) => ({
          id: Math.floor(Math.random() * 1000 + 1000),
          tag: item
        }))
      : []
  );
  const [tag, setTag] = useState('');
  const inputEl = useRef(null);

  const OnCreateTag = (value) => {
    if (value !== '') {
      const newItem = {
        id: Math.floor(Math.random() * 1000 + 1000),
        tag: value
      };

      if (tags.length > 0) {
        const uniqTag = tags.filter((item) => {
          if (item.tag === newItem.tag) {
            return true;
          }
          return false;
        });

        if (uniqTag.length > 0) {
          setTag('');
          inputEl.current.focus();
          return;
        }

        setTags([...tags, newItem]);
      }

      setTags([...tags, newItem]);
      setTag('');
      inputEl.current.focus();
    }
  };

  const OnDeleteTag = (id) => {
    const newData = tags.filter((item) => item.id !== id);
    setTags(newData);
    return newData;
  };

  const onUpdateTag = (id, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const { value } = e.target;
      if (value !== '') {
        const newData = tags.map((item) => {
          if (item.id === id) {
            item.tag = value;
          }
          return item;
        });
        setTags(newData);
      }
    }
  };

  useEffect(() => {
    if (tags) {
      getTags(tags);
    }
  }, [tags]);

  useEffect(() => {
    if (!tagList) {
      setTags([]);
    }
  }, [tagList]);

  return (
    <div className={styles.wrapTagsList}>
      <span className={styles.title}>Tags</span>
      <ul className={styles.tagsList}>
        {tags.map((item) => (
          <li
            className={styles.item}
            key={item.id}>
            <input
              className={styles.inputTag}
              type='text'
              placeholder='Tag'
              onKeyDown={(e) => onUpdateTag(item.id, e)}
              defaultValue={item.tag}
            />
            <button
              className={`${styles.btn} ${styles.delete}`}
              type='button'
              onClick={() => OnDeleteTag(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.createTags}>
        <input
          className={styles.inputTag}
          type='text'
          placeholder='Tag'
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          ref={inputEl}
        />
        <button
          className={`${styles.btn} ${styles.delete}`}
          type='button'
          onClick={() => {
            setTag('');
            inputEl.current.focus();
          }}>
          Delete
        </button>
        <button
          className={`${styles.btn} ${styles.create}`}
          type='button'
          onClick={() => OnCreateTag(tag)}>
          Add tag
        </button>
      </div>
    </div>
  );
};

export default TagsList;
