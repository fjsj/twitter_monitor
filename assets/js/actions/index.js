import axios from 'axios';

import { API_URL, FETCH_TWEETS, FETCH_USERS } from '../constants';


export function fetchTweets() {
  const request = axios.get(`${API_URL}tweets/`);

  return {
    type: FETCH_TWEETS,
    payload: request,
  };
}


export function fetchUsers() {
  const request = axios.get(`${API_URL}users/`);

  return {
    type: FETCH_USERS,
    payload: request,
  };
}