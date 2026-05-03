# Admin Analytics AI Chat Panel Design

## Overview

Replace the static "AI 智能洞察" insight cards in the admin analytics page right sidebar with an interactive chat UI panel. This is a frontend-only demonstration with no AI backend integration.

## Goals

- Provide a complete chat window UI shell in the analytics page sidebar
- Enable user input and message display without AI response logic
- Maintain all existing analytics content (metrics, funnel, categories) on the left side
- Keep the design consistent with the existing admin shell visual language

## Architecture

### Component Changes

Modify `src/components/admin/analytics-insights-board.tsx`:

- Replace the `<aside>` contents (lines 353-447) with a chat panel
- Keep all left-side content (metrics grid, funnel, category table) unchanged
- Use inline component definitions within `AnalyticsInsightsBoard` to avoid over-fragmentation for this scope

### Component Structure

```
AnalyticsInsightsBoard
  ├── Header (title + date picker + download)
  ├── Metrics Grid
  ├── Main Content Grid
  │   ├── Left Column (funnel + category table)
  │   └── Right Column (Chat Panel) ← changed
  │       ├── Chat Header
  │       ├── Message List
  │       │   └── Welcome Message
  │       └── Chat Input
  └── Footer
```

### State Management

Local React state within `AnalyticsInsightsBoard`:

- `messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>`
- `inputValue: string`

No external API calls. No context or global state needed.

## UI Design

### Chat Panel

- **Container**: `h-full flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm`
- **Header**: Same style as current sidebar header, title changed to "AI 数据分析助手", keep the "实时扫描中" badge
- **Message List**: `flex-1 overflow-y-auto p-4 space-y-4`
- **Input Area**: Fixed at bottom, `border-t border-slate-100 p-4`, contains input + send button

### Message Bubbles

- **AI Message (assistant)**:
  - Aligned left
  - Background: `bg-slate-50`
  - Text: `text-sm text-slate-700`
  - Max width: `max-w-[85%]`
  - Corner radius: `rounded-2xl rounded-tl-sm`

- **User Message**:
  - Aligned right
  - Background: `bg-emerald-600`
  - Text: `text-sm text-white`
  - Max width: `max-w-[85%]`
  - Corner radius: `rounded-2xl rounded-tr-sm`

### Welcome Message

Default first message in the list:

> "你好，我是数据分析助手，可以帮你解读报表数据、分析趋势并提供优化建议。"

Displayed with a robot/sparkles icon avatar.

### Input Area

- Text input: Full width, `rounded-lg border border-slate-200 px-4 py-2`, placeholder: "输入问题，按回车发送..."
- Send button: `bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-2`, disabled when input is empty
- Support Enter key to submit

## Interaction Behavior

1. User types in input and presses Enter or clicks Send
2. User message is appended to `messages` array
3. Input is cleared
4. No AI response is triggered (demo only)
5. Message list auto-scrolls to bottom on new message

## Error Handling

- Empty input cannot be submitted (button disabled, Enter ignored)
- No network errors to handle (no API calls)

## Testing

### Updated Unit Tests (`tests/unit/admin-workflow-boards.test.tsx`)

Keep existing assertions for:
- Page title, date range, metrics, funnel, category table, footer

Replace removed insight card assertions with:
- `AI 数据分析助手` header text
- Welcome message content
- Input placeholder text
- Send button presence

### Updated Integration Tests (`tests/integration/admin-pages.test.ts`)

Update `AI 智能洞察` assertion to `AI 数据分析助手`.

## Out of Scope

- Real AI backend integration
- Streaming responses
- Message persistence / localStorage
- File upload in chat
- Suggested question chips
- Typing indicators
- Chat history sidebar
