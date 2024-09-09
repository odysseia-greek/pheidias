<template>
  <div>
    <ConvertArea></ConvertArea>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ConvertArea from '@/components/ConvertArea.vue';

export default defineComponent({
  name: 'Diogenes',
  components: {
    ConvertArea,
  },
  setup() {
    // If you have any state or logic, it will go here
    return {};
  },
});
</script>







