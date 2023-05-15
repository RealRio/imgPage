<template>
    <div class="dialog" v-if="visible">
      <div class="dialog-overlay"></div>
      <div class="dialog-container">
        <div class="dialog-title">{{ title }}</div>
        <div class="dialog-content">
          <slot></slot>
        </div>
        <div class="dialog-footer">
          <button @click="handleCancel">取消</button>
          <button @click="handleOk">确定</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dialog',
    props: {
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleCancel() {
        this.$emit('cancel')
      },
      handleOk() {
        this.$emit('ok')
      }
    }
  }
  </script>
  
  <style scoped>
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .dialog-container {
    position: relative;
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
  }
  .dialog-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  button {
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007aff;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  button:first-child {
    background-color: #ccc;
    color: #333;
  }
  </style>
  