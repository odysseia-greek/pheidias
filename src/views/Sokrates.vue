<template>
  <div>
    <QuizArea></QuizArea>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import QuizArea from '@/components/QuizArea.vue';

export default defineComponent({
  name: 'Sokrates',
  components: {
    QuizArea,
  },
  setup() {
    // If you have any state or logic, it will go here
    return {};
  },
});
</script>





