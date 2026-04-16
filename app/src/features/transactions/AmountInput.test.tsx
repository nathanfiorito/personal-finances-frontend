import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountInput } from "./AmountInput";

describe("AmountInput", () => {
  it("formats the initial value with pt-BR thousand + decimal separators", () => {
    render(<AmountInput defaultValue="1234.5" />);
    expect(screen.getByRole("textbox")).toHaveValue("1.234,50");
  });

  it("formats large values with multiple thousand separators", () => {
    render(<AmountInput defaultValue="1234567.89" />);
    expect(screen.getByRole("textbox")).toHaveValue("1.234.567,89");
  });

  it("parses pt-BR input with both thousand and decimal separators", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "1.234,56");
    expect(onChange).toHaveBeenLastCalledWith("1234.56");
  });

  it("normalizes a pt-BR-formatted value to a 2-decimal string", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "1234,5");

    expect(onChange).toHaveBeenLastCalledWith("1234.50");
  });

  it("treats dot and comma as the same decimal separator", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "10.75");
    expect(onChange).toHaveBeenLastCalledWith("10.75");
  });

  it("emits an empty string when cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AmountInput value="10.00" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await user.clear(input);
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});
