const React = require('react');
const { useState, useEffect } = React;
const UniqueId = require('../models/UniqueId');
const Example = require('../models/Example');
const TryApiResponse = require('./TryApiResponse');
const { API_URL, API_KEY } = process.env;

const TryApi = () => {
  const formId = UniqueId.number();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [requestError, setRequestError] = useState(null);

  const requestUrl = async event => {
    event.preventDefault();
    const form = event.target;

    const inputs = Array.from(form);
    const params = Object.fromEntries(
      inputs.map(i => [i.name, i.value]).filter(([k, v]) => k && v),
    );

    delete params.apiUrl;

    try {
      setLoading(true);
      setRequestError(null);
      setResponse(null);
      const response = await fetch(
        `${API_URL}/pages?${new URLSearchParams(params)}`,
      );
      const data = await response.json();
      setResponse({ response, data });
    } catch (error) {
      setRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="try-api form-editor" onSubmit={requestUrl}>
        <label htmlFor={`try-api-apiUrl-${formId}`} className="form-label">
          API endpoint
        </label>
        <input
          type="url"
          name="apiUrl"
          id={`try-api-apiUrl-${formId}`}
          className="form-input"
          value={API_URL + '/pages'}
          readOnly
        />

        <label htmlFor={`try-api-key-${formId}`} className="form-label">
          API key
          <div className="form-label-description">
            This API key works on this site only — replace this with your API
            key when developing your application.
          </div>
        </label>
        <input
          type="text"
          name="key"
          id={`try-api-key-${formId}`}
          className="form-input"
          value={API_KEY}
          readOnly
        />

        <label htmlFor={`try-api-url-${formId}`} className="form-label">
          URL
        </label>
        <input
          type="url"
          name="url"
          id={`try-api-url-${formId}`}
          className="form-input"
          defaultValue={Example.randomUrl}
        />

        <div className="button-group">
          <button className="button" disabled={loading}>
            Try it
          </button>
          <span className={`button-helper-text ${loading ? '' : 'is-hidden'}`}>
            Loading…
          </span>
        </div>
      </form>
      <TryApiResponse error={requestError} response={response} />
    </>
  );
};

module.exports = <TryApi />;
