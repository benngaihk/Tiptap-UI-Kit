/**
 * 内置模板定义
 * @description 提供常用的文档模板，可通过工具栏插入
 */

export interface TemplateItem {
  /** 模板唯一标识 */
  key: string
  /** 模板名称（翻译 key） */
  nameKey: string
  /** 模板描述（翻译 key） */
  descKey: string
  /** 模板 HTML 内容 */
  content: string
}

/**
 * 会议纪要模板
 */
const meetingMinutes: TemplateItem = {
  key: 'meeting-minutes',
  nameKey: 'editor.templateMeetingMinutes',
  descKey: 'editor.templateMeetingMinutesDesc',
  content: `
<h2>会议纪要</h2>
<table>
  <tr><th>项目</th><th>内容</th></tr>
  <tr><td>会议主题</td><td></td></tr>
  <tr><td>日期</td><td></td></tr>
  <tr><td>参会人</td><td></td></tr>
  <tr><td>主持人</td><td></td></tr>
</table>
<h3>议题与讨论</h3>
<ol>
  <li><p></p></li>
</ol>
<h3>决议事项</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>待办事项</h3>
<table>
  <tr><th>事项</th><th>负责人</th><th>截止日期</th></tr>
  <tr><td></td><td></td><td></td></tr>
  <tr><td></td><td></td><td></td></tr>
</table>
`.trim(),
}

/**
 * 周报模板
 */
const weeklyReport: TemplateItem = {
  key: 'weekly-report',
  nameKey: 'editor.templateWeeklyReport',
  descKey: 'editor.templateWeeklyReportDesc',
  content: `
<h2>周报</h2>
<p><strong>姓名：</strong></p>
<p><strong>日期：</strong></p>
<h3>本周完成</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>进行中</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>下周计划</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>问题与风险</h3>
<ul>
  <li><p></p></li>
</ul>
`.trim(),
}

/**
 * 项目方案模板
 */
const projectPlan: TemplateItem = {
  key: 'project-plan',
  nameKey: 'editor.templateProjectPlan',
  descKey: 'editor.templateProjectPlanDesc',
  content: `
<h2>项目方案</h2>
<h3>1. 项目概述</h3>
<p></p>
<h3>2. 项目目标</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>3. 实施方案</h3>
<h4>3.1 技术方案</h4>
<p></p>
<h4>3.2 时间计划</h4>
<table>
  <tr><th>阶段</th><th>任务</th><th>起止时间</th><th>负责人</th></tr>
  <tr><td></td><td></td><td></td><td></td></tr>
  <tr><td></td><td></td><td></td><td></td></tr>
</table>
<h3>4. 资源需求</h3>
<p></p>
<h3>5. 风险评估</h3>
<table>
  <tr><th>风险</th><th>影响</th><th>应对措施</th></tr>
  <tr><td></td><td></td><td></td></tr>
</table>
`.trim(),
}

/**
 * 日报模板
 */
const dailyReport: TemplateItem = {
  key: 'daily-report',
  nameKey: 'editor.templateDailyReport',
  descKey: 'editor.templateDailyReportDesc',
  content: `
<h2>日报</h2>
<p><strong>姓名：</strong></p>
<p><strong>日期：</strong></p>
<h3>今日完成</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>明日计划</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>备注</h3>
<p></p>
`.trim(),
}

/**
 * 产品需求文档模板
 */
const productRequirement: TemplateItem = {
  key: 'product-requirement',
  nameKey: 'editor.templateProductRequirement',
  descKey: 'editor.templateProductRequirementDesc',
  content: `
<h2>产品需求文档 (PRD)</h2>
<h3>1. 需求背景</h3>
<p></p>
<h3>2. 需求目标</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>3. 用户故事</h3>
<p>作为 <em>[角色]</em>，我希望 <em>[功能]</em>，以便 <em>[价值]</em></p>
<h3>4. 功能描述</h3>
<h4>4.1 功能列表</h4>
<table>
  <tr><th>功能</th><th>优先级</th><th>描述</th></tr>
  <tr><td></td><td>P0</td><td></td></tr>
  <tr><td></td><td>P1</td><td></td></tr>
</table>
<h4>4.2 详细设计</h4>
<p></p>
<h3>5. 非功能需求</h3>
<ul>
  <li><p></p></li>
</ul>
<h3>6. 上线计划</h3>
<p></p>
`.trim(),
}

/**
 * 所有内置模板
 */
export const builtinTemplates: TemplateItem[] = [
  meetingMinutes,
  weeklyReport,
  dailyReport,
  projectPlan,
  productRequirement,
]
