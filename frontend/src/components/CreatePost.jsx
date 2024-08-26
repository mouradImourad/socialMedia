import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('content', content);
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);

        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:8000/api/v1/posts/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setMessage({ type: 'success', text: 'Post created successfully!' });
            setContent('');
            setImage(null);
            setVideo(null);
        } catch (error) {
            console.error('Error creating post', error);
            setMessage({ type: 'danger', text: 'Failed to create post. Please try again.' });
        }
    };

    return (
        <Container className="mt-5">
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="content">
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                </Form.Group>
                
                <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </Form.Group>

                <Form.Group controlId="video">
                    <Form.Label>Video</Form.Label>
                    <Form.Control type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Create Post
                </Button>
            </Form>
        </Container>
    );
};

export default CreatePost;
