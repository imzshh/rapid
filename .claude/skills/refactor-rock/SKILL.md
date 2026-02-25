---
name: refactor-rock
description: 当需要将 Rapid Extension 中的 Rock 组件重构为统一设计规范时使用此 skill。重构 Rapid Extension 中的 Rock 组件，使其符合统一的设计规范。适用于重构单个 Rock 组件文件夹、批量重构多个 Rock 组件，或检查现有组件是否符合规范。
---

# Refactor Rock

重构 Rapid Extension 中的 Rock 组件，使其符合统一的设计规范。

## 何时使用

当需要将 Rapid Extension 中的 Rock 组件重构为统一设计规范时使用此 skill。适用于：

- 重构单个 Rock 组件文件夹
- 批量重构多个 Rock 组件
- 检查现有组件是否符合规范

## 重构规则

### 1. 类型定义文件 ({rock-name}-types.ts)

需要定义两个类型：

- **{RockName}Props**: 纯 props 类型，包含组件所需的业务属性（如 value、onChange 等）
- \*\*{RockName}RockConfig}: 继承 SimpleRockConfig 和 {RockName}Props

示例：

```typescript
// rapid-date-picker-types.ts
import type { SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidDatePickerProps {
  value?: string | moment.Moment | null;
  picker?: "year" | "month" | "date";
  showTime?: boolean;
  onChange?(value: string | null): void;
}

export interface RapidDatePickerRockConfig extends SimpleRockConfig, RapidDatePickerProps {}
```

对于继承其他 renderer 类型的情况：

```typescript
// rapid-currency-renderer-types.ts
import { RapidNumberRendererRockConfig } from "../rapid-number-renderer/rapid-number-renderer-types";

export interface RapidCurrencyRendererProps {
  value: string | number | null | undefined;
  currencyCode?: string;
}

export interface RapidCurrencyRendererRockConfig extends RapidCurrencyRendererProps, Omit<RapidNumberRendererRockConfig, "value"> {}
```

### 2. 主组件文件 ({RockName}.tsx)

#### 2.1 导出 config 函数

增加并导出 `config{RockName}` 函数，用于类型安全的配置创建：

```typescript
export function configRapidDatePicker(config: RapidDatePickerRockConfig): RapidDatePickerRockConfig {
  return config;
}
```

#### 2.2 抽取 React 组件

从 Rock.Renderer 中抽取并导出同名的 React 组件，使用 JSX 语法。

**重要原则**

- 阅读 [renderRock 用法文档](renderRock-usage.md)，理解`renderRock`以及相关函数的调用方法，以便理解原代码的渲染逻辑
- 如果原代码使用 `renderRock` 渲染 `antdTag`、`antdButton` 等 Rock，应改为直接导入并使用 Ant Design 的 `Tag`、`Button` 等组件
- 只有当组件必须嵌套其他动态 Rock 配置时，才考虑保留 `renderRock` 调用
- 利用 `genRockRenderer` 自动处理 Rock 的渲染逻辑

```typescript
// ✅ 推荐：直接使用 antd 组件
import { Tag } from "antd";

export function RapidDictionaryEntryRenderer(props: RapidDictionaryEntryRendererProps) {
  const { value } = props;

  if (!value) {
    return null;
  }

  return <Tag color={value.color}>{value.name}</Tag>;
}
```

```typescript
// ❌ 避免：使用 renderRock 方法
export function RapidDictionaryEntryRenderer(props: RapidDictionaryEntryRendererProps, context: any) {
  const { value } = props;

  const rockConfig: RockConfig = {
    $id: `${props.$id}`,
    $type: "antdTag",
    color: value.color,
    children: {
      $id: `${props.$id}-txt`,
      $type: "text",
      text: value.name,
    },
  };

  return renderRock({ context, rockConfig });
}
```

#### 2.3 Rock 定义使用 genRockRenderer

对于渲染 React 组件的 Rock，使用 `genRockRenderer` 自动生成 Renderer：

