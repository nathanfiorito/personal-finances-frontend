import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type {
  InvoiceImportCommitRequest,
  InvoiceImportCommitResponse,
  InvoiceImportPreviewResponse,
} from "./types";

export function usePreviewInvoiceMutation() {
  const { apiClient } = useAuth();
  return useMutation<InvoiceImportPreviewResponse, Error, File>({
    mutationFn: async (file) => {
      const body = new FormData();
      body.set("file", file);
      return apiClient.postMultipart<InvoiceImportPreviewResponse>(
        endpoints.invoiceImport.preview,
        body,
      );
    },
  });
}

export function useImportInvoiceMutation() {
  const { apiClient } = useAuth();
  return useMutation<InvoiceImportCommitResponse, Error, InvoiceImportCommitRequest>({
    mutationFn: (request) =>
      apiClient.post<InvoiceImportCommitResponse>(endpoints.invoiceImport.commit, request),
  });
}
