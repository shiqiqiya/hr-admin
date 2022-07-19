// 自定义指令 封装一个dom操作的时候 供页面的一堆组件去使用

export const imgerror = {
  // 数据更新的时候就执行
  update (el, binding) {
    el.onerror = () => {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}

