## ant-vue-design

### a-table

#### columns
- `a-switch`按钮放在列表上的写法
```
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   customRender: ({ text, record }) => {
  //     return h(Space, null, () => [
  //       h(Tag, { color: text === 1 ? 'success' : 'error' }, () =>
  //         text === 1 ? '正常' : '禁用'
  //       ),
  //       h(Switch, {
  //         checked: text === 1,
  //         onChange: (checked: boolean) => {
  //           // 在这里添加更新状态的逻辑
  //           console.log(`Switch is ${checked ? 'on' : 'off'}`)
  //         }
  //       } as SwitchProps)
  //     ])
  //   }
  // },
```
