/**
 * @file useTableAction.ts
 * @description 表格操作列Hook，用于生成ant-design-vue表格的操作列配置
 */

import { Space, Button, Popconfirm, Divider } from "ant-design-vue";
import type { VNode } from "vue";

/**
 * 表格行数据类型
 */
export interface TableItem {
  [key: string]: any;
}

/**
 * 操作按钮配置类型
 */
export interface ActionButton {
  /** 按钮文字 */
  text: string;
  /** 按钮类型，默认为 'link' */
  type?: "link" | "primary" | "ghost" | "dashed" | "text" | "default";
  /** 是否为危险按钮 */
  danger?: boolean;
  /** 点击按钮时的回调函数 */
  onClick: (record: TableItem) => void;
  /** 是否显示按钮的判断函数，返回false时不显示该按钮 */
  visible?: (record: TableItem) => boolean;
  /** 确认提示文字，设置后点击按钮会出现确认提示框 */
  confirmText?: string;
}

/**
 * 表格列配置类型
 */
export interface TableColumnType {
  title: string;
  key: string;
  fixed?: "left" | "right";
  width?: number;
  customRender: ({ record }: { record: TableItem }) => VNode;
}

/**
 * 表格操作列Hook
 * @param actions - 操作按钮配置数组
 * @returns 返回表格操作列的配置对象
 *
 * @example
 * ```typescript
 * // 在组件中使用
 * const actions: ActionButton[] = [
 *   {
 *     text: '编辑',
 *     onClick: (record) => handleEdit(record),
 *     visible: (record) => record.status === 'active'
 *   },
 *   {
 *     text: '删除',
 *     type: 'link',
 *     danger: true,
 *     confirmText: '确认要删除吗？',
 *     onClick: (record) => handleDelete(record)
 *   }
 * ]
 *
 * const columns = [
 *   // 其他列配置...
 *   useTableAction(actions)
 * ]
 * ```
 */
export const useTableAction = (actions: ActionButton[]) => {
  /**
   * 渲染单个操作按钮
   * @param button - 按钮配置
   * @param record - 行数据
   * @returns 渲染后的按钮节点
   */
  const renderActionButton = (button: ActionButton, record: TableItem) => {
    // 判断按钮是否需要显示
    if (button.visible && !button.visible(record)) {
      return null;
    }

    // 创建基础按钮内容
    const buttonContent = (
      <Button
        type={button.type || "link"}
        danger={button.danger}
        onClick={() => button.onClick(record)}
      >
        {button.text}
      </Button>
    );

    // 如果设置了确认文本，则包装确认框
    if (button.confirmText) {
      return (
        <Popconfirm
          title={button.confirmText}
          onConfirm={() => button.onClick(record)}
        >
          {buttonContent}
        </Popconfirm>
      );
    }

    return buttonContent;
  };

  // 返回操作列配置
  const actionColumn: TableColumnType = {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 180,
    customRender: ({ record }) => {
      return (
        <Space>
          {actions.map((button, index) => (
            // <span key={index}>
            //   {renderActionButton(button, record)}
            //   {index < actions.length - 1 && <Divider type="vertical" />}
            // </span>
          ))}
        </Space>
      );
    },
  };

  return actionColumn;
};
