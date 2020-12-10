const React = require('react');
const { useState, useEffect } = React;
const ApiKey = require('../models/ApiKey');
const Dialog = require('./Dialog');
const ApiKeyForm = require('./ApiKeyForm');

const ApiKeys = () => {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState([]);
  const [editKey, setEditKey] = useState(null);

  useEffect(async () => {
    const keys = await ApiKey.all();
    setLoading(false);
    setKeys(keys);
  }, []);

  const saveKey = async () => {
    await editKey.save();

    if (!keys.find(k => editKey.equals(k))) {
      setKeys([...keys, editKey]);
    }

    setEditKey(null);
  };

  const removeKey = async () => {
    await editKey.remove();
    setKeys(keys.filter(k => !editKey.equals(k)));
    setEditKey(null);
  };

  const renderHeader = () => {
    return (
      <>
        <h1 className="heading-with-actions">
          <span>API keys</span>
          {loading ? (
            ''
          ) : (
            <button
              type="button"
              className="button button-primary"
              onClick={() => setEditKey(new ApiKey())}
            >
              Create a key
            </button>
          )}
        </h1>
      </>
    );
  };

  const renderEditDialog = () => {
    return !editKey ? (
      ''
    ) : (
      <Dialog
        title={editKey.isNew ? 'Create a new API key' : 'Edit API key'}
        commit={editKey.isNew ? 'Create key' : 'Save key'}
        danger={editKey.isNew ? false : 'Delete key'}
        onCommit={saveKey}
        onDanger={removeKey}
        onCancel={() => setEditKey(null)}
      >
        <ApiKeyForm model={editKey} />
      </Dialog>
    );
  };

  if (loading) {
    return (
      <>
        {renderHeader()}
        <p>Loading…</p>
      </>
    );
  }

  if (!keys.length) {
    return (
      <>
        {renderHeader()}
        <p>There are no keys registered to your email address.</p>
        {renderEditDialog()}
      </>
    );
  }

  return (
    <>
      {renderHeader()}
      <ul className="key-list">
        {keys.map(key => {
          return (
            <li className="key-list-item" key={key.key}>
              <div className="key-list-item-details">
                🔑 <code>{key.key}</code>
                <button
                  type="button"
                  className="copy-button"
                  data-controller="clipboard"
                  data-clipboard-text-value={key.key}
                  data-action="click->clipboard#copy"
                >
                  Copy
                </button>
                <div className="text-weak">
                  <div>Contact {key.email}</div>
                  <div>
                    Created{' '}
                    <time dateTime={key.createdAt.toISOString()}>
                      {key.createdAt.toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setEditKey(key)}
              >
                Edit key
              </button>
            </li>
          );
        })}
      </ul>
      {renderEditDialog()}
    </>
  );
};

module.exports = <ApiKeys />;
