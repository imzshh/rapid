import type { RapidDataDictionary } from '@ruiapp/rapid-extension';

export default {
  code: 'PublishState',
  name: '发布状态',
  valueType: 'string',
  level: 'app',
  entries: [
    { name: '草稿', value: 'draft' },
    { name: '审核中', value: 'in_review', color: 'orange' },
    { name: '已发布', value: 'published', color: 'green' },
    { name: '已归档', value: 'archived', color: 'red' },
    { name: '已撤回', value: 'withdrawed', color: 'red' },
  ],
} as RapidDataDictionary;
