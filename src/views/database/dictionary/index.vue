<template>
  <div class="dictionary-container">
    <div class="drug-producer">
      <h1 class="title">试剂制造商</h1>
      <el-tag
        :key="tag"
        v-for="tag in tagList.producerTags"
        closable
        :disable-transitions="false"
        @close="openDialog(tagList.producerTags,tag,'producerTags')"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.producerTags"
        v-model="inputList.producerTags"
        ref="saveTagInput"
        size="small"
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
        @close="openDialog(tagList.labTags, tag, 'labTags')"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.labTags"
        v-model="inputList.labTags"
        ref="saveTagInput"
        size="small"
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
        @close="openDialog(tagList.locationTags, tag, 'locationTags')"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.locationTags"
        v-model="inputList.locationTags"
        ref="saveTagInput"
        size="small"
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
        @close="openDialog(tagList.sourceTags, tag, 'sourceTags')"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.sourceTags"
        v-model="inputList.sourceTags"
        ref="saveTagInput"
        size="small"
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
        @close="openDialog(tagList.wasteTags, tag, 'wasteTags')"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="visibleList.wasteTags"
        v-model="inputList.wasteTags"
        ref="saveTagInput"
        size="small"
        @blur="handleInputConfirm('wasteTags')"
        @keyup.escape.native="visibleList.wasteTags = false"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('wasteTags')">+ New Tag</el-button>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <span>选择并入的标签</span>
      <!-- 警告语句 -->
      <span style="color: red; margin-left: 10px;">警告：合并操作会影响全局相应数据项！</span>
      <el-select v-model="inputValue" placeholder="请选择" style="width: 100%; margin-top: 5px;">
        <template v-for="item in selectedTag.tagType">
          <el-option
            v-if="item !== selectedTag.tag"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </template>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="handleDelete(selectedTag.tagType, selectedTag.tag, selectedTag.tagName)">仅 删 除</el-button>
        <el-button type="danger" @click="handleClose(selectedTag.tagType, selectedTag.tag, selectedTag.tagName)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDictionary, deleteDictionary, addDictionary, mergeDictionary } from '@/api/dictionary';

export default {
  name: "dictionary",
  data() {
    return {
      selectedTag:{
        tagType: "",
        tag: "",
        tagName: "",
      },
      dialogVisible: false,
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
      addQuery: {
        tagType: "",
        tag: "",
      },
      deleteQuery: {
        tagType: "",
        tag: "",
      },
      mergeQuery: {
        tagType: "",
        tag: "",
        targetTag: "",
      },
    };
  },
  created() {
    this.initTags()
  },
  methods: {
    openDialog(tagType,tag,tagName){
      this.selectedTag.tagType = tagType;
      this.selectedTag.tag = tag;
      this.selectedTag.tagName = tagName;
      console.log(this.selectedTag);
      this.dialogVisible = true;
    },
    resetSelectedTag(){
      this.selectedTag.tagType = "";
      this.selectedTag.tag = "";
      this.selectedTag.tagName = "";
    },
    handleClose(tags,tag,tagName) {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        this.deleteQuery.tagType = tagName;
        this.deleteQuery.tag = tag;
        this.mergeQuery.tagType = tagName;
        this.mergeQuery.tag = tag;
        this.mergeQuery.targetTag = this.inputValue;
        deleteDictionary(this.deleteQuery).then(response => {
          tags.splice(index, 1);
          this.dialogVisible = false;
          this.resetSelectedTag();
          this.inputValue = "";
        });
        mergeDictionary(this.mergeQuery).then(response => {
          this.dialogVisible = false;
          this.resetSelectedTag();
          this.inputValue = "";
        });
      }
    },
    handleDelete(tags,tag,tagName){
      const index = tags.indexOf(tag);
      if (index >= 0) {
        this.deleteQuery.tagType = tagName;
        this.deleteQuery.tag = tag;
        deleteDictionary(this.deleteQuery).then(response => {
          tags.splice(index, 1);
          this.dialogVisible = false;
          this.resetSelectedTag();
          this.inputValue = "";
        });
      }
    },
    showInput(tagType){
      this.visibleList[tagType] = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(tagType) {
      let inputValue = this.inputList[tagType];
      if (inputValue) {
        this.addQuery.tagType = tagType;
        this.addQuery.tag = inputValue;
        addDictionary(this.addQuery).then(response => {
          this.tagList[tagType].push(inputValue);
          this.inputList[tagType] = ""; // 清空输入框
        });
      }
      this.visibleList[tagType] = false; // 隐藏输入框
    },
    initTags(){
      getDictionary().then(response => {
        this.tagList.producerTags = response.data.producerTags
        this.tagList.labTags = response.data.labTags
        this.tagList.locationTags = response.data.locationTags
        this.tagList.sourceTags = response.data.sourceTags
        this.tagList.wasteTags = response.data.wasteTags
      })
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
  padding: 10px;
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