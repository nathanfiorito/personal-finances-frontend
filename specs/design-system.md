# Design System — Personal Finances

Inspiração: Nubank (clean, bold, minimal, card-based).  
Identidade: laranja como cor de marca.  
Suporte: light mode + dark mode.

---

## Tipografia

**Família:** Inter (via `next/font/google`)

| Token | Tamanho | Line Height | Uso |
|---|---|---|---|
| `text-xs` | 12px | 16px | Labels, badges, metadados |
| `text-sm` | 14px | 20px | Texto de apoio, inputs |
| `text-base` | 16px | 24px | Corpo padrão |
| `text-lg` | 18px | 28px | Subtítulos, descrições |
| `text-xl` | 20px | 28px | Títulos de card |
| `text-2xl` | 24px | 32px | Títulos de seção |
| `text-3xl` | 30px | 36px | Valores monetários grandes |
| `text-4xl` | 36px | 40px | Total do dashboard |

**Pesos:**
| Token | Valor | Uso |
|---|---|---|
| `font-normal` | 400 | Corpo, descrições |
| `font-medium` | 500 | Labels de campo, nav |
| `font-semibold` | 600 | Títulos de card, botões |
| `font-bold` | 700 | Valores monetários, totais |

> Números financeiros sempre em `font-bold` — segue padrão Nubank.

---

## Paleta de Cores

### Brand — Laranja

| Token | Hex | Uso |
|---|---|---|
| `brand-50` | `#FFF7ED` | Background de badges, highlights suaves |
| `brand-100` | `#FFEDD5` | Hover backgrounds |
| `brand-200` | `#FED7AA` | Borders de elementos de brand |
| `brand-400` | `#FB923C` | Brand em dark mode |
| `brand-500` | `#F97316` | Cor principal — botões, links, foco |
| `brand-600` | `#EA580C` | Hover de botões primários |
| `brand-700` | `#C2410C` | Active state |

### Neutros — Light Mode

| Token | Hex | Uso |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Background de página, cards elevados |
| `neutral-50` | `#F9FAFB` | Background de superfícies, inputs |
| `neutral-100` | `#F3F4F6` | Hover de linhas de tabela |
| `neutral-200` | `#E5E7EB` | Borders padrão |
| `neutral-400` | `#9CA3AF` | Placeholder, texto desabilitado |
| `neutral-500` | `#6B7280` | Texto secundário |
| `neutral-700` | `#374151` | Texto de apoio |
| `neutral-900` | `#111827` | Texto primário |

### Neutros — Dark Mode

| Token | Hex | Uso |
|---|---|---|
| `dark-bg` | `#09090B` | Background de página |
| `dark-surface` | `#18181B` | Cards, modais |
| `dark-surface-2` | `#27272A` | Cards elevados, dropdowns |
| `dark-border` | `#3F3F46` | Borders |
| `dark-muted` | `#71717A` | Texto muted |
| `dark-secondary` | `#A1A1AA` | Texto secundário |
| `dark-primary` | `#F4F4F5` | Texto primário |

### Semânticas

| Token | Light | Dark | Uso |
|---|---|---|---|
| `success` | `#16A34A` | `#22C55E` | Valores positivos, confirmações |
| `success-bg` | `#F0FDF4` | `#052E16` | Background de badges success |
| `danger` | `#DC2626` | `#EF4444` | Erros, exclusões |
| `danger-bg` | `#FEF2F2` | `#450A0A` | Background de badges danger |
| `warning` | `#D97706` | `#F59E0B` | Alertas, avisos |
| `warning-bg` | `#FFFBEB` | `#1C1400` | Background de badges warning |

---

## Border Radius

| Token | Valor | Uso |
|---|---|---|
| `rounded-sm` | 4px | Badges pequenos, tags |
| `rounded` | 6px | Inputs, botões small |
| `rounded-md` | 8px | Botões padrão, selects |
| `rounded-lg` | 12px | Cards padrão |
| `rounded-xl` | 16px | Cards grandes, modais |
| `rounded-2xl` | 24px | Cards de destaque (total do dashboard) |
| `rounded-full` | 9999px | Avatares, indicadores de categoria |

---

## Sombras

| Token | Valor | Uso |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs focados, badges |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards padrão (light) |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Cards elevados |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modais, dropdowns |

> Em dark mode, substituir sombras por borders sutis (`dark-border`) — sombras perdem visibilidade em fundos escuros.

---

## Espaçamento

Base: **4px** (escala padrão Tailwind).

| Uso | Valor |
|---|---|
| Gap interno de card | `p-4` (16px) ou `p-6` (24px) |
| Gap entre cards | `gap-4` (16px) ou `gap-6` (24px) |
| Padding de página | `px-4 py-6` mobile / `px-8 py-8` desktop |
| Gap de formulário | `space-y-4` |
| Gap de tabela (rows) | `py-3` por linha |

---

## Componentes — Tokens de Referência

### Botão Primário
```
bg: brand-500   hover: brand-600   active: brand-700
text: white     rounded-md         font-semibold text-sm
px-4 py-2       shadow-sm
```

### Botão Destrutivo
```
bg: danger      hover: danger/90
text: white     rounded-md         font-semibold text-sm
```

### Botão Ghost / Secundário
```
bg: transparent   hover: neutral-100 (light) / dark-surface-2 (dark)
text: neutral-700 / dark-secondary
border: neutral-200 / dark-border
```

### Card
```
bg: white (light) / dark-surface (dark)
border: neutral-200 / dark-border
rounded-xl      shadow (light) / sem sombra + border (dark)
p-6
```

### Input
```
bg: neutral-50 (light) / dark-surface-2 (dark)
border: neutral-200 / dark-border
rounded-md      text-sm
focus: ring-2 ring-brand-500
```

### Badge / Chip de Categoria
```
rounded-full    px-2.5 py-0.5    text-xs font-medium
Cores: brand-bg + brand-700 (brand), ou semantic conforme contexto
```

### Tabela
```
Header: bg-neutral-50 / dark-surface-2   text-xs font-medium uppercase text-neutral-500
Row hover: bg-neutral-50 / dark-surface-2
Border: divide-y divide-neutral-200 / dark-border
```

### Toast
```
rounded-lg      shadow-lg       p-4
Success: border-l-4 border-success
Danger: border-l-4 border-danger
```

---

## Ícones

Usar **Lucide React** (`lucide-react`) — consistente, tree-shakeable, tamanho padrão `16px` (inline) e `20px` (standalone).

---

## Gráficos

Usar **Recharts** — integração nativa com React, suporte a dark mode via props, responsivo por padrão.

- **Gráfico de pizza** (Dashboard): `PieChart` com cores das categorias
- **Gráfico de barras** (Relatórios): `BarChart` com `fill: brand-500`

### Cores dos gráficos por categoria

| Categoria | Cor |
|---|---|
| Alimentação | `#F97316` (brand) |
| Transporte | `#3B82F6` (blue-500) |
| Moradia | `#8B5CF6` (violet-500) |
| Saúde | `#EF4444` (red-500) |
| Educação | `#06B6D4` (cyan-500) |
| Lazer | `#F59E0B` (amber-500) |
| Vestuário | `#EC4899` (pink-500) |
| Serviços | `#6B7280` (gray-500) |
| Pets | `#10B981` (emerald-500) |
| Outros | `#A3A3A3` (neutral-400) |
