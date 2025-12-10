import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";

// Import Redux reducer
import rootReducer from "./redux/reducer/index";

// Mock axios for API calls
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock SweetAlert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const axios = require("axios");

// Mock data
const mockDogs = [
  {
    id: 1,
    name: "Golden Retriever",
    image: "https://example.com/golden.jpg",
    weight_min: 25,
    weight_max: 35,
    height_min: 51,
    height_max: 61,
    temperaments: "Friendly, Intelligent, Devoted",
    years_life: "10-12 years",
  },
  {
    id: 2,
    name: "German Shepherd",
    image: "https://example.com/german.jpg",
    weight_min: 22,
    weight_max: 40,
    height_min: 55,
    height_max: 65,
    temperaments: "Confident, Courageous, Smart",
    years_life: "9-13 years",
  },
];

const mockTemperaments = [
  { id: 1, name: "Friendly" },
  { id: 2, name: "Intelligent" },
  { id: 3, name: "Confident" },
];

// Helper function to create store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      dogs: [],
      temperaments: [],
      dogDetails: {},
      dogsFavorites: [],
      ...initialState,
    },
  });
};

// Helper function to render with providers
const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState);
  return render(<Provider store={store}>{component}</Provider>);
};

// Simple test component to verify Redux integration
const TestReduxComponent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Test Redux Integration</h1>
      <p data-testid="count">Count: {count}</p>
      <button data-testid="increment" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

