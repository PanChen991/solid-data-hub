// Mock data for SSB-KMS (Solid-State Battery Knowledge Management System)

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx';
  size: string;
  createdAt: string;
  author: string;
  tags: string[];
  summary: string;
  department: string;
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

// Internal Documents
export const documents: Document[] = [
  {
    id: '1',
    name: '2024_Q4_硫化物电解质稳定性测试报告.pdf',
    type: 'pdf',
    size: '4.2 MB',
    createdAt: '2024-12-15',
    author: '张博士',
    tags: ['硫化物', '电解质', '稳定性测试'],
    summary: '本报告详细记录了2024年第四季度对Li₆PS₅Cl硫化物电解质在不同温度和湿度条件下的稳定性测试结果。测试涵盖了电化学阻抗谱(EIS)、X射线衍射(XRD)和拉曼光谱分析。结果表明，该电解质在干燥氩气环境下表现出优异的稳定性，但在相对湿度超过5%时会发生明显的分解反应。',
    department: '电解质研发部',
  },
  {
    id: '2',
    name: '无负极金属锂沉积工艺_SOP_v2.docx',
    type: 'docx',
    size: '1.8 MB',
    createdAt: '2024-11-28',
    author: '李工程师',
    tags: ['无负极', '金属锂', '工艺标准'],
    summary: '本标准操作程序(SOP)第二版详细描述了无负极固态电池中金属锂的原位沉积工艺。包括集流体预处理、电解质界面改性、充电协议优化等关键步骤。相比第一版，新增了脉冲充电模式和温度梯度控制方案，可有效减少锂枝晶生成并提高库伦效率至99.5%以上。',
    department: '工艺开发部',
  },
  {
    id: '3',
    name: '高通量实验室设备清单_2025.xlsx',
    type: 'xlsx',
    size: '856 KB',
    createdAt: '2024-12-01',
    author: '王主管',
    tags: ['设备管理', '高通量', '实验室'],
    summary: '2025年度高通量材料筛选实验室设备采购与维护清单。包含自动化电池组装系统、多通道电化学工作站、原位XRD设备等核心设备的规格参数、供应商信息、维护周期及预算分配。本年度新增AI驱动的实验设计模块。',
    department: '实验室管理部',
  },
  {
    id: '4',
    name: '固态电池安全性评估指南.pdf',
    type: 'pdf',
    size: '3.1 MB',
    createdAt: '2024-10-20',
    author: '陈博士',
    tags: ['安全性', '评估标准', '测试方法'],
    summary: '本指南涵盖固态电池从单体到模组的全面安全性评估方法，包括热失控测试、机械滥用测试、电滥用测试等。特别针对硫化物和氧化物电解质体系制定了专门的测试协议，并与现行锂离子电池标准进行了对照说明。',
    department: '安全测试部',
  },
  {
    id: '5',
    name: '正极包覆工艺优化方案.pptx',
    type: 'pptx',
    size: '12.5 MB',
    createdAt: '2024-11-15',
    author: '刘研究员',
    tags: ['正极', '包覆工艺', '界面改性'],
    summary: '本演示文稿汇报了LiNbO₃包覆层对NCM811正极材料与硫化物电解质界面稳定性的改善效果。通过ALD和溶液法两种包覆工艺的对比研究，确定了最优包覆厚度(5-10nm)和工艺参数，使界面阻抗降低了60%以上。',
    department: '材料研发部',
  },
  {
    id: '6',
    name: 'LLZO陶瓷电解质烧结参数研究.pdf',
    type: 'pdf',
    size: '5.7 MB',
    createdAt: '2024-09-30',
    author: '周博士',
    tags: ['LLZO', '氧化物', '烧结工艺'],
    summary: '系统研究了Li₇La₃Zr₂O₁₂(LLZO)石榴石型电解质的烧结温度、保温时间、气氛对致密度和离子电导率的影响。通过引入少量Al和Ta掺杂，成功将室温离子电导率提升至1.2 mS/cm，为大规模生产提供了工艺指导。',
    department: '电解质研发部',
  },
];

