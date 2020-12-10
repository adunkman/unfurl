const React = require('react');
const User = require('../models/User')();
const UniqueId = require('../models/UniqueId');
const ApiVersion = require('../models/ApiVersion');

const ApiKeyForm = ({ model }) => {
  const formId = UniqueId.number();

  const updateModel = ({ target }) => {
    model[target.name] = target.value;
  };

  if (!model.email) {
    // Showing the form <select> selects the first <option>
    model.email = User.emails[0];
  }

  return (
    <>
      <form className="form-editor">
        {model.isNew ? (
          ''
        ) : (
          <>
            <label
              htmlFor={`api-key-form-key-${formId}`}
              className="form-label"
            >
              API key
              <div className="form-label-description">
                You cannot change your API key. To rotate your keys, create a
                new key and delete this one.
              </div>
            </label>
            <input
              type="text"
              name="key"
              id={`api-key-form-key-${formId}`}
              className="form-input"
              value={model.key}
              readOnly
            />
          </>
        )}

        <label
          htmlFor={`api-key-form-apiVersion-${formId}`}
          className="form-label"
        >
          Default API version
          <div className="form-label-description">
            Requests use this API version unless overridden.{' '}
            <a href="/documentation/versioning/" target="_blank">
              Read more
            </a>
          </div>
        </label>
        <select
          name="apiVersion"
          id={`api-key-form-apiVersion-${formId}`}
          className="form-select"
          defaultValue={model.apiVersion}
          onChange={updateModel}
        >
          {ApiVersion.versions.map(version => (
            <option value={version} key={version}>
              {version}
              {version === ApiVersion.currentVersion ? ' (current)' : ''}
            </option>
          ))}
        </select>

        <label htmlFor={`api-key-form-email-${formId}`} className="form-label">
          Email address
          <div className="form-label-description">
            This email address is used to contact you about upcoming changes to
            the API. We respect your privacy — your email address is not
            provided third parties.
          </div>
        </label>
        <select
          name="email"
          id={`api-key-form-email-${formId}`}
          className="form-select"
          defaultValue={model.email}
          onChange={updateModel}
        >
          {User.emails.map(email => (
            <option value={email} key={email}>
              {email}
            </option>
          ))}
        </select>
      </form>
    </>
  );
};

module.exports = ApiKeyForm;
