<template>
  <div>
    <text-area></text-area>
  </div>
</template>

<script>
import TextArea from "@/components/TextArea.vue";

export default {
  name: 'Herodotos',
  data () {
    return {
    }
  },
  components: {
    TextArea,
    'text-area': TextArea
  },
  methods: {},
  computed: {
  },
}
</script>