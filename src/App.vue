<template>
  <div id="app">
    <!-- 一级路由容器 -->

  <!-- 如果不加控制 会缓存所有的组件实例  -->
  <!-- 只要 keep-alive 包裹 就会缓存所有的组件实例-->
  <!-- 如果不包裹 就不缓存实例 -->
  <keep-alive>
    <!-- 以及路由只缓存了layout -->
    <!-- 当缓存时 里面的一级路由容器生效 -->
    <router-view v-if="$route.meta.isAlive" />
  </keep-alive>
  <!-- 条件渲染 当不缓存时 外面的一级路由容器生效 -->
  <router-view v-if="!$route.meta.isAlive" />
  <!-- 要根据当前的meta中的 isAlive属性决定 是否缓存组件 $route.meta.isAlive -->
  </div>
</template>

<style lang="less">

</style>
