import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InvoiceDropzone } from "./InvoiceDropzone";

const meta: Meta<typeof InvoiceDropzone> = {
  title: "Features/InvoiceImport/InvoiceDropzone",
  component: InvoiceDropzone,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    onFileSelected: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceDropzone>;

export const Idle: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-md">
      <InvoiceDropzone {...args} status="idle" />
    </div>
  ),
};

export const Uploading: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-md">
      <InvoiceDropzone {...args} status="uploading" />
    </div>
  ),
};

export const UploadingNoCancel: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-md">
      <InvoiceDropzone {...args} status="uploading" onCancel={undefined} />
    </div>
  ),
};

export const Error: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-md">
      <InvoiceDropzone
        {...args}
        status="error"
        errorMessage="Falha no servidor. Tente novamente."
      />
    </div>
  ),
};

/**
 * Static preview of the drag-over visual state. This state is normally transient (while the user
 * holds a file over the dropzone); the story forces it for visual review by setting the
 * `data-dragover="true"` attribute via a ref wrapper.
 */
export const DragOver: Story = {
  args: { status: "idle", onFileSelected: fn() },
  decorators: [
    (StoryFn) => (
      <div className="mx-auto w-full max-w-md">
        <div
          ref={(el) => {
            if (el) {
              const target = el.querySelector<HTMLElement>(
                '[role="button"][aria-label*="fatura"]'
              );
              if (target) target.setAttribute("data-dragover", "true");
            }
          }}
        >
          <StoryFn />
        </div>
      </div>
    ),
  ],
};

/**
 * Static preview of the inline validation error (shown for 3s after a bad file is picked).
 * Rendered by dispatching a synthetic drop of a non-PDF file once the story mounts.
 */
export const WithInlineError: Story = {
  args: { status: "idle", onFileSelected: fn() },
  decorators: [
    (StoryFn) => (
      <div className="mx-auto w-full max-w-md">
        <div
          ref={(el) => {
            if (el) {
              requestAnimationFrame(() => {
                const target = el.querySelector<HTMLElement>(
                  '[role="button"][aria-label*="fatura"]'
                );
                if (!target) return;
                const file = new File(["x"], "x.txt", { type: "text/plain" });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                const event = new Event("drop", { bubbles: true, cancelable: true });
                Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
                target.dispatchEvent(event);
              });
            }
          }}
        >
          <StoryFn />
        </div>
      </div>
    ),
  ],
};
