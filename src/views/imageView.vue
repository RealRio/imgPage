<script>
import { useRouter } from 'vue-router'
import axios from 'axios'
export default {
  data() {
    return {
      columns: [],
      items: [
      ],
      showLarge: false,
      largeImg: null,
      loading: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.layout);
    axios.get('/api/getImages').then((res) => {
      console.log(res.data);
      this.items = res.data;
      this.layout();
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.layout);
  },
  methods: {
    layout() {
      const containerWidth = this.$el.clientWidth;
      const columnWidth = containerWidth / 4;
      const columns = Array.from({ length: 4 }, () => []);
      let columnIndex = 0;
      console.log(this.items)
      this.items.forEach((item) => {
        columns[columnIndex].push(item);
        columnIndex = (columnIndex + 1) % 4;
      });
      this.columns = columns;
    },
    turnToUpload() {
      this.$router.push('./upload');
    },
    openLargeImg(item) {
      this.showLarge = ture;
      this.largeImg = item;
    },
    hideLargeImg() {
      this.showLarge = false;
    }
  },
};
</script>

<template>
  <header>
    <div>MHY图片</div>
    <button @click='turnToUpload'>发布图片</button>
  </header>
  <div class="waterfall-container">
    <div class="waterfall-column" v-for="(column, index) in columns" :key="index">
      <div class="waterfall-item" v-for="(item, itemIndex) in column" :key="itemIndex">
        <img :src="item.url" alt="" width="220" height="150" @click="openLargeImg" />
        <h5 class="title">item-title{{ item.title }}</h5>
        <h6 class="content">item-desc{{ item.description }}</h6>
      </div>
    </div>
  </div>
  <div class="largeImg" v-if="showLarge">
    <img :src="largeImg.url" @click="hideLargeImg" />
  </div>
  <div class="loading" v-if="loading">
    Loading...
  </div>
</template>
<style scoped>
header {
  position: fixed;
  background-color: #1f2233;
  color: #fff;
  width: 100%;
}

header>div {
  font-size: 20px;
  padding-left: 120px;
  height: 35px;
  line-height: normal;
}

header>button {
  position: fixed;
  right: 120px;
}

.waterfall-container {
  display: flex;
  justify-content: space-between;
  padding: 100px;
  background-color: #f0f1f5;
}

.waterfall-column {
  flex-basis: 25%;
}

.waterfall-item {
  background-color: #ffffff;
  margin-bottom: 20px;
  margin-right: 10px;
  margin-left: 10px;
}
</style>
