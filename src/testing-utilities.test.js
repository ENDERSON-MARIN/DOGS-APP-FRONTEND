import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Simple test component to verify testing library compatibility
const TestComponent = ({ onButtonClick, onInputChange }) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (onInputChange) onInputChange(e.target.value);
  };

  return (
    <div>
      <h1>Test Component</h1>
      <input
        data-testid="test-input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter text"
      />
      <button data-testid="test-button" onClick={onButtonClick}>
        Click me
      </button>
      <p data-testid="input-display">Input: {inputValue}</p>
    </div>
  );
};

describe("Testing Library Compatibility Tests", () => {
  test("should render components correctly with @testing-library/react", () => {
    render(<TestComponent />);

    // Test basic rendering
    expect(screen.getByText("Test Component")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
    expect(screen.getByTestId("test-button")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  test("should handle basic DOM queries with @testing-library/jest-dom matchers", () => {
    render(<TestComponent />);

    const input = screen.getByTestId("test-input");
    const button = screen.getByTestId("test-button");

    // Test jest-dom matchers
    expect(input).toBeVisible();
    expect(input).toBeEnabled();
    expect(input).toHaveValue("");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test("should handle fireEvent interactions", () => {
    const mockButtonClick = jest.fn();
    render(<TestComponent onButtonClick={mockButtonClick} />);

    const button = screen.getByTestId("test-button");

    // Test fireEvent
    fireEvent.click(button);
    expect(mockButtonClick).toHaveBeenCalledTimes(1);
  });

  test("should handle input changes with fireEvent", () => {
    const mockInputChange = jest.fn();
    render(<TestComponent onInputChange={mockInputChange} />);

    const input = screen.getByTestId("test-input");

    // Test input change with fireEvent
    fireEvent.change(input, { target: { value: "test value" } });

    expect(mockInputChange).toHaveBeenCalledWith("test value");
    expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
    expect(screen.getByText("Input: test value")).toBeInTheDocument();
  });
});

describe("User Event Simulation Tests (@testing-library/user-event v14)", () => {
  test("should handle user typing with userEvent.type", async () => {
    const user = userEvent.setup();
    const mockInputChange = jest.fn();

    render(<TestComponent onInputChange={mockInputChange} />);

    const input = screen.getByTestId("test-input");

    // Test userEvent typing
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
    expect(screen.getByText("Input: Hello World")).toBeInTheDocument();
    expect(mockInputChange).toHaveBeenCalledTimes(11); // Called for each character
  });

  test("should handle user clicking with userEvent.click", async () => {
    const user = userEvent.setup();
    const mockButtonClick = jest.fn();

    render(<TestComponent onButtonClick={mockButtonClick} />);

    const button = screen.getByTestId("test-button");

    // Test userEvent clicking
    await user.click(button);

    expect(mockButtonClick).toHaveBeenCalledTimes(1);
  });

  test("should handle user clearing and typing with userEvent", async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

    const input = screen.getByTestId("test-input");

    // Type initial value
    await user.type(input, "Initial text");
    expect(input).toHaveValue("Initial text");

    // Clear and type new value
    await user.clear(input);
    expect(input).toHaveValue("");

    await user.type(input, "New text");
    expect(input).toHaveValue("New text");
  });

  test("should handle keyboard interactions with userEvent", async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

    const input = screen.getByTestId("test-input");

    // Focus the input
    await user.click(input);
    expect(input).toHaveFocus();

    // Type initial text
    await user.type(input, "Test text");
    expect(input).toHaveValue("Test text");

    // Clear input and type new text
    await user.clear(input);
    await user.type(input, "Replaced");
    expect(input).toHaveValue("Replaced");
  });

  test("should handle tab navigation with userEvent", async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

    const input = screen.getByTestId("test-input");
    const button = screen.getByTestId("test-button");

    // Start with input focused
    await user.click(input);
    expect(input).toHaveFocus();

    // Tab to button
    await user.tab();
    expect(button).toHaveFocus();

    // Shift+Tab back to input
    await user.tab({ shift: true });
    expect(input).toHaveFocus();
  });
});

describe("Async Testing with waitFor", () => {
  const AsyncComponent = () => {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setData("Loaded data");
        setLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <div data-testid="loading">Loading...</div>;
    }

    return <div data-testid="data">{data}</div>;
  };

  test("should handle async operations with waitFor", async () => {
    render(<AsyncComponent />);

    // Initially shows loading
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    expect(screen.getByText("Loaded data")).toBeInTheDocument();
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
});
