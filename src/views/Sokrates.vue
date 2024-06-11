<template>
    <div>
        <quiz-area></quiz-area>
    </div>
</template>

<script>
    import QuizArea from "../components/QuizArea.vue";

    export default {
        name: 'Sokrates',
        data () {
          return {
          }
      },
        components: {
          QuizArea,
            'quiz-area': QuizArea
        },
        methods: {
        },
        computed: {
        },
      }
</script>