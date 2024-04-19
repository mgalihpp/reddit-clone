import { SerializedError } from "@reduxjs/toolkit/react";

// Define a function to handle Axios errors
export const handleAxiosError = (
  error: SerializedError,
  type: "login" | "register"
): SerializedError | null => {
  const errorMessage = error.message;

  if (!errorMessage) {
    return null;
  }

  if (errorMessage.startsWith("Request failed with status code")) {
    const statusCodeMatch = errorMessage.match(/\d+/); // Extract digits from the error message
    const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[0]) : null;
    if (type === "login") {
      switch (statusCode) {
        case 400:
          return {
            name: "BadRequestError",
            message: "Invalid passwords",
            code: error.code,
            stack: error.stack,
          };
        case 401:
          return {
            name: "Unauthorized",
            message: "Invalid credentials",
            code: error.code,
            stack: error.stack,
          };
      }
    } else {
      switch (statusCode) {
        case 400:
          return {
            name: "BadRequestError",
            message: "Invalid User email already exists, Please login",
            code: error.code,
            stack: error.stack,
          };
        case 401:
          return {
            name: "Unauthorized",
            message: "Invalid credentials",
            code: error.code,
            stack: error.stack,
          };
      }
    }
  }

  // switch (statusCode) {
  //   case "ERR_BAD_REQUEST":
  //     return {
  //       name: "BadRequestError",
  //       message: "Invalid request. Please check your input.",
  //       code: error.code,
  //       stack: error.stack,
  //     };
  //   case 401:
  //     return {
  //       name: "UnauthorizedError",
  //       message: "Unauthorized. Please login again.",
  //       code: error.code,
  //       stack: error.stack,
  //     };
  //   case 403:
  //     return {
  //       name: "ForbiddenError",
  //       message: "Forbidden. You don't have permission to access.",
  //       code: error.code,
  //       stack: error.stack,
  //     };
  //   case 404:
  //     return {
  //       name: "NotFoundError",
  //       message: "Resource not found.",
  //       code: error.code,
  //       stack: error.stack,
  //     };
  //   // Add more cases as needed
  //   default:
  //     return {
  //       name: "ServerError",
  //       message: "An error occurred. Please try again later.",
  //       code: error.code,
  //       stack: error.stack,
  //     };
  // }
  // If it's not an Axios error, return null
  return null;
};
