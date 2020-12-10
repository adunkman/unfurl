const React = require('react');

const TryApiResponse = ({ error = null, response = null }) => {
  if (!error && !response) {
    return null;
  }

  if (error) {
    return (
      <>
        <p>
          An unexpected error occurred while trying to reach the API or process
          its response.
        </p>
        <div className="highlight">
          <pre className="chroma">
            <code>{error.stack}</code>
          </pre>
        </div>
      </>
    );
  }

  const {
    response: { status, statusText, url, headers },
    data,
  } = response;

  console.log();

  const preformatted = [
    `GET ${url}\n`,
    `${status} ${statusText}`,
    ...Array.from(headers).map(([key, value]) => `${key}: ${value}`),
  ].join('\n');

  return (
    <>
      <div className="highlight">
        <pre className="chroma">
          <code>
            {preformatted}
            {'\n\n'}
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      </div>
    </>
  );
};

module.exports = TryApiResponse;