// External Intelligence (Papers & Patents)
export const intelligences: Intelligence[] = [
  {
    id: '1',
    title: '全固态锂电池高电导率硫化物电解质研究进展',
    source: 'Nature Energy',
    type: 'paper',
    tags: ['硫化物', '电解质', '综述'],
    publishedAt: '2024-12-10',
    abstract: '本综述系统总结了近五年来硫化物固态电解质的研究进展，重点分析了Li₆PS₅X (X=Cl, Br, I)和Li₁₀GeP₂S₁₂体系的结构-性能关系。讨论了提高离子电导率的掺杂策略和降低界面阻抗的表面改性方法，并展望了实用化面临的关键挑战。',
    authors: ['Wang, Y.', 'Zhang, H.', 'Li, M.'],
  },
  {
    id: '2',
    title: '专利：一种用于固态电池的复合正极包覆方法',
    source: 'CNIPA',
    type: 'patent',
    tags: ['正极包覆', '复合材料', '工艺专利'],
    publishedAt: '2024-11-25',
    abstract: '本发明公开了一种固态电池复合正极的多层包覆方法。通过先采用溶液法形成离子导体内层，再通过ALD沉积电子绝缘外层的双层包覆策略，有效抑制了正极与电解质之间的副反应，显著提升了电池的循环寿命。',
    patentNumber: 'CN2024123456789A',
  },
  {
    id: '3',
    title: '锂金属负极界面稳定性的原位电化学研究',
    source: 'Science',
    type: 'paper',
    tags: ['锂金属', '界面', '原位表征'],
    publishedAt: '2024-12-05',
    abstract: '采用原位透射电子显微镜和原位X射线技术，首次实时观察了锂金属在固态电解质界面的沉积和溶解行为。发现锂沉积优先发生在电解质晶界处，并揭示了锂枝晶穿透电解质的微观机制，为设计更安全的固态电池提供了关键见解。',
    authors: ['Chen, X.', 'Liu, W.', 'Park, J.'],
  },
  {
    id: '4',
    title: '专利：一种干法电极制造工艺及设备',
    source: 'CNIPA',
    type: 'patent',
    tags: ['干法工艺', '电极制造', '设备专利'],
    publishedAt: '2024-10-18',
    abstract: '本发明涉及一种无溶剂的干法电极制造工艺，通过高剪切混合和热压成型制备固态电池电极片。该工艺可避免溶剂残留对电解质的影响，同时大幅降低能耗和生产成本，适用于大规模连续化生产。',
    patentNumber: 'CN2024987654321A',
  },
  {
    id: '5',
    title: '硅基负极在固态电池中的应用研究',
    source: 'Advanced Energy Materials',
    type: 'paper',
    tags: ['硅负极', '体积膨胀', '固态电池'],
    publishedAt: '2024-11-30',
    abstract: '研究了纳米硅/碳复合负极在硫化物全固态电池中的电化学性能。发现固态电解质可有效约束硅的体积膨胀，实现了超过500次循环的稳定容量保持。同时分析了外加压力对电极结构稳定性的影响规律。',
    authors: ['Kim, S.', 'Tanaka, K.', 'Smith, R.'],
  },
  {
    id: '6',
    title: '专利：一种固态电池热管理系统',
    source: 'USPTO',
    type: 'patent',
    tags: ['热管理', '电池系统', '安全'],
    publishedAt: '2024-12-01',
    abstract: '本发明公开了一种针对固态电池组的智能热管理系统。通过分布式温度传感器阵列和预测性控制算法，可实现电池组温度的精确控制，确保固态电池在最佳温度窗口内工作，提高能量效率和使用寿命。',
    patentNumber: 'US2024/0123456',
  },
  {
    id: '7',
    title: '聚合物-无机复合电解质的设计策略',
    source: 'Nature Materials',
    type: 'paper',
    tags: ['复合电解质', '聚合物', '无机填料'],
    publishedAt: '2024-11-20',
    abstract: '综述了聚合物基体与无机填料复合固态电解质的最新进展。分析了不同类型无机填料(氧化物、硫化物、卤化物)与聚合物的协同效应，讨论了复合电解质中离子传输机制和界面相容性问题。',
    authors: ['Lee, J.', 'Wang, Q.', 'Brown, T.'],
  },
];

