<script>
import { useRouter } from 'vue-router'
import axios from 'axios'
const PAGE_SIZE = 20;

export default {
  data() {
    return {
      columns: [],
      items: [
      ],
      showLarge: false,
      largeImgUrl: null,
      isLoading: false,
      lastIndex: 0,
      isEnd: false
    };
  },
  computed: {
    imgUrlList() {
      return this.items.map(item => item.url);
    }
  },
  mounted() {
    // 
    window.addEventListener('scroll', this.fetchImg)
    axios.post('/api/getImages', {
      pageSize: PAGE_SIZE,
      lastIndex: this.lastIndex,
    }).then((res) => {
      // console.log(res.data);
      this.items = res.data;
      this.lastIndex = this.items[this.items.length - 1].sort_index;
      this.layout();
    })
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.fetchImg)
  },
  methods: {
    isScrollAtBottom() {
      // 判断滚动位置是否接近页面底部
      return window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100;
    },
    fetchImg() {
      if (this.isScrollAtBottom() && !this.isLoading) {
        this.isLoading = true; // 设置加载状态为 true
        // 发起异步请求获取新数据
        axios.post('/api/getImages', {
          pageSize: PAGE_SIZE,
          lastIndex: this.lastIndex,
        }).then((res) => {
          // console.log(res.data);
          this.lastIndex = res.data[res.data.length - 1].sort_index;
          let columnIndex = 0;
          this.items.push(...res.data);
          res.data.forEach((item) => {
            this.columns[columnIndex].push(item);
            columnIndex = (columnIndex + 1) % 4;
          })
          this.isLoading = false; // 请求完成时，重置加载状态为 false
        }).catch((error) => {
          console.error('Failed to fetch data:', error);
          this.isLoading = false; // 请求失败时，重置加载状态为 false
          this.isEnd = true;
        });
      }
      else {
        // console.log(this.isScrollAtBottom(), this.isLoading)
      }
    },
    fetchData() {
      // 异步请求数据的逻辑，返回 Promise
    },
    renderData(data) {
      // 渲染数据到页面的逻辑
    },
    showPreviousImg() {

      console.log(this.imgUrlList);
      console.log(this.showLarge);
      const currentIndex = this.imgUrlList.indexOf(this.largeImgUrl);
      this.largeImgUrl = this.imgUrlList[(currentIndex - 1 + this.imgUrlList.length) % this.imgUrlList.length]
    },
    showNextImg() {
      console.log(this.imgUrlList);
      const currentIndex = this.imgUrlList.indexOf(this.largeImgUrl);
      this.largeImgUrl = this.imgUrlList[(currentIndex - 1 + this.imgUrlList.length) % this.imgUrlList.length]
    },

    layout() {
      const containerWidth = this.$el.clientWidth;
      const columnWidth = containerWidth / 4;
      const columns = Array.from({ length: 4 }, () => []);
      let columnIndex = 0;
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
      this.showLarge = true;
      this.largeImgUrl = item.url;
      console.log(this.largeImgUrl);
    },
    hideLargeImg() {
      this.showLarge = false;
    }
  },
};
</script>

<template>
  <header>
    <div><span>MHY图片</span></div>
    <div>
      <button @click='turnToUpload'>发布图片</button>
    </div>
  </header>
  <div class="waterfall-container">
    <div class="waterfall-column" v-for="(column, index) in columns" :key="index">
      <div class="waterfall-item" v-for="(item, itemIndex) in column" :key="itemIndex">
        <img :src="item.url" alt="" width="220" height="150" @click="openLargeImg(item)" />
        <h5 class="title">{{ item.title }}</h5>
        <h6 class="content">{{ item.description }}</h6>
      </div>
    </div>
  </div>
  <div class="largeImgContainer" v-if="showLarge">
    <span @click="showPreviousImg"><img class="leftIcon" :src="'/image/left.svg'" /></span>
    <span @click="showNextImg"><img class="rightIcon" :src="'/image/right.svg'"></span>
    <span @click="hideLargeImg"><img class="closeIcon" :src="'/image/close.svg'"></span>
    <img :src="largeImgUrl" />
  </div>
  <div class="loading" v-if="isLoading">
    Loading...
  </div>
  <div class="loading" v-if="isEnd && !isLoading">
    <span>到底啦</span>
  </div>
</template>
<style scoped>
header {
  color: #fff;
  width: 100%;
  position: fixed;
  margin: -8px -8px;
}

header div:nth-child(1) {
  background-color: #1f2233;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  font-size: 20px;
  padding-left: 120px;
  height: 50px;
  line-height: normal;
}

header div:nth-child(2) {
  background-color: #fff;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  font-size: 20px;
  padding-left: 120px;
  height: 50px;
}

header button {
  background-color: #ffe14c;
  color: #663c00;
  margin-top: 0;
  margin-left: 80%;
}

.waterfall-container {
  display: flex;
  justify-content: space-between;
  padding: 110px 150px 10px 150px;
  background-color: #f0f1f5;
}

.largeImgContainer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 998;
}

.largeImgContainer img {
  max-width: 1100px;
  max-height: 680px;
}


.leftIcon {
  z-index: 999;
  position: fixed;
  top: 50%;
  transform: translate(-100%);
  height: 36px;
  width: 36px;
  cursor: pointer;
}

.rightIcon {
  z-index: 999;
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translate(100%);
  height: 36px;
  width: 36px;
  cursor: pointer;

}

.closeIcon {
  z-index: 999;
  position: fixed;
  top: 0px;
  right: 0px;
  height: 36px;
  width: 36px;
  cursor: pointer;

}

.waterfall-column {
  flex-basis: 25%;
}

.waterfall-item {
  background-color: #ffffff;
  width: 220px;
  margin: 16px 8px;
  /* margin-bottom: 20px;
  margin-right: 10px;
  margin-left: 10px; */
}

.title {
  margin: 4px 0 4px 0;
  padding-left: 8px;
  font-weight: 2000;
  text-overflow: ellipsis;
}

.content {
  margin: 4px 0 4px 0;
  padding-left: 8px;
  font-weight: 400;
  text-overflow: ellipsis;
  padding-bottom: 5px;
}
</style>
