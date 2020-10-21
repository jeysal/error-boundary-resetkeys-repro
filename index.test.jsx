const React = require("react");
const { ErrorBoundary } = require("react-error-boundary");
const { render } = require("@testing-library/react");
const { createMemoryHistory } = require("history");
const { Router, Route, useLocation } = require("react-router-dom");

console.error = jest.fn();

const Boundary = ({ children }) => {
  const { pathname, search } = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => error.message}
      resetKeys={[pathname, search]}
    >
      {children}
    </ErrorBoundary>
  );
};

const Throw = () => {
  throw new Error("oops");
};

it("resets the boundary on navigation", () => {
  const history = createMemoryHistory({ initialEntries: ["/throw"] });
  const { container } = render(
    <Router history={history}>
      <Boundary>
        <Route path="/throw">
          <Throw />
        </Route>
      </Boundary>
    </Router>
  );
  expect(container.textContent).toBe("oops");

  history.push("/home");
  expect(container.textContent).not.toBe("oops");
});
