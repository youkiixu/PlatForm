<template>
    <div>
        <span style="margin: 0 10px;">
            <Button type="info" @click='click(1)'>新增</Button>
        </span>
        <span style="margin: 0 10px;">
            <Button type="success" @click='click(2)'>修改</Button>
        </span>
        <span style="margin: 0 10px;">
            <Button type="warning " @click='click(3)'>删除</Button>
        </span>
    </div>
</template>

<script>
export default {
  methods: {
    click(type) {
      switch (type) {
        case 1:
          this.$emit("add");
          break;
        case 2:
          this.$emit("modify");
          break;
        default:
          this.$emit("del");
          break;
      }
    }
  }
};
</script>
