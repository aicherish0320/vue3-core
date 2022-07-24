<template>
  <router-view />
  <van-tabbar route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/mine">我的</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="/profile">个人中心</van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
