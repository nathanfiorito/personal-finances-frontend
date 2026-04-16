interface BankStyle {
  color: string;
  textColor: string;
  initials: string;
}

const BANK_REGISTRY: Record<string, Omit<BankStyle, "initials">> = {
  "Nubank": { color: "#820AD1", textColor: "#FFFFFF" },
  "Itaú": { color: "#EC7000", textColor: "#FFFFFF" },
  "Itau": { color: "#EC7000", textColor: "#FFFFFF" },
  "Bradesco": { color: "#CC092F", textColor: "#FFFFFF" },
  "Inter": { color: "#FF7A00", textColor: "#FFFFFF" },
  "C6 Bank": { color: "#2A2A2A", textColor: "#FFFFFF" },
  "C6": { color: "#2A2A2A", textColor: "#FFFFFF" },
  "Banco do Brasil": { color: "#FFEF00", textColor: "#003882" },
  "BB": { color: "#FFEF00", textColor: "#003882" },
  "Santander": { color: "#EC0000", textColor: "#FFFFFF" },
  "Caixa": { color: "#005CA9", textColor: "#FFFFFF" },
  "BTG Pactual": { color: "#001E3D", textColor: "#FFFFFF" },
  "BTG": { color: "#001E3D", textColor: "#FFFFFF" },
  "XP": { color: "#000000", textColor: "#FFFFFF" },
  "Neon": { color: "#00E5A0", textColor: "#1A1A2E" },
  "PagBank": { color: "#00A859", textColor: "#FFFFFF" },
  "Sicoob": { color: "#003641", textColor: "#FFFFFF" },
  "Original": { color: "#00A651", textColor: "#FFFFFF" },
  "Safra": { color: "#002855", textColor: "#D4AF37" },
};

function hashToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getInitials(bankName: string): string {
  return bankName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function getBankStyle(bankName: string): BankStyle {
  const entry = BANK_REGISTRY[bankName];
  if (entry) {
    return { ...entry, initials: getInitials(bankName) };
  }
  const hue = hashToHue(bankName);
  return {
    color: `oklch(0.45 0.15 ${hue})`,
    textColor: "#FFFFFF",
    initials: getInitials(bankName),
  };
}

export function getBankNames(): string[] {
  // Return unique bank names (exclude aliases like "BB", "C6", "Itau")
  return ["Nubank", "Itaú", "Bradesco", "Inter", "C6 Bank", "Banco do Brasil", "Santander", "Caixa", "BTG Pactual", "XP", "Neon", "PagBank", "Sicoob", "Original", "Safra"];
}
