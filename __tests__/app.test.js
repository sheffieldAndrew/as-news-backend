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


describe('05 - PATCH /api/articles/:article_id', () => {
  test('202 - updates article and returns updated article', () => {
       const articleUpdate = { incl_votes: 10 }
        return request(app).patch("/api/articles/1").send(articleUpdate).expect(202).then((article)=>{
        expect(article.body).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 110
        })
    })
  });

  test('202 - different article updates article and returns updated article', () => {
    const articleUpdate = { incl_votes: 50 }
     return request(app).patch("/api/articles/10").send(articleUpdate).expect(202).then((article)=>{
     expect(article.body).toEqual({
      article_id: 10,
      title: 'Seven inspirational thought leaders from Manchester UK',
      topic: 'mitch',
      author: 'rogersop',
      body: "Who are we kidding, there is only one, and it's Mitch!",
      created_at: '2020-05-14T04:15:00.000Z',
      votes: 50
    })
 })
});

test('202 - decrease votes - updates article and returns updated article', () => {
  const articleUpdate = { incl_votes: -50 }
   return request(app).patch("/api/articles/10").send(articleUpdate).expect(202).then((article)=>{
   expect(article.body).toEqual({
    article_id: 10,
    title: 'Seven inspirational thought leaders from Manchester UK',
    topic: 'mitch',
    author: 'rogersop',
    body: "Who are we kidding, there is only one, and it's Mitch!",
    created_at: '2020-05-14T04:15:00.000Z',
    votes: -50
  })
})
});
});

