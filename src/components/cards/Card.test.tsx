import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card.tsx";

describe("Card component", () => {
  it("should render its children", () => {
    render(<Card>My children</Card>);
    expect(screen.queryByText("My children")).toBeInTheDocument();
    // console.log(container.firstChild)
  });
});
