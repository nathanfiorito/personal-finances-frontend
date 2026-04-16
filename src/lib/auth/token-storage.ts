const STORAGE_KEY = "pf.auth";

export interface StoredToken {
  token: string;
  expires_at: number;
}

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export const tokenStorage = {
  read(): StoredToken | null {
    const storage = getStorage();
    if (!storage) return null;
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<StoredToken>;
      if (typeof parsed.token !== "string" || typeof parsed.expires_at !== "number") {
        return null;
      }
      return { token: parsed.token, expires_at: parsed.expires_at };
    } catch {
      return null;
    }
  },

  write(value: StoredToken): void {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(value));
  },

  clear(): void {
    getStorage()?.removeItem(STORAGE_KEY);
  },

  isExpired(value: StoredToken | null, now: number = Date.now()): boolean {
    if (!value) return true;
    return value.expires_at <= now;
  },
};

export function computeExpiresAt(expiresInSeconds: number, now: number = Date.now()): number {
  return now + expiresInSeconds * 1000;
}
