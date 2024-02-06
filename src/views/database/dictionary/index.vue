<template>
  <div class="dictionary-container">
    <div class="drug-producer">
      <h1 class="title">试剂制造商</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.producerTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.producerTags,tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.producerTags"
        v-model="inputList.producerTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('producerTags')"
        @blur="handleInputConfirm('producerTags')"
        @keyup.escape.native="visibleList.producerTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('producerTags')">+ New Tag</el-button>
    </div>

    <div class="lab-location">
      <h1 class="title">实验室位置</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.labTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.labTags, tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.labTags"
        v-model="inputList.labTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('labTags')"
        @blur="handleInputConfirm('labTags')"
        @keyup.escape.native="visibleList.labTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('labTags')">+ New Tag</el-button>
    </div>

    <div class="drug-location">
      <h1 class="title">试剂存储位置</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.locationTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.locationTags, tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.locationTags"
        v-model="inputList.locationTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('locationTags')"
        @blur="handleInputConfirm('locationTags')"
        @keyup.escape.native="visibleList.locationTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('locationTags')">+ New Tag</el-button>
    </div>

    <div class="purchase-source">
      <h1 class="title">购买渠道</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.sourceTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.sourceTags, tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.sourceTags"
        v-model="inputList.sourceTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('sourceTags')"
        @blur="handleInputConfirm('sourceTags')"
        @keyup.escape.native="visibleList.sourceTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('sourceTags')">+ New Tag</el-button>
    </div>

    <div class="waste-type">
      <h1 class="title">废弃类型</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.wasteTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.wasteTags, tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.wasteTags"
        v-model="inputList.wasteTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('wasteTags')"
        @blur="handleInputConfirm('wasteTags')"
        @keyup.escape.native="visibleList.wasteTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('wasteTags')">+ New Tag</el-button>
    </div>
  </div>
</template>

<script>
import { getProducers, getLabs, getLocations, getSources, getWastes } from "@/api/dictionary";

export default {
  name: "dictionary",
  data() {
    return {
      tagList:{
        producerTags: [],
        labTags: [],
        locationTags: [],
        sourceTags: [],
        wasteTags: [],
      },
      visibleList:{
        producerTags: false,
        labTags: false,
        locationTags: false,
        sourceTags: false,
        wasteTags: false,
      },
      inputList: {
        producerTags: "",
        labTags: "",
        locationTags: "",
        sourceTags: "",
        wasteTags: "",
      },
      inputValue: "",

    };
  },
  created() {},
  methods: {
    handleClose(tags,tag) {
      const index = tags.indexOf(tag);
      if(index >= 0) {
        tags.splice(index, 1);
      }
    },
    showInput(tagType){
      this.visibleList[tagType] = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(tagType) {
      console.log(tagType);
      let inputValue = this.inputList[tagType];
      console.log(inputValue);
      if (inputValue) {
        this.tagList[tagType].push(inputValue);
        this.inputList[tagType] = ""; // 清空输入框
      }
      this.visibleList[tagType] = false; // 隐藏输入框
    }
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 15px;
}

.button-new-tag {
  margin-left: 10px;
  height: fit-content;
}

.dictionary-container {
  padding: 20px;
  // 设定内部元素的间距
  .drug-producer,
  .lab-location,
  .drug-location,
  .purchase-source {
    margin-bottom: 20px;
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>