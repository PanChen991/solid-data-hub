// Mock data for SSB-KMS (Solid-State Battery Knowledge Management System)

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'folder';
  size?: string;
  createdAt?: string;
  author?: string;
  tags?: string[];
  summary?: string;
  department?: string;
  isLocked?: boolean;
  updatedAgo?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'docx' | 'xlsx' | 'pptx';
  icon?: string;
  badge?: string;
  badgeColor?: 'blue' | 'amber' | 'green' | 'red';
  isLocked?: boolean;
  size?: string;
  updatedAgo?: string;
  author?: string;
  children?: FolderItem[];
}

export interface Intelligence {
  id: string;
  title: string;
  source: string;
  type: 'paper' | 'patent';
  tags: string[];
  publishedAt: string;
  abstract: string;
  authors?: string[];
  patentNumber?: string;
  status?: string;
}

export interface Activity {
  id: string;
  type: 'document' | 'intelligence' | 'ai';
  action: string;
  target: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// 3-Tier Folder Structure
export const rootSpaces: FolderItem[] = [
  {
    id: 'public',
    name: '00_公共资源库',
    type: 'folder',
    badge: '全员可见',
    badgeColor: 'blue',
    children: [
      {
        id: 'public-templates',
        name: '模板文件夹',
        type: 'folder',
        children: [],
      },
      {
        id: 'public-training',
        name: '培训资料',
        type: 'folder',
        children: [],
      },
      {
        id: 'public-policy',
        name: '公司政策与规章',
        type: 'folder',
        children: [],
      },
    ],
  },
  {
    id: 'departments',
    name: '01_职能部门空间',
    type: 'folder',
    badge: '部门隔离',
    badgeColor: 'amber',
    children: [
      {
        id: 'dept-01',
        name: 'Dept_01_无机电解质',
        type: 'folder',
        children: [
          {
            id: 'dept-01-manager',
            name: 'Manager_Only_预算与人事',
            type: 'folder',
            isLocked: true,
          },
          {
            id: 'dept-01-sop',
            name: '材料合成工艺_SOP',
            type: 'folder',
          },
          {
            id: 'dept-01-file-1',
            name: 'LPSC_502批次_XRD图谱分析.pdf',
            type: 'pdf',
            size: '4.2 MB',
            updatedAgo: '10 分钟前',
            author: 'Wang',
          },
          {
            id: 'dept-01-file-2',
            name: '硫化物电解质_电导率测试报告_2025Q4.xlsx',
            type: 'xlsx',
            size: '1.8 MB',
            updatedAgo: '2 小时前',
            author: 'Zhang',
          },
          {
            id: 'dept-01-file-3',
            name: '高通量球磨设备_维护记录.docx',
            type: 'docx',
            size: '856 KB',
            updatedAgo: '昨天',
            author: 'Li',
          },
        ],
      },
      {
        id: 'dept-02',
        name: 'Dept_02_高分子与界面',
        type: 'folder',
        children: [],
      },
      {
        id: 'dept-03',
        name: 'Dept_03_全固态电芯工艺',
        type: 'folder',
        children: [],
      },
      {
        id: 'dept-04',
        name: 'Dept_04_测试与表征',
        type: 'folder',
        children: [],
      },
      {
        id: 'dept-05',
        name: 'Dept_05_综合行政',
        type: 'folder',
        children: [],
      },
    ],
  },
  {
    id: 'projects',
    name: '02_项目协作空间',
    type: 'folder',
    badge: '跨部门',
    badgeColor: 'green',
    children: [
      {
        id: 'project-01',
        name: 'Proj_2025_硫化物量产攻关',
        type: 'folder',
        children: [],
      },
      {
        id: 'project-02',
        name: 'Proj_2025_无负极技术验证',
        type: 'folder',
        children: [],
      },
      {
        id: 'project-03',
        name: 'Proj_2024_LLZO陶瓷电解质',
        type: 'folder',
        children: [],
      },
    ],
  },
];

// External Intelligence (Papers & Patents)
export const intelligences: Intelligence[] = [
  {
    id: '1',
    title: '全固态电池硫化物电解质的空气稳定性研究',
    source: 'Nature Energy',
    type: 'paper',
    tags: ['硫化物', '空气稳定性', 'Li₆PS₅Cl'],
    publishedAt: '2025',
    abstract: '本研究系统分析了硫化物固态电解质在不同湿度条件下的化学稳定性，并提出了一种新型表面改性策略，可将空气暴露耐受时间延长至48小时以上。',
    authors: ['Wang, Y.', 'Zhang, H.', 'Li, M.'],
  },
  {
    id: '2',
    title: '一种用于抑制锂枝晶的复合负极保护层',
    source: 'USPTO',
    type: 'patent',
    tags: ['锂枝晶', '负极保护', '界面改性'],
    publishedAt: '2025',
    abstract: '本发明公开了一种由有机-无机复合材料构成的锂金属负极保护层，可有效抑制锂枝晶生长，使全固态电池循环寿命提升3倍以上。',
    patentNumber: 'US2025/0123456',
    status: '授权中',
  },
  {
    id: '3',
    title: '氧化物固态电解质的低温烧结新工艺',
    source: 'Science',
    type: 'paper',
    tags: ['氧化物', 'LLZO', '低温烧结'],
    publishedAt: '2024',
    abstract: '采用闪速烧结技术，成功将LLZO电解质的致密化温度从1200°C降至800°C，同时保持1.2 mS/cm的高离子电导率。',
    authors: ['Chen, X.', 'Liu, W.'],
  },
  {
    id: '4',
    title: '高通量筛选方法加速固态电池材料发现',
    source: 'Nature Materials',
    type: 'paper',
    tags: ['高通量', '材料筛选', 'AI'],
    publishedAt: '2024',
    abstract: '结合机器学习与自动化实验平台，建立了固态电解质高通量筛选体系，材料发现效率提升100倍。',
    authors: ['Park, J.', 'Kim, S.'],
  },
  {
    id: '5',
    title: '一种固态电池干法电极制造工艺',
    source: 'CNIPA',
    type: 'patent',
    tags: ['干法工艺', '电极制造', '降本'],
    publishedAt: '2024',
    abstract: '无溶剂干法电极制备技术，生产能耗降低60%，适用于大规模连续化生产。',
    patentNumber: 'CN2024123456789A',
    status: '已授权',
  },
  {
    id: '6',
    title: '硅基负极在全固态电池中的循环稳定性机理',
    source: 'Advanced Energy Materials',
    type: 'paper',
    tags: ['硅负极', '体积膨胀', '固态电解质'],
    publishedAt: '2024',
    abstract: '研究发现固态电解质的机械约束可有效抑制硅负极的体积膨胀，实现500次以上的稳定循环。',
    authors: ['Tanaka, K.', 'Smith, R.'],
  },
];

// Recent Activities
export const activities: Activity[] = [
  {
    id: '1',
    type: 'document',
    action: '上传',
    target: 'LPSC_502批次_XRD图谱分析.pdf',
    timestamp: '10 分钟前',
  },
  {
    id: '2',
    type: 'intelligence',
    action: '收录',
    target: '全固态电池硫化物电解质的空气稳定性研究',
    timestamp: '30 分钟前',
  },
  {
    id: '3',
    type: 'ai',
    action: '生成',
    target: 'LLZO改性研究文献综述',
    timestamp: '1 小时前',
  },
  {
    id: '4',
    type: 'document',
    action: '更新',
    target: '硫化物电解质_电导率测试报告_2025Q4.xlsx',
    timestamp: '2 小时前',
  },
  {
    id: '5',
    type: 'intelligence',
    action: '收录',
    target: '一种用于抑制锂枝晶的复合负极保护层',
    timestamp: '3 小时前',
  },
];

// AI Simulated Responses
export const aiResponses: Record<string, string> = {
  'LPSC': `## Dept_01 关于 LPSC 合成的最新 SOP

### 文档信息
- **文档名称**: LPSC_Li₆PS₅Cl_标准合成工艺_v3.2
- **更新日期**: 2025-01-15
- **编写人**: 张博士 (无机电解质部)

### 工艺流程概述

**1. 原料准备**
- Li₂S (99.9%, 预干燥 200°C/12h)
- P₂S₅ (99%, 手套箱内称量)
- LiCl (99.9%, 研磨过筛)
- 摩尔比: Li₂S : P₂S₅ : LiCl = 5 : 1 : 2

**2. 球磨混合**
- 设备: Fritsch P7 行星式球磨机
- 球料比: 30:1 (ZrO₂球)
- 转速: 500 rpm
- 时间: 20h (正反交替，5min/次)

**3. 热处理**
- 温度: 550°C
- 时间: 5h
- 气氛: 高纯 Ar (O₂ < 0.1 ppm)

**4. 质量检测**
- XRD确认纯相
- EIS测定离子电导率 (目标: >2 mS/cm)
- ICP确认元素配比`,

  '成本趋势': `## 硫化物 vs 氧化物电解质成本趋势对比

### 2024-2025 成本变化分析

| 材料体系 | 2024 成本 ($/kg) | 2025 成本 ($/kg) | 变化率 |
|---------|-----------------|-----------------|-------|
| Li₆PS₅Cl (硫化物) | 850 | 620 | -27% |
| LGPS (硫化物) | 1,200 | 950 | -21% |
| LLZO (氧化物) | 450 | 380 | -16% |
| LATP (氧化物) | 280 | 240 | -14% |

### 关键洞察

**硫化物电解质**
- 成本下降主要得益于 Li₂S 原料国产化
- 预计 2026 年可降至 400$/kg 以下
- 大规模生产工艺成熟度提升

**氧化物电解质**
- 成本相对稳定，降幅有限
- La、Zr 原料价格波动影响较大
- 烧结能耗仍是主要成本瓶颈

### 预测
2027年硫化物电解质成本有望与氧化物持平，届时性能优势将推动其大规模商用。`,

  '预算': `## 2025 Q4 部门预算消耗报表

### Dept_01_无机电解质部

| 预算类别 | 年度预算 | Q4 已消耗 | 剩余 | 消耗率 |
|---------|---------|---------|-----|-------|
| 原材料采购 | ¥2,400,000 | ¥580,000 | ¥1,820,000 | 24.2% |
| 设备维护 | ¥800,000 | ¥210,000 | ¥590,000 | 26.3% |
| 测试外包 | ¥600,000 | ¥145,000 | ¥455,000 | 24.2% |
| 差旅会议 | ¥200,000 | ¥62,000 | ¥138,000 | 31.0% |
| 其他 | ¥100,000 | ¥28,000 | ¥72,000 | 28.0% |

### 总计
- **年度总预算**: ¥4,100,000
- **Q4 已消耗**: ¥1,025,000 (25.0%)
- **预计年末结余**: ¥3,075,000

### 备注
Q4 原材料采购包含进口 Li₂S 一批 (¥320,000)，已到货。`,

  'default': `您好！我是固态电池研发 AI 助手。我可以帮您：

1. **检索内部文档** - 查询各部门的 SOP、测试报告等
2. **分析外部情报** - 对比论文数据、追踪专利动态
3. **生成报表** - 预算分析、成本趋势等

请告诉我您需要什么帮助？您也可以点击上方的快捷提示开始。`,
};