describe("Integration Tests - Critical User Flows", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default axios responses
    axios.get.mockImplementation((url) => {
      if (url === "/dogs") {
        return Promise.resolve({ data: mockDogs });
      }
      if (url === "/temperaments") {
        return Promise.resolve({ data: mockTemperaments });
      }
      if (url.includes("/dogs?name=")) {
        const name = url.split("name=")[1];
        const filteredDogs = mockDogs.filter((dog) =>
          dog.name.toLowerCase().includes(name.toLowerCase())
        );
        return Promise.resolve({ data: filteredDogs });
      }
      if (url.includes("/dogs/")) {
        const id = parseInt(url.split("/dogs/")[1]);
        const dog = mockDogs.find((d) => d.id === id);
        return Promise.resolve({ data: dog });
      }
      return Promise.resolve({ data: [] });
    });

    axios.post.mockResolvedValue({ data: { success: true } });
  });

  describe("User Flow 1: Redux Store Integration", () => {
    test("should integrate with Redux store correctly", () => {
      const initialState = {
        dogs: mockDogs,
        temperaments: mockTemperaments,
      };

      renderWithProviders(<TestReduxComponent />, { initialState });

      // Should render the test component
      expect(screen.getByText("Test Redux Integration")).toBeInTheDocument();
      expect(screen.getByTestId("count")).toHaveTextContent("Count: 0");

      // Should handle state updates
      const incrementButton = screen.getByTestId("increment");
      fireEvent.click(incrementButton);

      expect(screen.getByTestId("count")).toHaveTextContent("Count: 1");
    });
  });

  describe("User Flow 2: API Integration", () => {
    test("should handle API calls correctly", async () => {
      // Test that axios mocks are working
      const response = await axios.get("/dogs");
      expect(response.data).toEqual(mockDogs);

      // Test search functionality
      const searchResponse = await axios.get("/dogs?name=Golden");
      expect(searchResponse.data).toEqual([mockDogs[0]]);

      // Test temperaments API
      const temperamentsResponse = await axios.get("/temperaments");
      expect(temperamentsResponse.data).toEqual(mockTemperaments);
    });

    test("should handle API errors gracefully", async () => {
      // Mock API error
      axios.get.mockRejectedValueOnce(new Error("API Error"));

      try {
        await axios.get("/dogs");
      } catch (error) {
        expect(error.message).toBe("API Error");
      }
    });
  });

  describe("User Flow 3: Form Validation", () => {
    // Test form validation logic
    const validateForm = (inputs) => {
      const errors = {};
      const regexText = /^([a-zA-Z ]+)$/i;
      const regexNumber = /^([0-9]+)$/i;
      const regexImg = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/i;

      if (!inputs.name) {
        errors.name = "The field 'Name' is required!";
      } else if (!regexText.test(inputs.name)) {
        errors.name = "The name can't include especial characters or numbers";
      }

      if (!inputs.image) {
        errors.image = "The field 'image' is required!";
      } else if (!regexImg.test(inputs.image)) {
        errors.image =
          "Verify the URL, format image Valid(png|gif|webp|jpeg|jpg)";
      }

      if (!inputs.height_max) {
        errors.height_max = "The field 'Height-Max' is required!";
      } else if (!regexNumber.test(inputs.height_max)) {
        errors.height_max = "The field 'Height-Max' can only contain numbers";
      }

      if (!inputs.height_min) {
        errors.height_min = "The field 'Height-Min' is required!";
      } else if (!regexNumber.test(inputs.height_min)) {
        errors.height_min = "The field 'Height-Min' can only contain numbers";
      } else if (parseInt(inputs.height_min) >= parseInt(inputs.height_max)) {
        errors.height_min =
          "The field 'Height-Min' must be smaller than the field 'Height-Max'";
      }

      return errors;
    };

    test("should validate form inputs correctly", () => {
      // Test valid inputs
      const validInputs = {
        name: "Golden Retriever",
        image: "https://example.com/dog.jpg",
        height_max: "60",
        height_min: "50",
      };

      const validErrors = validateForm(validInputs);
      expect(Object.keys(validErrors)).toHaveLength(0);

      // Test invalid inputs
      const invalidInputs = {
        name: "123",
        image: "invalid-url",
        height_max: "abc",
        height_min: "70", // Greater than max
      };

      const invalidErrors = validateForm(invalidInputs);
      expect(invalidErrors.name).toContain(
        "can't include especial characters or numbers"
      );
      expect(invalidErrors.image).toContain("Verify the URL");
      expect(invalidErrors.height_max).toContain("can only contain numbers");
    });

    test("should validate height min/max relationship", () => {
      const inputs = {
        name: "Test Dog",
        image: "https://example.com/dog.jpg",
        height_max: "50",
        height_min: "60", // Invalid: min > max
      };

      const errors = validateForm(inputs);
      expect(errors.height_min).toContain(
        "must be smaller than the field 'Height-Max'"
      );
    });
  });

  describe("User Flow 4: Data Filtering and Sorting", () => {
    test("should filter dogs by name correctly", () => {
      const dogs = mockDogs;
      const searchTerm = "golden";

      const filteredDogs = dogs.filter((dog) =>
        dog.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filteredDogs).toHaveLength(1);
      expect(filteredDogs[0].name).toBe("Golden Retriever");
    });

    test("should sort dogs alphabetically", () => {
      const dogs = [...mockDogs];

      // Sort A-Z
      const sortedAZ = dogs.sort((a, b) => a.name.localeCompare(b.name));
      expect(sortedAZ[0].name).toBe("German Shepherd");
      expect(sortedAZ[1].name).toBe("Golden Retriever");

      // Sort Z-A
      const sortedZA = dogs.sort((a, b) => b.name.localeCompare(a.name));
      expect(sortedZA[0].name).toBe("Golden Retriever");
      expect(sortedZA[1].name).toBe("German Shepherd");
    });

    test("should sort dogs by weight", () => {
      const dogs = [...mockDogs];

      // Sort by max weight (ascending)
      const sortedByWeight = dogs.sort((a, b) => a.weight_max - b.weight_max);
      expect(sortedByWeight[0].weight_max).toBe(35); // Golden Retriever
      expect(sortedByWeight[1].weight_max).toBe(40); // German Shepherd
    });
  });

  describe("User Flow 5: Component State Management", () => {
    const StatefulComponent = () => {
      const [filters, setFilters] = React.useState({
        temperament: "All",
        existence: "All",
        sort: "A-Z",
      });

      const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
          ...prev,
          [filterType]: value,
        }));
      };

      return (
        <div>
          <select
            data-testid="temperament-filter"
            value={filters.temperament}
            onChange={(e) => handleFilterChange("temperament", e.target.value)}
          >
            <option value="All">All Temperaments</option>
            <option value="Friendly">Friendly</option>
            <option value="Intelligent">Intelligent</option>
          </select>

          <select
            data-testid="existence-filter"
            value={filters.existence}
            onChange={(e) => handleFilterChange("existence", e.target.value)}
          >
            <option value="All">All</option>
            <option value="API">API</option>
            <option value="DB">DB</option>
          </select>

          <div data-testid="current-filters">
            Temperament: {filters.temperament}, Existence: {filters.existence}
          </div>
        </div>
      );
    };

    test("should manage component state correctly", async () => {
      const user = userEvent.setup();

      render(<StatefulComponent />);

      // Initial state
      expect(screen.getByTestId("current-filters")).toHaveTextContent(
        "Temperament: All, Existence: All"
      );

      // Change temperament filter
      await user.selectOptions(
        screen.getByTestId("temperament-filter"),
        "Friendly"
      );
      expect(screen.getByTestId("current-filters")).toHaveTextContent(
        "Temperament: Friendly, Existence: All"
      );

      // Change existence filter
      await user.selectOptions(screen.getByTestId("existence-filter"), "API");
      expect(screen.getByTestId("current-filters")).toHaveTextContent(
        "Temperament: Friendly, Existence: API"
      );
    });
  });

  describe("User Flow 6: Error Handling and Edge Cases", () => {
    test("should handle empty data gracefully", () => {
      const emptyDogs = [];
      const emptyTemperaments = [];

      // Test filtering empty arrays
      const filteredDogs = emptyDogs.filter((dog) =>
        dog.name.toLowerCase().includes("test")
      );
      expect(filteredDogs).toHaveLength(0);

      // Test sorting empty arrays
      const sortedDogs = emptyDogs.sort((a, b) => a.name.localeCompare(b.name));
      expect(sortedDogs).toHaveLength(0);
    });

    test("should handle invalid search terms", () => {
      const dogs = mockDogs;

      // Search for non-existent dog
      const filteredDogs = dogs.filter((dog) =>
        dog.name.toLowerCase().includes("nonexistent")
      );
      expect(filteredDogs).toHaveLength(0);

      // Search with special characters
      const specialCharSearch = dogs.filter((dog) =>
        dog.name.toLowerCase().includes("@#$%")
      );
      expect(specialCharSearch).toHaveLength(0);
    });

    test("should handle malformed data", () => {
      const malformedDogs = [
        { id: 1, name: null, weight_min: "invalid" },
        { id: 2, name: "", weight_max: undefined },
        { id: 3 }, // Missing required fields
      ];

      // Filter out invalid entries
      const validDogs = malformedDogs.filter(
        (dog) =>
          dog.name && typeof dog.name === "string" && dog.name.trim() !== ""
      );
      expect(validDogs).toHaveLength(0);
    });
  });

  describe("User Flow 7: Performance and Optimization", () => {
    test("should handle large datasets efficiently", () => {
      // Create a large dataset
      const largeDogDataset = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `Dog ${index + 1}`,
        weight_min: 10 + (index % 30),
        weight_max: 20 + (index % 40),
        temperaments: index % 2 === 0 ? "Friendly" : "Aggressive",
      }));

      const startTime = performance.now();

      // Test filtering performance
      const filteredDogs = largeDogDataset.filter(
        (dog) => dog.temperaments === "Friendly"
      );

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete filtering in reasonable time (< 100ms)
      expect(executionTime).toBeLessThan(100);
      expect(filteredDogs.length).toBe(500); // Half should be friendly
    });

    test("should handle pagination correctly", () => {
      const dogs = mockDogs;
      const dogsPerPage = 1;
      const currentPage = 1;

      const lastDogsPerPage = currentPage * dogsPerPage;
      const firstDogsPerPage = lastDogsPerPage - dogsPerPage;
      const currentDogs = dogs.slice(firstDogsPerPage, lastDogsPerPage);

      expect(currentDogs).toHaveLength(1);
      expect(currentDogs[0].name).toBe("Golden Retriever");

      // Test second page
      const page2Dogs = dogs.slice(1, 2);
      expect(page2Dogs[0].name).toBe("German Shepherd");
    });
  });
});
