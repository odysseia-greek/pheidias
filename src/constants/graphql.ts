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

export const SokratesOptions = gql`
    query options($quizType: String!) {
      options(quizType: $quizType)  {
        aggregates{
            name
            highestSet
        }
    }
}`
export const SokratesCreateQuestion = gql`
    query quiz($set: String!, $quizType: String!, $theme: String!) {
      quiz(set: $set, quizType: $quizType, theme: $theme)  {
        ... on QuizResponse {
            quizItem
            options{
                option
                imageUrl
            }
        }
        ... on DialogueQuiz {
            quizType
            dialogue{
                introduction
                speakers {
                    shorthand
                    translation
                }
            }
            content{
                translation
                greek
                place
                speaker
            }
        }
    }
}`

export const SokratesCheckBase = gql`
    query answer($set: String!, $quizType: String!, $theme: String!, $quizWord: String!, $answer: String!, $comprehensive: Boolean!) {
      answer(set: $set, quizType: $quizType, theme: $theme, quizWord: $quizWord, answer: $answer, comprehensive: $comprehensive)  {
        ... on ComprehensiveResponse {
            correct
            quizWord
            similarWords {
                greek
                english
            }
            foundInText {
                rhemai {
                    author
                    greek
                    translations
                }
            }
            progress {
                averageAccuracy
                timesCorrect
                timesIncorrect
            }
        }
    }
}`

export const SokratesCheckDialogue = gql`
  query answer($set: String!, $quizType: String!, $theme: String!, $dialogue: [DialogueInput!]!) {
    answer(set: $set, quizType: $quizType, theme: $theme, dialogue: $dialogue) {
      ... on DialogueAnswer {
        percentage
        input {
            place
        }
        answer {
            place
        }
        wronglyPlaced {
          greek
          translation
          speaker
          place
        }
      }
    }
  }
`;

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
    query dictionary($word: String!, $language: String!, $mode: String!, $searchInText: Boolean!) {
        dictionary(word: $word, language: $language, mode: $mode, searchInText: $searchInText) {
            hits {
                hit{
                    greek
                    english
                    dutch
                    original
                    linkedWord
                }
                foundInText{
                    rhemai{
                        author
                        greek
                        translations
                    }
                }
        }
        }
}`
