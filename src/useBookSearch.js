import { useState, useEffect } from 'react';
import axios from 'axios';

const useBookSearch = (query, pageNumber) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    let cancel;

    setLoading(true);
    setError(false);

    axios
      .get('http://openlibrary.org/search.json', {
        params: { q: query, page: pageNumber },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then(({ data }) => {
        setBooks((prevBooks) => {
          // return [...prevBooks, ...data.docs.map((b) => b.title)];
          return [...new Set([...prevBooks, ...data.docs.map((b) => b.title)])];
        });

        setHasMore(data.docs.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        setError(true);
      });

    return () => {
      cancel();
    };
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
