import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dogs breeds application", () => {
  render(<App />);
  const linkElement = screen.getByText(/Click and know the breeds of dogs!/i);
  expect(linkElement).toBeInTheDocument();
});
