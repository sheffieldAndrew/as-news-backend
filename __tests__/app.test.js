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

  test("404 - bad request response for an invalid path - returns error message", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Error - No such path");
      });
  });
});

describe("04 GET /api/articles/1", () => {
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
});

// // GET WITH PARAMETRIC
//   describe.only('2. GET /api/parks/:park_id', () => {
//     test('status:200, responds with a single matching park', () => {
//       const PARK_ID = 2;
//       return request(app)
//         .get(`/api/parks/${PARK_ID}`)
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.park).toEqual({
//             park_id: PARK_ID,
//             park_name: 'Alton Towers',
//             year_opened: 1980,
//             annual_attendance: 2520000,
//           });
//         });
//     });
//   });