```typescript
export default {
  Renderer: genRockRenderer(RapidDatePickerMeta.$type, RapidDatePicker),
  ...RapidDatePickerMeta,
} as Rock<RapidDatePickerRockConfig>;
```

### 3. 完整示例

#### rapid-date-picker 示例（使用 genRockRenderer）

```typescript
// rapid-date-picker-types.ts
import type { SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidDatePickerProps {
  value?: string | moment.Moment | null;
  picker?: "year" | "month" | "date";
  showTime?: boolean;
  onChange?(value: string | null): void;
}

export interface RapidDatePickerRockConfig extends SimpleRockConfig, RapidDatePickerProps {}
```

```typescript
// RapidDatePicker.tsx
import { Rock } from "@ruiapp/move-style";
import RapidDatePickerMeta from "./RapidDatePickerMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { RapidDatePickerProps, RapidDatePickerRockConfig } from "./rapid-date-picker-types";
import { DatePicker } from "antd";
import { isString } from "lodash";
import moment from "moment";

export function configRapidDatePicker(config: RapidDatePickerRockConfig): RapidDatePickerRockConfig {
  return config;
}

export function RapidDatePicker(props: RapidDatePickerProps) {
  let { value, onChange, picker, showTime } = props;

  if (isString(value)) {
    value = moment(value);
  }

  function handleChange(date: moment.Moment | null, dateString: string) {
    if (!onChange) return;
    if (!date) {
      onChange(null);
      return;
    }

    let formattedValue: string;
    switch (picker) {
      case "year":
        formattedValue = date.format("YYYY");
        break;
      case "month":
        formattedValue = date.format("YYYY-MM");
        break;
      default:
        formattedValue = showTime ? dateString : date.format("YYYY-MM-DD");
        break;
    }
    onChange(formattedValue);
  }

  return <DatePicker value={value as moment.Moment} onChange={handleChange} picker={picker} showTime={showTime} />;
}

export default {
  Renderer: genRockRenderer(RapidDatePickerMeta.$type, RapidDatePicker),
  ...RapidDatePickerMeta,
} as Rock<RapidDatePickerRockConfig>;
```

#### rapid-dictionary-entry-renderer 示例（使用 antd Tag 组件）

**重构前：**

```typescript
// RapidDictionaryEntryRenderer.tsx
import { Rock, RockConfig } from "@ruiapp/move-style";
import RapidDictionaryEntryRendererMeta from "./RapidDictionaryEntryRendererMeta";
import { RapidDictionaryEntryRendererRockConfig } from "./rapid-dictionary-entry-renderer-types";
import { renderRock } from "@ruiapp/react-renderer";

export default {
  $type: "rapidDictionaryEntryRenderer",

  Renderer(context, props: RapidDictionaryEntryRendererRockConfig) {
    const { value } = props;

    if (!value) {
      return null;
    }

    const rockConfig: RockConfig = {
      $id: `${props.$id}`,
      $type: "antdTag",
      color: value.color,
      children: {
        $id: `${props.$id}-txt`,
        $type: "text",
        text: value.name,
      },
    } as RockConfig;

    return renderRock({ context, rockConfig });
  },

  ...RapidDictionaryEntryRendererMeta,
} as Rock;
```

**重构后：**

```typescript
// rapid-dictionary-entry-renderer-types.ts
import { SimpleRockConfig } from "@ruiapp/move-style";
import { RapidDataDictionaryEntry } from "@ruiapp/rapid-common";

export interface RapidDictionaryEntryRendererProps {
  value?: RapidDataDictionaryEntry;
}

export interface RapidDictionaryEntryRendererRockConfig extends SimpleRockConfig, RapidDictionaryEntryRendererProps {}
```

