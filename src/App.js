import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

const App = () => {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      console.log('node', node);
      if (loading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entires) => {
        console.log(entires);
        if (entires[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input value={query} type='text' onChange={handleSearch} />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        }
        return <div key={book}>{book}</div>;
      })}
      <div>{loading && 'loading...'}</div>
      <div>{error && 'error occurred'}</div>
    </>
  );
};

export default App;
