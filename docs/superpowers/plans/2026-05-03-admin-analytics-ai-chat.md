# Admin Analytics AI Chat Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static AI insight cards in the admin analytics sidebar with an interactive chat UI panel (frontend demo only, no backend).

**Architecture:** Replace the `<aside>` contents in `AnalyticsInsightsBoard` with a chat panel using local React state (`useState`) for messages and input. Keep all left-side analytics content unchanged.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React icons, Vitest

---

## File Structure

| File | Action | Responsibility |
|------|--------|--------------|
| `src/components/admin/analytics-insights-board.tsx` | Modify | Replace sidebar insight cards with chat panel UI |
| `tests/unit/admin-workflow-boards.test.tsx` | Modify | Update assertions for new chat UI elements |
| `tests/integration/admin-pages.test.ts` | Modify | Update integration assertions for new chat UI |

---

### Task 1: Update Unit Tests to Expect Chat UI

**Files:**
- Modify: `tests/unit/admin-workflow-boards.test.tsx`

- [ ] **Step 1: Replace insight card assertions with chat UI assertions**

Replace lines 45-48 in `tests/unit/admin-workflow-boards.test.tsx`:

```typescript
    expect(html).toContain('AI 数据分析助手');
    expect(html).toContain('你好，我是数据分析助手，可以帮你解读报表数据、分析趋势并提供优化建议。');
    expect(html).toContain('输入问题，按回车发送...');
    expect(html).not.toContain('本周热门类目更偏便携型设备');
```

Remove these lines entirely (old insight card assertions):
```typescript
    expect(html).toContain('高意向流失用户自动触达');
    expect(html).toContain('Safari 浏览器加载异常');
    expect(html).toContain('AI 运算模拟图');
    expect(html).toContain('分布式决策系统 V4.2');
```

- [ ] **Step 2: Run the unit test to verify it fails**

```bash
npx vitest run tests/unit/admin-workflow-boards.test.tsx
```

Expected: FAIL — assertions for `AI 数据分析助手` and welcome message not found.

---

### Task 2: Implement Chat Panel in AnalyticsInsightsBoard

**Files:**
- Modify: `src/components/admin/analytics-insights-board.tsx:353-447`

- [ ] **Step 1: Add React state and imports**

At the top of the file, add `useState` to the React import:
```typescript
import React, { useState, useRef, useEffect } from 'react';
```

Add `Send` and `Sparkles` to the lucide-react import list:
```typescript
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  Cpu,
  Dumbbell,
  Download,
  DoorOpen,
  Group,
  Home,
  Lightbulb,
  MoveRight,
  Percent,
  Send,
  Sparkles,
  TrendingUp,
  Shirt,
  Wallet
} from 'lucide-react';
```

- [ ] **Step 2: Add state inside the component**

Inside `AnalyticsInsightsBoard`, before the return statement, add:
```typescript
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant' as const,
      content: '你好，我是数据分析助手，可以帮你解读报表数据、分析趋势并提供优化建议。'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user' as const, content: inputValue.trim() }
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
```

- [ ] **Step 3: Replace the `<aside>` contents**

Replace the entire `<aside>` block (lines 353-447) with:

```tsx
        <aside className="col-span-12 flex flex-col lg:col-span-4">
          <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-[72px]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-[18px] font-semibold text-slate-900">AI 数据分析助手</h3>
              </div>
              <span className="flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                实时扫描中
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-tr-sm bg-emerald-600 text-white'
                        : 'rounded-2xl rounded-tl-sm bg-slate-50 text-slate-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，按回车发送..."
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="rounded-lg bg-emerald-600 p-2.5 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  aria-label="发送"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        </aside>
```

- [ ] **Step 4: Run unit tests to verify they pass**

```bash
npx vitest run tests/unit/admin-workflow-boards.test.tsx
```

Expected: PASS

---

### Task 3: Update Integration Tests

**Files:**
- Modify: `tests/integration/admin-pages.test.ts:252-256`

- [ ] **Step 1: Replace old insight assertions with chat UI assertions**

Replace lines 252-256:
```typescript
    expect(analyticsHtml).toContain('AI 数据分析助手');
```

Remove these lines entirely:
```typescript
    expect(analyticsHtml).toContain('高意向流失用户自动触达');
    expect(analyticsHtml).toContain('Safari 浏览器加载异常');
    expect(analyticsHtml).toContain('AI 运算模拟图');
    expect(analyticsHtml).toContain('分布式决策系统 V4.2');
```

- [ ] **Step 2: Run integration tests to verify they pass**

```bash
npx vitest run tests/integration/admin-pages.test.ts
```

Expected: PASS

---

### Task 4: Visual Verification and Commit

- [ ] **Step 1: Start the dev server and visually verify the chat panel**

```bash
npm run dev
```

Navigate to the analytics admin page and verify:
- Right sidebar shows "AI 数据分析助手" header
- Welcome message is visible
- Input box and send button are at the bottom
- Typing a message and pressing Enter adds it to the chat
- Left-side analytics content (metrics, funnel, table) is unchanged

- [ ] **Step 2: Commit all changes**

```bash
git add src/components/admin/analytics-insights-board.tsx tests/unit/admin-workflow-boards.test.tsx tests/integration/admin-pages.test.ts docs/superpowers/specs/2026-05-03-admin-analytics-ai-chat-design.md docs/superpowers/plans/2026-05-03-admin-analytics-ai-chat.md
git commit -m "feat: replace AI insights with chat UI panel in analytics page

- Convert static AI insight cards to interactive chat panel
- Add welcome message and user input with send button
- Update unit and integration tests to match new UI
- No backend integration (frontend demo only)"
```

---

## Self-Review

1. **Spec coverage:**
   - Chat panel UI in sidebar → Task 2
   - Welcome message → Task 2 Step 3
   - User message bubbles → Task 2 Step 3
   - Input area with send button → Task 2 Step 3
   - Enter key support → Task 2 Step 2
   - Auto-scroll → Task 2 Step 2
   - No AI response → Task 2 Step 2 (handleSend only appends user message)
   - Test updates → Task 1 and Task 3
   - No placeholders or TBDs found.
   - Type consistency: `messages` type uses `'assistant' | 'user'` consistently.
