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
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("200 - different id number - returns article object with correct properties", () => {
    return request(app)
      .get("/api/articles/9")
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
            comment_count: expect.any(Number),
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
            comment_count: 2,
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

describe("05 - PATCH /api/articles/:article_id", () => {
  test("200 - updates article and returns updated article", () => {
    const articleUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then((article) => {
        expect(article.body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
        });
      });
  });
});

describe("6 - GET /api/users", () => {
  test("200, responds with an array of user objects with useranme, name and avatar_url props", () => {
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

  test("200 - different article updates article and returns updated article", () => {
    const articleUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/10")
      .send(articleUpdate)
      .expect(200)
      .then((article) => {
        expect(article.body).toEqual({
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: "2020-05-14T04:15:00.000Z",
          votes: 50,
        });
      });
  });

  test("200 - decrease votes - updates article and returns updated article", () => {
    const articleUpdate = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/10")
      .send(articleUpdate)
      .expect(200)
      .then((article) => {
        expect(article.body).toEqual({
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: "2020-05-14T04:15:00.000Z",
          votes: -50,
        });
      });
  });

  test("404 - handles bad path - no such article id", () => {
    return request(app)
      .patch("/api/articles/99999")
      .send({ inc_votes: 50 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article 99999 - does not exist");
      });
  });

  test("400 - handles bad path - string for article_id", () => {
    return request(app)
      .patch("/api/articles/invalid_path")
      .send({ inc_votes: 50 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid - article must be a number");
      });
  });

  test("400 - handles bad path - votes passed as string", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid - input must be in form {inc_votes: number}");
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

test("400 - handles bad path - no such key", () => {
  return request(app)
    .patch("/api/articles/2")
    .send({ incl_votes: 2 })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid - input must be in form {inc_votes: number}");
    });
});

describe("8 GET api/articles - with comment count , order by created_at DESC", () => {
  test("200, responds with an array of article objects with correct props - articles, author, title, article_id, topic, created_at, votes, comment_count - ordered by created_at DESC", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("9. GET /api/articles/:article_id/comments ", () => {
  test("200 - returns an array of comments for specific article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });

  test("200 - Returns 200 and empty array if article exists with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });

  test("404 - handles bad path - no article", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article 99999 - does not exist");
      });
  });

  test("400 - handles bad path - string for article_id", () => {
    return request(app)
      .get("/api/articles/invalid_path/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article id must be a number");
      });
  });
});

describe("10 POST /api/articles/:article_id/comments", () => {
  test("201 - Posts comment with correct info and new comment", () => {
    const newComment = {
      body: "this is a test comment",
      userName: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((comment) => {
        expect(comment.body).toEqual({
          body: "this is a test comment",
          votes: 0,
          author: "icellusedkars",
          article_id: 1,
          comment_id: 19,
          created_at: expect.any(String),
        });
      });
  });
  test("201 - Posts comment with correct properties", () => {
    const newComment = {
      body: "this is a test comment",
      userName: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((comment) => {
        expect(comment.body).toEqual;
        expect.objectContaining({
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("404 - handles bad path - no such article id", () => {
    const newComment = {
      body: "this is a test comment",
      userName: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article 99999 - does not exist");
      });
  });

  test("400 - handles bad path - string for article_id", () => {
    const newComment = {
      body: "this is a test comment",
      userName: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/invalid_path/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid - article must be a number");
      });
  });

  test("400 - no such key - wrong key - body ", () => {
    const newComment = {
      wrongbody: "this is a test comment",
      userName: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid - input must be in form {body: String, userName: String"
        );
      });
  });

  test("400 - no such key - wrong key - userName ", () => {
    const newComment = {
      body: "this is a test comment",
      wronguserName: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Invalid - input must be in form {body: String, userName: String"
        );
      });
  });
});

describe("11 - GET api/articles - with queries", () => {
  test("200 - Returns articles sorted by sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200 - Returns articles default - created_at , order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });

  test("200 - Topic exists but no articles -returns empty array", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });

  test("200 - Returns articles sorted by sort_by column - title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("200 - Returns articles sorted by sort_by column - votes, ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });

  test('200 - Returns articles sorted by sort_by column - author, ASC, filtered by topic - "mitch"', () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(11);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles).toBeSortedBy("author", { ascending: true });
      });
  });

  test("400 - handles bad path - invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("cannot sort by invalid");
      });
  });

  test("400 - handles bad path - invalid order", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("cannot sort by invalid");
      });
  });

  test("400 - handles bad path - invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("cannot sort by invalid");
      });
  });
});

describe("12 - DELETE api/comments/:comment_id", () => {
  test("204 - deletes comment", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("400 - handles bad path - invalid sort_by", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid - comment_id must be a number");
      });
  });
});


describe('13 - GET /api', () => {
  test('returns JSON describing all endpoints', () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(({ body }) => {
      const { endpoints } = body;
      expect(typeof endpoints).toBe("string");
      });
  });});