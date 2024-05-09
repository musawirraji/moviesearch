import React from 'react';

function useKey() {
  useEffect(() => {
    function callback(e) {
      if (e.code === 'Escape') {
        onCloseMovie();
      }
    }
    document.addEventListener('keydown', callback);

    return function () {
      document.removeEventListener('keydown', callback);
    };
  }, [onCloseMovie]);
}

export default useKey;
