const axios = require('axios');
const config = require('../config/config.json');
const ResponseFormat = require('../utils/responseFormat');

function averageNumberOfLikes(posts) {
  console.log(posts.length === 0);
  if (posts.length === 0) {
    return 'No post found';
  }
  let likesCount = 0;
  for (let i = 0; i < posts.length; i += 1) {
    likesCount += posts[i].likes.count;
  }
  return Math.round((likesCount / posts.length) * 1000) / 1000;
}

async function getInfos(res, accessToken, duration) {
  let data = {};
  const posts = [];
  const url = `${config.api.url}/self/media/recent/?access_token=${accessToken}&count=-1`;
  try {
    const response = await axios.get(url);
    data = response.data;
  } catch (e) {
    console.log(e);
  }

  let currentPosts = data.data;

  while (Object.keys(data.pagination).length !== 0) {
    for (let i = 0; i < currentPosts.length; i += 1) {
      const now = Date.now() / 1000;
      if ((now - currentPosts[i].created_time) > duration) {
        console.log('LONGER THAN 2 MONTHS');
        return averageNumberOfLikes(posts);
      }
      posts.push(currentPosts[i]);
      if (currentPosts.length < 20 && i === currentPosts.length - 1) {
        return averageNumberOfLikes(posts);
      }
    }
    try {
      const params = { max_id: data.pagination.next_max_id };
      const response = await axios.get(`${config.api.url}/self/media/recent/?access_token=${accessToken}`, { params });
      data = response.data;
    } catch (e) {
      console.log(e);
    }
    currentPosts = data.data;
  }
  // for the last round, when there are less than 20 posts left
  for (let i = 0; i <= currentPosts.length; i += 1) {
    const now = Date.now() / 1000;
    if ((now - currentPosts[i].created_time) > duration) {
      console.log('LONGER THAN 2 MONTHS');
      return averageNumberOfLikes(posts);
    }
    posts.push(currentPosts[i]);
    if (currentPosts.length < 20 && i === currentPosts.length - 1) {
      console.log('GOT TO THE LAST POST');
      return averageNumberOfLikes(posts);
    }
  }
  return new ResponseFormat(res).success(posts).send();
}

module.exports = {
  getInfos
};
