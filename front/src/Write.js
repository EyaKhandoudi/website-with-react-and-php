import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, TextareaAutosize, Select, MenuItem } from '@mui/material';

function Write({ user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [postId, setPostId] = useState(null); // To store the current post ID for updates

  useEffect(() => {
    // Optionally load existing post data if editing an existing post
    const fetchPost = async () => {
      const response = await axios.get('http://localhost:8000/api/posts/1'); // Adjust the URL to fetch the post
      const post = response.data;
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setPostId(post.id);
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = { title, content, category, user_id: user.id };

    if (postId) {
      // Update existing post
      axios.put('http://localhost:8000/api/posts', { ...postData, post_id: postId })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('There was an error updating the post!', error);
        });
    } else {
      // Create new post
      axios.post('http://localhost:8000/api/posts', postData)
        .then(response => {
          console.log(response.data);
          setPostId(response.data.id); // Set the post ID after creation
        })
        .catch(error => {
          console.error('There was an error creating the post!', error);
        });
    }
  };

  const handleUpdate = () => {
    const postData = { title, content, category, user_id: user.id, post_id: postId };
    axios.put('http://localhost:8000/api/posts', postData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error updating the post!', error);
      });
  };

  const handleDelete = () => {
    axios.delete('http://localhost:8000/api/posts', { data: { post_id: postId, user_id: user.id } })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error deleting the post!', error);
      });
  };

  return (
    <div>
      <h1>{postId ? 'Edit Post' : 'Create New Post'}</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextareaAutosize
          minRows={5}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', margin: '16px 0' }}
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
          fullWidth
          margin="normal"
        >
          <MenuItem value="" disabled>
            Category
          </MenuItem>
          <MenuItem value="art">Art</MenuItem>
          <MenuItem value="science">Science</MenuItem>
          {/* Add more categories as needed */}
        </Select>
        <Button type="submit" variant="contained" color="primary">
          {postId ? 'Update' : 'Submit'}
        </Button>
      </form>
      {user.role === 'admin' && postId && (
        <div>
          <Button onClick={handleUpdate} variant="contained" color="secondary">
            Update
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default Write;
