import PageTool from './PageTool'
import UploadImage from './UploadImage'
import FullScreen from './FullScreen'
import TagsView from './TagsView'

export default {
  // 插件就是一个对象，它里面有个固定写法 叫install
  // install 安装
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
    Vue.component('FullScreen', FullScreen)
    Vue.component('TagsView', TagsView)
  }
}
