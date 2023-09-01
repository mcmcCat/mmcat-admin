<!-- 接口文档 -->
<template>
  <div class="app-container">
    <!-- <iframe>标签是HTML中的一个元素，用于在当前页面内嵌其他网页或者展示媒体内容，比如音频、视频等。它使用src属性来指定要嵌入的网页的地址或者媒体的URL。 -->
    <iframe
      src="https://www.apifox.cn/apidoc/shared-195e783f-4d85-4235-a038-eec696de4ea5"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;

  /* 84 = navbar + tags-view = 50 + 34 */
  height: calc(100vh - 50px);
}

.hasTagsView {
  .app-container {
    height: calc(100vh - 84px);
  }
}
</style>
