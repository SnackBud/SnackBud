const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const pushNotify = require('../emitter');
const getPhotosByAlbumId = require('./index');

jest.mock('./axiosConfig', () => {
    return {
        baseURL: 'https://./event',
        request: jest.fn().mockResolvedValue({
            data: [
                {
                    albumId: 3,
                    id: 101,
                    title: 'incidunt alias vel enim',
                    url: 'https://via.placeholder.com/600/e743b',
                    thumbnailUrl: 'https://via.placeholder.com/150/e743b'
                },
                {
                    albumId: 3,
                    id: 102,
                    title: 'eaque iste corporis tempora vero distinctio consequuntur nisi nesciunt',
                    url: 'https://via.placeholder.com/600/a393af',
                    thumbnailUrl: 'https://via.placeholder.com/150/a393af'
                },
                {
                    albumId: 3,
                    id: 103,
                    title: 'et eius nisi in ut reprehenderit labore eum',
                    url: 'https://via.placeholder.com/600/35cedf',
                    thumbnailUrl: 'https://via.placeholder.com/150/35cedf'
                }
            ]
        }),
    }
});
