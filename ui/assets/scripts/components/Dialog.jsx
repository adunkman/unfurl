const React = require('react');
const { useEffect } = React;

const Dialog = ({
  title = 'Dialog',
  cancel = 'Cancel',
  commit = 'Okay',
  danger = false,
  onDanger = () => {},
  onCancel = () => {},
  onCommit = () => {},
  children,
}) => {
  useEffect(() => {
    document.addEventListener('keydown', closeIfEscape);

    return () => {
      document.removeEventListener('keydown', closeIfEscape);
    };
  }, []);

  const closeIfEscape = ({ code }) => {
    if (code === 'Escape') {
      onCancel();
    }
  };

  return (
    <>
      <section className="dialog">
        <div className="dialog-contents">
          <h1>{title}</h1>
          {children}
          <div className="button-group dialog-button-group">
            <button
              type="button"
              className="button button-primary"
              onClick={onCommit}
            >
              {commit}
            </button>
            <button
              type="button"
              className="button button-link"
              onClick={onCancel}
            >
              {cancel}
            </button>
            {!danger ? (
              ''
            ) : (
              <button
                type="button"
                className="button button-danger"
                onClick={onDanger}
              >
                {danger}
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

module.exports = Dialog;
