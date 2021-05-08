const app = require("../start");
const mongoose = require("mongoose");
const supertest = require("supertest");
require("dotenv").config();

beforeEach((done) => {
  mongoose.connect(
    process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("connected");
      done();
    }
  );
});
afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe("Record found for given input", () => {
  test("POST /records", async () => {
    const data = {
      startDate: "2016-01-26",
      endDate: "2016-02-02",
      minCount: 2900,
      maxCount: 3000,
    };

    await supertest(app)
      .post("/records")
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.code).toBe(0);
        expect(response.body.msg).toBe("Success");
        expect(response.body.records[0].totalCount).toBe(2991);
      });
  });
});

describe("Record not found for given input", () => {
  test("POST /records", async () => {
    const data = {
      startDate: "2016-01-26",
      endDate: "2016-02-02",
      minCount: 3000,
      maxCount: 3001,
    };

    await supertest(app)
      .post("/records")
      .send(data)
      .expect(404)
      .then(async (response) => {
        // Check the response
        expect(response.body.code).toBe(-1);
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("Input validation error", () => {
  test("POST /records", async () => {
    const data = {
      startDate: "2016-01-26",
      endDate: "2016-02-02",
      minCount: "aaa",
      maxCount: 3001,
    };

    await supertest(app)
      .post("/records")
      .send(data)
      .expect(422)
      .then(async (response) => {
        // Check the response
        expect(response.body.errors[0].msg).toBe("Invalid value");
      });
  });
});
