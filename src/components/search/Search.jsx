import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../http/api';

const Search = ({ searchKey, setSearchKey, searchEndPoint, cancelEndPoint, setLoading, setList, setCurrPage, setTotalPages }) => {
  const [cancelSearch, setCancelSearch] = useState(false);

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setCancelSearch(true);

      const response = await API.get(`${searchEndPoint}?search=${searchKey}`);

      if (response?.status === 200) {
        setList(response?.data?.data);
        setCurrPage(response?.data.current_page);
        setTotalPages(response?.data.last_page);
      } else {
        toast.error(response?.message);
        console.error('Error while searching:', response?.message);
      }
    } catch (error) {
      console.error("Something went wrong!", error.message);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setSearchKey('');
      setCancelSearch(false);

      const response = await API.get(cancelEndPoint);

      if (response?.status === 200) {
        setList(response?.data?.data);
        setCurrPage(response?.data?.current_page);
        setTotalPages(response?.data?.last_page);
      } else {
        toast.error(response?.message);
        console.error('Error cancelling search:', response?.message);
      }
    } catch (error) {
      console.error("Something went wrong!", error.message);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-sm-flex">
      <div className="me-3 mb-3 mb-sm-0 d-flex">
        <input
          className="form-control me-2"
          type="text"
          placeholder="Search"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value.trimStart())}
        />
        {cancelSearch && (
          <button
            type="button"
            className="btn btn-primary mx-1"
            onClick={handleCancel}
          >
            <i className="ri-close-line" />
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary mx-1"
          disabled={searchKey === ''}
          onClick={handleSearch}
          title='Search'
        >
          <i className="ri-search-line" />
        </button>
      </div>
    </div>
  );
};

export default Search;
