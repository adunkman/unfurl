const server = require("../../server");

describe("GET /page", () => {
  let api;

  beforeAll(async () => {
    api = await server.init();
  });

  it("requires a url querystring parameter to be specified", async () => {
    const response = await api.inject({
      method: "get",
      url: "/page",
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);

    expect(payload).toHaveProperty("message", '"url" is required');
  });
});