```typescript
// RapidDictionaryEntryRenderer.tsx
import { Rock } from "@ruiapp/move-style";
import RapidDictionaryEntryRendererMeta from "./RapidDictionaryEntryRendererMeta";
import { RapidDictionaryEntryRendererProps, RapidDictionaryEntryRendererRockConfig } from "./rapid-dictionary-entry-renderer-types";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { Tag } from "antd";

export function configRapidDictionaryEntryRenderer(config: RapidDictionaryEntryRendererRockConfig): RapidDictionaryEntryRendererRockConfig {
  return config;
}

export function RapidDictionaryEntryRenderer(props: RapidDictionaryEntryRendererProps) {
  const { value } = props;

  if (!value) {
    return null;
  }

  return <Tag color={value.color}>{value.name}</Tag>;
}

export default {
  Renderer: genRockRenderer(RapidDictionaryEntryRendererMeta.$type, RapidDictionaryEntryRenderer),
  ...RapidDictionaryEntryRendererMeta,
} as Rock<RapidDictionaryEntryRendererRockConfig>;
```

#### rapid-currency-renderer 示例（纯渲染函数）

```typescript
// rapid-currency-renderer-types.ts
import { RapidNumberRendererRockConfig } from "../rapid-number-renderer/rapid-number-renderer-types";

export interface RapidCurrencyRendererProps {
  value: string | number | null | undefined;
  currencyCode?: string;
}

export interface RapidCurrencyRendererRockConfig extends RapidCurrencyRendererProps, Omit<RapidNumberRendererRockConfig, "value"> {}
```

```typescript
// RapidCurrencyRenderer.tsx
import { Rock } from "@ruiapp/move-style";
import RapidCurrencyRendererMeta from "./RapidCurrencyRendererMeta";
import { RapidCurrencyRendererProps, RapidCurrencyRendererRockConfig } from "./rapid-currency-renderer-types";
import { isNull, isString, isUndefined } from "lodash";

export function configRapidCurrencyRenderer(config: RapidCurrencyRendererRockConfig): RapidCurrencyRendererRockConfig {
  return config;
}

export function RapidCurrencyRenderer(props: RapidCurrencyRendererProps) {
  const { value, currencyCode, defaultText, conversionCoefficient, usingThousandSeparator, decimalPlaces, roundingMode } = props;

  let numValue = value;
  if (isUndefined(numValue) || isNull(numValue)) {
    return defaultText || "";
  }

  if (isString(numValue)) {
    numValue = parseFloat(numValue);
  }

  numValue = numValue / (conversionCoefficient || 1);

  const useGrouping = !!usingThousandSeparator;

  if (roundingMode !== "halfExpand" && decimalPlaces) {
    const powNum = Math.pow(10, decimalPlaces);
    if (roundingMode === "ceil") {
      numValue = Math.ceil(numValue * powNum) / powNum;
    } else if (roundingMode === "floor") {
      numValue = Math.floor(numValue * powNum) / powNum;
    }
  }

  return Intl.NumberFormat("Zh-cn", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: decimalPlaces,
    useGrouping: useGrouping,
  }).format(numValue);
}

export default {
  $type: "rapidCurrencyRenderer",
  Renderer(context, props: RapidCurrencyRendererRockConfig) {
    return RapidCurrencyRenderer(props);
  },
  ...RapidCurrencyRendererMeta,
} as Rock;
```

## 注意事项

1. **命名规范**:

   - Props 类型: `{RockName}Props`
   - RockConfig 类型: `{RockName}RockConfig`
   - config 函数: `config{RockName}`
   - React 组件: `{RockName}`

2. **类型继承**:

   - {RockName}RockConfig 继承 `SimpleRockConfig` 或者 `ContainerRockConfig` (当 `{RockName}Props` 包含 children 属性时)
   - {RockName}RockConfig 类型继承时，对父类型中已存在的字段，使用 `Omit` 排除重复定义

3. **genRockRenderer**:

   - 仅用于渲染 antd 组件或自定义 React 组件的场景
   - 纯渲染函数（返回字符串等）不需要使用

4. **修复问题**:
   - 检查并修复拼写错误（如 `formatedValue` → `formattedValue`）
   - 确保导入的 Meta 类型和文件名一致

## 执行步骤

1. 读取指定文件夹中的代码
2. 分析当前 rock 组件的结构
3. 按照上述规则进行重构
4. 保存修改后的文件