// Recent Activities
export const activities: Activity[] = [
  {
    id: '1',
    type: 'document',
    action: '上传',
    target: '2024_Q4_硫化物电解质稳定性测试报告.pdf',
    timestamp: '10 分钟前',
  },
  {
    id: '2',
    type: 'intelligence',
    action: '收录',
    target: '全固态锂电池高电导率硫化物电解质研究进展',
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
    target: '无负极金属锂沉积工艺_SOP_v2.docx',
    timestamp: '2 小时前',
  },
  {
    id: '5',
    type: 'intelligence',
    action: '收录',
    target: '专利：一种用于固态电池的复合正极包覆方法',
    timestamp: '3 小时前',
  },
  {
    id: '6',
    type: 'ai',
    action: '分析',
    target: '宁德时代固态电池专利趋势',
    timestamp: '昨天',
  },
];

// AI Simulated Responses
export const aiResponses: Record<string, string> = {
  'LLZO': `## LLZO 锆酸镧锂的最新改性研究总结

### 研究热点方向

**1. 元素掺杂改性**
- **Al掺杂**: 最常用的稳定立方相策略，0.2-0.3 mol Al可将离子电导率提升至10⁻⁴ S/cm
- **Ta/Nb掺杂**: 在Zr位掺杂，可进一步提高电导率至10⁻³ S/cm级别
- **Ga掺杂**: 新兴研究方向，有助于降低烧结温度

**2. 烧结工艺优化**
- 热压烧结可获得>98%致密度
- 闪烧技术(Flash sintering)可在数秒内完成致密化
- 气氛控制(O₂/N₂)对Li挥发有显著影响

**3. 界面工程**
- 原位形成Li₃N中间层改善与锂金属兼容性
- 聚合物缓冲层降低界面阻抗
- 3D结构设计增大有效接触面积

### 最新突破
2024年Nature Energy报道的Ga-LLZO在25°C下实现1.5 mS/cm电导率，是目前氧化物电解质的最高水平。`,

  '硅基负极': `## 硅基负极膨胀数据对比报告

### 不同硅基材料体积变化对比

| 材料类型 | 理论容量 (mAh/g) | 体积膨胀率 | 首效 | 循环稳定性 |
|---------|-----------------|-----------|------|-----------|
| 纯硅 | 4200 | ~300% | 75-80% | 差 (<50次) |
| 硅/碳复合 | 1500-2500 | 100-150% | 85-88% | 中等 (200次) |
| 硅氧化物 SiOₓ | 1800-2200 | 120-160% | 70-75% | 良好 (300次) |
| 纳米硅@碳 | 2000-2800 | 80-120% | 88-92% | 良好 (400次) |
| 多孔硅 | 3000-3500 | 60-100% | 82-85% | 优秀 (500次) |

### 固态电池中的表现
在固态电解质体系中，由于电解质的机械约束作用，硅基负极的体积膨胀得到有效抑制：
- 硫化物电解质体系：膨胀率降低40-60%
- 外加压力(5-10 MPa)可进一步改善电极完整性
- 推荐采用预锂化策略补偿首次不可逆容量损失`,

  '宁德时代': `## 宁德时代固态电池最新专利分析

### 2024年重点专利布局

**1. 硫化物电解质体系 (23项)**
- CN2024XXXXXX1: Li₆PS₅Cl电解质的低成本制备方法
- CN2024XXXXXX2: 硫化物电解质与正极的界面改性层
- CN2024XXXXXX3: 抗潮湿硫化物电解质复合材料

**2. 氧化物电解质体系 (15项)**
- CN2024XXXXXX4: LLZO薄膜的快速烧结技术
- CN2024XXXXXX5: 氧化物-聚合物复合电解质

**3. 电池结构设计 (18项)**
- CN2024XXXXXX6: 双极性固态电池堆叠结构
- CN2024XXXXXX7: 三明治式固态电池封装方案

**4. 制造工艺 (12项)**
- CN2024XXXXXX8: 干法电极连续化生产线
- CN2024XXXXXX9: 固态电池自动化组装系统

### 技术趋势判断
- 宁德时代正在同步推进硫化物和氧化物两条技术路线
- 半固态电池(凝胶电解质)作为过渡方案已进入量产准备
- 预计2026年前实现小批量全固态电池产品交付`,

  'default': `感谢您的问题！作为固态电池研发AI助手，我可以帮您：

1. **文献检索与综述** - 搜索并总结特定主题的最新研究进展
2. **数据分析** - 对比不同材料体系的性能参数
3. **专利分析** - 追踪竞争对手的技术布局
4. **实验建议** - 基于已有数据提供实验设计建议

请提供更具体的问题，我将为您生成详细的分析报告。您也可以点击上方的快捷提示快速开始。`,
};
