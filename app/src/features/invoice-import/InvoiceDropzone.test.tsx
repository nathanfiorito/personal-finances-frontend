import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvoiceDropzone } from "./InvoiceDropzone";

function makePdf(name = "fatura.pdf", sizeOverride?: number): File {
  const file = new File([], name, { type: "application/pdf" });
  if (sizeOverride !== undefined) {
    Object.defineProperty(file, "size", { value: sizeOverride });
  }
  return file;
}

function makeNonPdf(name = "image.png"): File {
  return new File([], name, { type: "image/png" });
}

describe("InvoiceDropzone", () => {
  describe("idle state", () => {
    it("renders the dropzone with helper text", () => {
      render(
        <InvoiceDropzone
          status="idle"
          onFileSelected={vi.fn()}
        />
      );

      expect(screen.getByText(/fatura do cartão em pdf, até 10 mb/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /selecionar pdf/i })).toBeInTheDocument();
    });

    it("clicking the dropzone container opens the file picker", async () => {
      const user = userEvent.setup();
      render(
        <InvoiceDropzone
          status="idle"
          onFileSelected={vi.fn()}
        />
      );

      const input = screen.getByTestId("file-input");
      const clickSpy = vi.spyOn(input, "click");

      const dropzone = screen.getByRole("button", { name: /selecionar fatura em pdf/i });
      await user.click(dropzone);

      expect(clickSpy).toHaveBeenCalled();
    });

    it("fires onFileSelected with a valid PDF file", async () => {
      const onFileSelected = vi.fn();
      render(
        <InvoiceDropzone
          status="idle"
          onFileSelected={onFileSelected}
        />
      );

      const input = screen.getByTestId("file-input");
      const file = makePdf();
      await userEvent.upload(input, file);

      expect(onFileSelected).toHaveBeenCalledWith(file);
    });

    it("does NOT fire onFileSelected for a non-PDF and shows inline error", async () => {
      const onFileSelected = vi.fn();
      render(
        <InvoiceDropzone
          status="idle"
          onFileSelected={onFileSelected}
        />
      );

      const input = screen.getByTestId("file-input");
      const file = makeNonPdf();
      // applyAccept: false bypasses the <input accept> filter so our validation logic runs
      await userEvent.upload(input, file, { applyAccept: false });

      expect(onFileSelected).not.toHaveBeenCalled();
      expect(screen.getByText(/apenas arquivos pdf/i)).toBeInTheDocument();
    });

    it("does NOT fire onFileSelected for an 11 MB PDF and shows size error", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
      const onFileSelected = vi.fn();
      render(
        <InvoiceDropzone
          status="idle"
          onFileSelected={onFileSelected}
        />
      );

      const input = screen.getByTestId("file-input");
      const file = makePdf("big.pdf", 11 * 1024 * 1024);
      await user.upload(input, file);

      expect(onFileSelected).not.toHaveBeenCalled();
      expect(screen.getByText(/arquivo excede 10 mb/i)).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(3100));
      expect(screen.queryByText(/arquivo excede 10 mb/i)).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe("uploading state", () => {
    it("shows the spinner text while uploading", () => {
      render(
        <InvoiceDropzone
          status="uploading"
          onFileSelected={vi.fn()}
        />
      );

      expect(
        screen.getByText(/analisando fatura\.\.\. \(pode levar até 30 segundos\)/i)
      ).toBeInTheDocument();
    });

    it("shows a cancel button when onCancel is provided", () => {
      render(
        <InvoiceDropzone
          status="uploading"
          onFileSelected={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    });

    it("does not show a cancel button when onCancel is not provided", () => {
      render(
        <InvoiceDropzone
          status="uploading"
          onFileSelected={vi.fn()}
        />
      );

      expect(screen.queryByRole("button", { name: /cancelar/i })).not.toBeInTheDocument();
    });

    it("calls onCancel when the cancel button is clicked", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(
        <InvoiceDropzone
          status="uploading"
          onFileSelected={vi.fn()}
          onCancel={onCancel}
        />
      );

      await user.click(screen.getByRole("button", { name: /cancelar/i }));
      expect(onCancel).toHaveBeenCalledOnce();
    });
  });

  describe("error state", () => {
    it("renders the destructive alert with the error message", () => {
      render(
        <InvoiceDropzone
          status="error"
          errorMessage="Falha no servidor. Tente novamente."
          onFileSelected={vi.fn()}
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/falha no servidor/i);
    });

    it("shows a retry button that opens the file picker when clicked", async () => {
      const user = userEvent.setup();
      render(
        <InvoiceDropzone
          status="error"
          errorMessage="Erro."
          onFileSelected={vi.fn()}
        />
      );

      const input = screen.getByTestId("file-input");
      const clickSpy = vi.spyOn(input, "click");

      const retryBtn = screen.getByRole("button", { name: /tentar novamente/i });
      expect(retryBtn).toBeInTheDocument();
      await user.click(retryBtn);
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe("drag and drop", () => {
    it("triggers onFileSelected when a valid PDF is dropped", async () => {
      const onFileSelected = vi.fn();
      render(<InvoiceDropzone status="idle" onFileSelected={onFileSelected} />);
      const dropzone = screen.getByRole("button", { name: /selecionar fatura em pdf/i });
      const file = new File(["%PDF-1.4"], "fatura.pdf", { type: "application/pdf" });
      const dataTransfer = { files: [file] } as unknown as DataTransfer;
      fireEvent.drop(dropzone, { dataTransfer });
      expect(onFileSelected).toHaveBeenCalledWith(file);
    });

    it("shows inline error when a non-PDF is dropped and does not call onFileSelected", async () => {
      const onFileSelected = vi.fn();
      render(<InvoiceDropzone status="idle" onFileSelected={onFileSelected} />);
      const dropzone = screen.getByRole("button", { name: /selecionar fatura em pdf/i });
      const file = new File(["x"], "x.txt", { type: "text/plain" });
      const dataTransfer = { files: [file] } as unknown as DataTransfer;
      fireEvent.drop(dropzone, { dataTransfer });
      expect(onFileSelected).not.toHaveBeenCalled();
      expect(await screen.findByText(/apenas arquivos pdf/i)).toBeInTheDocument();
    });

    it("shows inline error when a large PDF is dropped and does not call onFileSelected", async () => {
      const onFileSelected = vi.fn();
      render(<InvoiceDropzone status="idle" onFileSelected={onFileSelected} />);
      const dropzone = screen.getByRole("button", { name: /selecionar fatura em pdf/i });
      const file = new File(["x"], "big.pdf", { type: "application/pdf" });
      Object.defineProperty(file, "size", { value: 11 * 1024 * 1024 });
      const dataTransfer = { files: [file] } as unknown as DataTransfer;
      fireEvent.drop(dropzone, { dataTransfer });
      expect(onFileSelected).not.toHaveBeenCalled();
      expect(await screen.findByText(/excede 10 mb/i)).toBeInTheDocument();
    });
  });
});
