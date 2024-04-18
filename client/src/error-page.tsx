import { useRouteError } from "react-router-dom";

interface RouteErrorProps {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteErrorProps;
  console.error(error);

  return (
    <div
      id="error-page"
      className="min-h-screen flex items-center justify-center mx-auto flex-col space-y-4"
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
