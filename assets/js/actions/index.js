import { getData, postData } from '../utils';
import {
  API_URL, FETCH_TWEETS, FETCH_USERS, FETCH_TWEET,
  FETCH_TOKEN, SUBMIT_USER, FETCH_REPLIES, FETCH_USERNAMES,
  FETCH_HASHTAGS,
} from '../constants';


export function fetchTweets(querystring) {
  let url = `${API_URL}tweets/`;

  if (querystring) {
    url = `${url}?${querystring}`;
  }

  const request = getData(url);

  return {
    type: FETCH_TWEETS,
    payload: request,
  };
}


export function fetchUsers() {
  const request = getData(`${API_URL}users/`);

  return {
    type: FETCH_USERS,
    payload: request,
  };
}

export function fetchTweet(tweetId) {
  const request = getData(`${API_URL}tweet/${tweetId}/`);

  return {
    type: FETCH_TWEET,
    payload: request,
  };
}

export function fetchToken() {
  const request = getData(`${API_URL}token/`);

  return {
    type: FETCH_TOKEN,
    payload: request,
  };
}

export function submitUser(data, token, callback) {
  const request = postData(
    `${API_URL}users/`, data, token
  ).then(
    () => {
      callback();
    }
  );

  return {
    type: SUBMIT_USER,
    payload: request,
  };
}

export function replyTweet(tweetId, data, token, callback) {
  const request = postData(
    `${API_URL}reply/${tweetId}/`, data, token
  ).then(
    () => {
      callback();
    }
  );

  return {
    type: SUBMIT_USER,
    payload: request,
  };
}

export function fetchReplies(tweetId) {
  const request = getData(`${API_URL}replies/${tweetId}/`);

  return {
    type: FETCH_REPLIES,
    payload: request,
  };
}

export function fetchUsernames() {
  const request = getData(`${API_URL}usernames/`);

  return {
    type: FETCH_USERNAMES,
    payload: request,
  };
}

export function fetchHashtags() {
  const request = getData(`${API_URL}hashtags/`);

  return {
    type: FETCH_HASHTAGS,
    payload: request,
  };
}
