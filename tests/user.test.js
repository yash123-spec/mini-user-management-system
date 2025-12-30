// Basic backend tests using Jest and Supertest
import request from 'supertest';
import app from '../Backend/server.js';

describe('User API', () => {
    it('should return welcome message at root', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Welcome to User Management System API');
    });

    it('should not allow signup with invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ fullName: 'Test', email: 'invalid', password: '123456', confirmPassword: '123456' });
        expect(res.statusCode).toBe(400);
    });

    it('should not allow login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'notfound@example.com', password: 'wrongpass' });
        expect(res.statusCode).toBe(400);
    });

    it('should require auth for /api/users/me', async () => {
        const res = await request(app).get('/api/users/me');
        expect(res.statusCode).toBe(401);
    });

    it('should return 404 for unknown route', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toBe(404);
    });
});
