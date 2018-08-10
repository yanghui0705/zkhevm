<template>
  <div class="tag-nav">
    <scroll-bar ref="scrollBar">
      <router-link ref="tag" class="tag-nav-item" :class="isActive(item) ? 'cur' : ''"
                   v-for="(item, index) in openedPageList"
                   :to="item.path" :key="index">
        {{item.title}}
        <span class='el-icon-close' @click.prevent.stop="closeTheTag(item, index)"></span>
      </router-link>
    </scroll-bar>
  </div>
</template>

<script>
import ScrollBar from 'sysComponents/ScrollBar'
import {mapMutations, mapGetters} from 'vuex'

export default {
  data() {
    return {
      defaultPage: '/home'
    }
  },
  computed: {
    ...mapGetters([
      'cachePage',
      'openedPageList',
      'cachedPageName'
    ])
  },
  mounted() {
    // 首次加载时将默认页面加入缓存
    this.addTagNav()
  },
  watch: {
    $route() {
      this.addTagNav()
      this.scrollToCurTag()
    }
  },
  methods: {
    ...mapMutations({
      setCachePage: 'setCachePage',
      setOpenedPageList: 'setOpenedPageList',
      setCachedPageName: 'setCachedPageName'
    }),
    addTagNav() {
      // 如果需要缓存则必须使用组件自身的name，而不是router的name
      let data = {
        name: this.$router.getMatchedComponents()[1].name,
        path: this.$route.path,
        title: this.$route.meta.name
      }

      if (this.openedPageList.some(v => v.path === data.path)) return
      if (this.cachedPageName.includes(data.name)) {
        console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
        return
      }
      this.openedPageList.push(data)
      if (this.cachePage) {
        this.cachedPageName.push(data.name)
      }
    },
    isActive(item) {
      return item.path === this.$route.path
    },
    closeTheTag(item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit('tagNav/removeTagNav', item)

      if (item) {
        for (let [i, v] of this.openedPageList.entries()) {
          if (v.path === item.path) {
            this.openedPageList.splice(i, 1)
          }
        }

        if (this.cachePage) {
          let index = this.cachedPageName.indexOf(item.name)
          if (index >= 0) {
            this.cachedPageName.splice(index, 1)
          }
        }
      } else {
        this.openedPageList = []
        this.cachedPageName = []
      }

      if (this.$route.path === item.path) {
        if (index) {
          this.$router.push(this.openedPageList[index - 1].path)
        } else {
          this.$router.push(this.defaultPage)
          if (this.$route.path === '/home') {
            this.addTagNav()
          }
        }
      }
    },
    scrollToCurTag() {
      this.$nextTick(() => {
        for (let item of this.$refs.tag) {
          if (item.to === this.$route.path) {
            this.$refs.scrollBar.scrollToCurTag(item.$el)
            break
          }
        }
      })
    }
  },
  components: {ScrollBar}
}
</script>
