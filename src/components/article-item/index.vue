<template>
  <van-cell class="article-item">
    <div slot="title"
         class="title">{{ article.title }}</div>

    <div slot="label">
      <!-- 文章缩略图 -->
      <div v-if="article.cover.type===3"
           class="cover-wrap">
        <div class="cover-wrap-item"
             v-for="(img, index) in article.cover.images"
             :key="index">
          <van-image class="cover-image"
                     fit="cover"
                     :src="img" />
        </div>
      </div>

      <!-- 底部评论区域 -->
      <div class="label-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>

    </div>
    <!-- 右侧value的值 -->
    <van-image v-if="article.cover.type === 1"
               class="right-cover"
               fit="cover"
               :src="article.cover.images[0]" />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  data() {
    return {}
  },
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .right-cover {
    width: 116px;
    height: 73px;
  }
  .cover-wrap {
    display: flex;
    padding: 15px 0;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-image {
        width: 100%;
        height: 73px;
      }
    }
  }
  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
  }
  .label-wrap span {
    margin-right: 12px;
  }
}
</style>