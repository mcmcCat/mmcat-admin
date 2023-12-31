<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    require: false,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
// toRef()出来的inputValue 相当于 props.modelValue的引用,修改其一会影响另一
const inputValue = toRef(props, "modelValue");

const visible = ref(false); // 弹窗显示状态

const allIconNames: string[] = []; // 所有的图标名称集合

const filterValue = ref(""); // 筛选的值
const filterIconNames = ref<string[]>([]); // 过滤后的图标名称集合

const iconSelectorRef = ref();
const iconSelectorDialogRef = ref();
/**
 * icon 加载
 */
function loadIcons() {
  const icons = import.meta.glob("../../assets/icons/*.svg");
  console.log(icons);

  for (const icon in icons) {
    const iconName = icon.split("assets/icons/")[1].split(".svg")[0];
    allIconNames.push(iconName);
  }
  filterIconNames.value = allIconNames;
}

/**
 * icon 筛选
 */
function handleFilter() {
  if (filterValue.value) {
    filterIconNames.value = allIconNames.filter((iconName) =>
      iconName.includes(filterValue.value)
    );
  } else {
    filterIconNames.value = allIconNames;
  }
}

/**
 * icon 选择
 */
function handleSelect(iconName: string) {
  emit("update:modelValue", iconName);
  visible.value = false;
}

/**
 * 点击容器外的区域关闭弹窗 VueUse onClickOutside
 */
onClickOutside(iconSelectorRef, () => (visible.value = false), {
  // ignore表示点击 iconSelectorDialogRef 区域不会触发该事件
  ignore: [iconSelectorDialogRef],
});

onMounted(() => {
  loadIcons();
});
</script>

<template>
  <div ref="iconSelectorRef" class="iconselect-container">
    <el-input
      v-model="inputValue"
      readonly
      placeholder="点击选择图标"
      @click="visible = !visible"
    >
      <template #prepend>
        <svg-icon :icon-name="inputValue" />
      </template>
    </el-input>

    <el-popover
      shadow="none"
      :visible="visible"
      placement="bottom-end"
      trigger="click"
      width="400"
    >
      <!-- 触发弹窗的小三角 -->
      <template #reference>
        <div class="pop-button" @click="visible = !visible">
          <i-ep-caret-top v-show="visible" />
          <i-ep-caret-bottom v-show="!visible" />
        </div>
      </template>

      <!-- 下拉选择弹窗 -->
      <div ref="iconSelectorDialogRef">
        <el-input
          v-model="filterValue"
          style="padding: 2px"
          placeholder="搜索图标"
          clearable
          @input="handleFilter"
        />
        <el-divider border-style="dashed" />

        <el-scrollbar height="300px">
          <ul class="icon-list">
            <li
              v-for="(iconName, index) in filterIconNames"
              :key="index"
              class="icon-item"
              @click="handleSelect(iconName)"
            >
              <el-tooltip :content="iconName" placement="bottom" effect="light">
                <svg-icon
                  color="var(--el-text-color-regular)"
                  :icon-name="iconName"
                />
              </el-tooltip>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.el-divider--horizontal {
  margin: 10px auto !important;
}

.iconselect-container {
  position: relative;
  width: 400px;
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  margin-top: 10px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    width: 10%;
    padding: 5px;
    margin: 0 10px 10px 0;
    cursor: pointer;
    border: 1px solid #ccc;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      transition: all 0.2s;
      transform: scaleX(1.1);
    }
  }
}

.pop-button {
  position: absolute;
  top: 0;
  right: 10px;
  height: 32px;
  line-height: 32px;
  color: #999;
  cursor: pointer;
}
</style>
