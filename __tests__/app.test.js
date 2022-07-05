const app = require("../app");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const connection = require("../db/connection");
const request = require("supertest");

afterAll(() => {
  if (connection.end) connection.end();
});

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

describe("3- GET /api/topics", () => {
  test("status:200, responds with an array of topics objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toEqual([
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" },
        ]);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test("404 - handles bad path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad path");
      });
  });
});

describe("04 GET /api/articles/:article_id", () => {
  test("200 - returns article object with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("200 - different id number - returns article object with correct properties", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test("200 - different id number - specific article returned", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: "mitch",
            author: "butter_bridge",
            body: "Well? Think about it.",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
          })
        );
      });
  });

  test("404 - handles bad path", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article 99999 - does not exist");
      });
  });

  test("400 - handles bad path", () => {
    return request(app)
      .get("/api/articles/invalid_path")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid - article must be a number");
      });
  });
});

describe("6- GET /api/users", () => {
  test("200, responds with an array of users objects with useranme, name and avatar_url props", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toEqual([
          {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ]);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  test("404 - handles bad path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad path");
      });
  });
});
