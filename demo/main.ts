import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
// KaTeX 样式：库不再内置，使用数学公式时需自行引入
import 'katex/dist/katex.min.css'
import App from './App.vue'

const app = createApp(App)
app.use(Antd)
app.mount('#app')
