import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card.tsx";

describe("Card component", () => {
  it("should render its children", () => {
    render(<Card>My children</Card>);
    expect(screen.queryByText("My children")).toBeInTheDocument();
    // console.log(container.firstChild)
  });
});
it("renders the Card component and its children", () => {
  render(<Card>Test Content</Card>);
  expect(screen.getByText("Test Content")).toBeInTheDocument();
});

it("renders static content like a button inside the Card", () => {
  render(
    <Card>
      <button>Jetzt teilnehmen</button>
    </Card>
  );
  expect(screen.getByRole("button", { name: "Jetzt teilnehmen" })).toBeInTheDocument();
});

it("applies the 'card' CSS class to the root element", () => {
  const { container } = render(<Card>CSS Test</Card>);
  expect(container.firstChild).toHaveClass("card");
});

it("calls the onClick handler when a button inside Card is clicked", () => {
  const handleClick = vi.fn();
  render(
    <Card>
      <button onClick={handleClick}>Klick mich</button>
    </Card>
  );
  fireEvent.click(screen.getByText("Klick mich"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it("conditionally renders children based on props", () => {
  const ConditionalChild = ({ show }: { show: boolean }) =>
    show ? <span>Visible</span> : null;
  const { rerender } = render(
    <Card>
      <ConditionalChild show={true} />
    </Card>
  );
  expect(screen.queryByText("Visible")).toBeInTheDocument();

  rerender(
    <Card>
      <ConditionalChild show={false} />
    </Card>
  );
  expect(screen.queryByText("Visible")).not.toBeInTheDocument();
});
