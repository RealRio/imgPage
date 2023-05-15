<!-- <script setup>

  const upload = function () {
    console.log('发布成功，等待审核...');
    this.$router.push('/');
  }

</script>

<template>
  <form>
    标题：<input type="text" name="title" />
    图片描述：<input type="textarea" name="description" />
    上传图片：<input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" multiple>
    <Button @click="upload">发布</Button>>
  </form>
</template>
<style scoped></style> -->
<template>
  <div class="upload-page">
    <h1>图片上传</h1>
    <div>
      标题：<input type="text" v-model="title" />
      图片描述：<input type="textarea" v-model="description" />
      上传图片:<input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" multiple @change="handleFileChange">
    </div>
    <div class="preview">
      <div v-for="(file, index) in files" :key="file.id" class="file-preview">
        <img :src="file.previewUrl" v-if="file.previewUrl">
        <div v-else class="empty-preview">暂无预览</div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <button @click="deleteFile(index)">删除</button>
        </div>
      </div>
      <div v-if="files.length === 0" class="empty-hint">暂无文件</div>
    </div>
    <div v-if="uploading" class="loading">
      <div class="loading-icon"></div>
      <div class="loading-text">上传中...</div>
    </div>
    <div v-if="uploadSuccess" class="success-hint">上传成功</div>
    <div v-if="uploadError" class="error-hint">上传失败</div>
    <button @click="upload">发布</button>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      files: [],
      uploading: false,
      uploadSuccess: false,
      uploadError: false,
      title: '',
      description: '',
    }
  },
  methods: {
    handleFileChange(e) {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        file.id = Math.random().toString(36).substr(2, 9)
        file.previewUrl = URL.createObjectURL(file)
        file.title = this.title
        file.description = this.description
      })
      console.log(files)
      this.files = this.files.concat(files)
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    upload() {
      this.uploading = true
      const formData = new FormData();
      this.files.forEach(file => {
        formData.append('images', file)
        formData.append('title', file.title)
        formData.append('description', file.description)
      })
      formData.forEach((value, key) => {
        console.log(`key${key},value${JSON.stringify(value)}`)
      })
      axios.post('/api/uploadImage', formData).then(response => {
        this.uploading = false
        if (response.data.status === 'success') {
          this.uploadSuccess = true;
          this.message = '上传成功'
          if (confirm('是否继续上传？')) {
            this.files = [];
          }
          else {
            this.$router.push('/')
          }
        } else {
          this.uploadSuccess = false;
          this.message = '上传失败，请稍后重试'
        }
      }).catch(error => {
        this.uploading = false
        this.uploadSuccess = false;
        this.message = '上传失败，请稍后重试'
      })
    },
  }
}
</script>

<style>
.upload-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.loading-icon {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

.loading-text {
  font-size: 18px;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview>div img {
  max-width: 100px;
  max-height: 100px;
}
</style>