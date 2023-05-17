import gql from "graphql-tag";

export const HerodotosTreeQuery = gql`
    query authors {
      authors {
        name 
        books {
            book
        } 
    }
}`

export const HerodotosCreateSentence = gql`
query sentence($author: String!, $book: String!) {
    sentence(author: $author, book: $book) {
        id
        greek
        author
        book
    }
}`

export const HerodotosCheckSentence = gql`
query text($author: String!, $sentenceId: String!, $answer: String!) {
    text(author: $author, sentenceId: $sentenceId, answer: $answer) {
        levenshtein
        input
        quiz
        splitQuiz {
            word
        }
        splitAnswer {
            word
        }
        matches {
            word
            index
        }
        mistakes {
            word
            index
            nonMatches {
                match
                levenshtein
                index
                percentage
            }
        }
    }
}`


export const SokratesTreeQuery = gql`
    query methods {
      methods {
        name 
        categories {
            name
            highestChapter
        } 
    }
}`

export const SokratesCreateQuestion = gql`
    query quiz($category: String!, $chapter: String!, $method: String!) {
      quiz(category: $category, chapter: $chapter, method: $method)  {
          question
          quiz
          answer
    }
}`

export const SokratesCheckAnswer = gql`
    query answer($quizWord: String!, $answerProvided: String!) {
        answer(quizWord: $quizWord, answerProvided: $answerProvided) {
            correct
            quizWord
            possibilities{
                greek
                category
                translation
            }
        }
}`

export const CheckGrammar = gql`
query grammar($word: String!) {
    grammar(word: $word) {
        translation
        word
        rule
        rootWord
    }
}`

export const DictionaryEntry = gql`
    query dictionary($word: String!) {
        dictionary(word: $word) {
            greek
            english
            dutch
            original
            linkedWord
        }
}`
