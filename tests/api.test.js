const app = require("../app");
const request = require("supertest");
const appRequest = request(app);

describe("test Endpoints", () => {
  it("gets the test endpoint", async done => {
    const response = await appRequest.get("/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("pass!");
    done();
  });
});

describe("Post Endpoints", () => {
  it("should create a new user", async () => {
    const res = await appRequest.post("/login").send({
      email: "esharma@gmail.com",
      token: "test is cool"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email");
  });
});
