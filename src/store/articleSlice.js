import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_API = 'https://blog.kata.academy/api/articles';

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (perPage = 0, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${BASE_API}/?offset=${perPage * 20}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        return dispatch(setPosts(response.data));
      }
      return rejectWithValue(response);
    } catch (e) {
      return rejectWithValue(e.response.data.errors);
    }
  }
);

export const createArticle = createAsyncThunk('articles/createArticle', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(
      `${BASE_API}/`,
      {
        article: { ...data }
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
    if (response.status === 200) {
      return dispatch(addPost(response.data));
    }
    return rejectWithValue(response);
  } catch (e) {
    return rejectWithValue(e.response.data.errors);
  }
});

export const editArticle = createAsyncThunk(
  'articles/editArticle',
  async ({ slug, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `${BASE_API}/${slug}`,
        {
          article: { ...data }
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.status === 200) {
        return dispatch(editPost(response.data));
      }
      return rejectWithValue(response.data.errors);
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (slug, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.delete(`${BASE_API}/${slug}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (response.status === 204 || response.status === 200) {
      return dispatch(deletePost(slug));
    }
    return rejectWithValue(response);
  } catch (e) {
    return rejectWithValue(e.response.data.errors);
  }
});

export const isLikedArticle = createAsyncThunk(
  'articles/isLikedArticle',
  async (data, { rejectWithValue, dispatch }) => {
    const { isLiked, slug } = data;
    if (!isLiked) {
      try {
        const response = await axios.post(
          `${BASE_API}/${slug}/favorite`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.status === 200) {
          return dispatch(isLikedPost(response.data));
        }
        return rejectWithValue(response);
      } catch (e) {
        return rejectWithValue(e.response.data.errors);
      }
    } else {
      try {
        const response = await axios.delete(`${BASE_API}/${slug}/favorite`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 200) {
          return dispatch(isLikedPost(response.data));
        }
        return rejectWithValue(response);
      } catch (e) {
        return rejectWithValue(e.response.data.errors);
      }
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    currentPage: 0,
    perPage: 20,
    totalCountPages: 0,
    isLoading: true,
    status: '',
    error: {
      isError: false,
      errorValues: null
    }
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPosts: (state, action) => {
      state.articles = action.payload.articles;
      state.totalCountPages = action.payload.articlesCount;
    },
    addPost: (state, action) => {
      state.articles.unshift(action.payload.article);
      localStorage.setItem('slug', action.payload.article.slug);
    },
    editPost: (state, action) => {
      const { article } = action.payload;
      state.articles = state.articles.map((item) => (item.slug === article.slug ? { ...item, ...article } : item));
    },
    deletePost: (state, action) => {
      state.articles = state.articles.filter((item) => item.slug !== action.payload);
    },
    isLikedPost: (state, action) => {
      const { article } = action.payload;
      state.articles = state.articles.map((item) => (item.slug === article.slug ? { ...item, ...article } : item));
    },
    clearStatusAndError(state) {
      state.status = '';
      state.error = {
        isError: false,
        errorValues: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArticles.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error.isError = true;
        state.error.errorValues = action.payload;
      });

    builder
      .addCase(createArticle.pending, () => {})
      .addCase(createArticle.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error.isError = true;
        state.error.errorValues = action.payload;
      });
    builder
      .addCase(editArticle.pending, () => {})
      .addCase(editArticle.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(editArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error.isError = true;
        state.error.errorValues = action.payload;
      });
    builder
      .addCase(deleteArticle.pending, () => {})
      .addCase(deleteArticle.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error.isError = true;
        state.error.errorValues = action.payload;
      });
    builder
      .addCase(isLikedArticle.pending, () => {})
      .addCase(isLikedArticle.rejected, (state, action) => {
        state.error.isError = true;
        state.error.errorValues = action.payload;
      });
  }
});

export const { setCurrentPage, setPosts, addPost, editPost, deletePost, isLikedPost, clearStatusAndError } =
  articleSlice.actions;
export default articleSlice.reducer;
