<template>
  <div class="dictionary-container">
    <div class="drug-producer">
      <h1 class="title">试剂制造商</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.drugTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.drugTags,tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.drugTags"
        v-model="inputList.drugTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('drugTags')"
        @blur="handleInputConfirm('drugTags')"
        @keyup.escape.native="visibleList.drugTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('drugTags')">+ New Tag</el-button>
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
        v-for="tag in tagList.purchaseTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tagList.purchaseTagsS, tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.purchaseTags"
        v-model="inputList.purchaseTags"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('purchaseTags')"
        @blur="handleInputConfirm('purchaseTags')"
        @keyup.escape.native="visibleList.purchaseTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('purchaseTags')">+ New Tag</el-button>
    </div>
  </div>
</template>

<script>
import { getDrugList } from '@/api/drug';

export default {
  name: "dictionary",
  data() {
    return {
      tagList:{
        drugTags: ["标签一", "标签二", "标签三"],
        labTags: ["实验室1", "实验室2", "实验室3"],
        locationTags: ["位置1", "位置2", "位置3"],
        purchaseTags: ["渠道1", "渠道2", "渠道3"],
      },

      visibleList:{
        drugTags: false,
        labTags: false,
        locationTags: false,
        purchaseTags: false,
      },
      inputList: {
        drugTags: "",
        labTags: "",
        locationTags: "",
        purchaseTags: "",
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