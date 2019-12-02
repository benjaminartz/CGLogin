const request = require('supertest')
const app = require('../app')
var fs = require('fs');

const agent = request.agent(app);

const fakeUser = {
    "email": "blah@blah.com",
    "fname": "Someone",
    "lname": "Awesome",
    "password": "test",
    "dance": "Swing",
    "comments": "No comment"
  };

const updateUser = {
    "fname": "Someone",
    "lname": "Else",
    "dance": "Swing",
    "comments": "No comment",
    "password": ""
  };

const updateUserWithPassword = {
    "fname": "Someone",
    "lname": "Else",
    "dance": "Swing",
    "comments": "No comment",
    "password": "newpassword"
  };

const validUser = {
    "email": "blah@blah.com",
    "password": "test"
  };

const invalidUser = {
    "email": "invalid@user.com",
    "password": "test"
  };

const login = async () => {
  const res = await agent
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send(validUser);
}

describe('view profile', () => {
  it('should not be accessible when not logged in', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toEqual(400);
  })
})

describe('update profile', () => {
  it('should not be accessible when not logged in', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Content-Type', 'application/json')
      .send(fakeUser);
    expect(res.statusCode).toEqual(400);
  })
})

describe('logout', () => {
  it('should not be accessible when not logged in', async () => {
    const res = await request(app).get('/api/logout');
    expect(res.statusCode).toEqual(400);
  })
})

describe('create account', () => {
  it('should create an account', async () => {
    const res = await request(app)
      .post('/api/account')
      .set('Content-Type', 'application/json')
      .send(fakeUser)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('success')
    expect(!!res.body.success).toEqual(true)
  })
  it('should fail to create a duplicate account', async () => {
    const res = await request(app)
      .post('/api/account')
      .set('Content-Type', 'application/json')
      .set('Accept', 'text/text')
      .send(fakeUser)
    expect(res.statusCode).toEqual(400)
  })
})

describe('login', () => {
  it('should fail for non-existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(invalidUser);
    expect(res.statusCode).toEqual(400);
  })
  it('should be successful for existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(validUser);
    expect(res.statusCode).toEqual(200);
    expect(res.headers).toHaveProperty('set-cookie');
    expect(res.headers['set-cookie'].length).toBeGreaterThan(0);
    expect(res.headers['set-cookie'][0]).toMatch(/^connect\.sid/);
  })
})

describe('amiloggedin', () => {
  it('should be positive when logged in', async () => {
    await login();
    const res = await agent.get('/api/amiloggedin');
    expect(res.statusCode).toEqual(200);
    expect(!!res.body.success).toEqual(true);
  })
})

describe('view profile', () => {
  it('should get a profile when you\'re logged in', async () => {
    await login();
    const res = await agent.get('/api/profile');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
  })
})

describe('update profile', () => {
  it('should be successful when you\'re logged in', async () => {
    await login();
    const res = await agent.put('/api/profile')
      .set('Content-Type', 'application/json')
      .send(updateUser);
    expect(res.statusCode).toEqual(200);
    expect(!!res.body.success).toEqual(true);
    // make sure it updated
    const res2 = await agent.get('/api/profile');
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.lname).toEqual("Else");
  })
})

describe('logout', () => {
  it('should be successful when you\'re logged in', async () => {
    await login();
    const res = await agent.get('/api/logout')
    expect(res.statusCode).toEqual(200);
  })
})

describe('amiloggedin', () => {
  it('should be negative when not logged in', async () => {
    const res = await request(app).get('/api/amiloggedin');
    expect(res.statusCode).toEqual(200);
    expect(!!res.body.success).toEqual(false);
  })
})

describe('update profile', () => {
  it('should be successful when you\'re logged in and updating your password', async () => {
    await login();
    const res = await agent.put('/api/profile')
      .set('Content-Type', 'application/json')
      .send(updateUserWithPassword);
    expect(res.statusCode).toEqual(200);
    expect(!!res.body.success).toEqual(true);
  })
})

afterAll((done) => {
  fs.unlink(process.env.NODE_ENV + '-db.json', done);
});
