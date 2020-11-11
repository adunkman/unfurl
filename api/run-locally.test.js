const { fork } = require("child_process");
const { createServer } = require("net");
const { promisify } = require("util");
const wait = require("wait-port");
const Wreck = require("@hapi/wreck");

const getFreePort = async () => {
  const server = createServer();
  await promisify(server.listen.bind(server))(0);
  const port = server.address().port;
  await promisify(server.close.bind(server))();
  return port;
};

describe("run-locally", () => {
  let process;
  let port;

  beforeAll(async () => {
    port = await getFreePort();
    process = fork("./run-locally", {
      env: {
        PORT: port,
        LOG_LEVEL: "fatal",
      },
    });

    await wait({ port, output: "silent" });
  });

  afterAll(() => process.kill());

  it("boots cleanly and fetches the index object", async () => {
    const { res, payload } = await Wreck.get(`http://localhost:${port}/`, {
      json: "strict",
    });

    expect(res.statusCode).toBe(200);
    expect(payload).toMatchObject({
      documentation_url: "https://www.unfurl.page/documentation",
    });
  });
});
