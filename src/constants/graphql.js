import gql from "graphql-tag";

export const HerodotosOptions = gql`
    query textOptions {
        textOptions {
            authors {
                key
                books {
                    key
                    references {
                        key
                        sections {
                            key
                        }
                    }
                }
            }
        }
    }
`

export const Analyze = gql`
    query analyze($rootword: String!) {
        analyze(rootword: $rootword) {
            rootword
            conjugations{
                word
                rule
            }
            results {
                text {
                    greek
                    translations
                    section
                }
                referenceLink
                author
                book
                reference
            }
        }
    }
`

export const HerodotosCreate = gql`
    query create($input: CreateTextInput!) {
        create(input: $input) {
            author
            book
            reference
            rhemai {
                greek
                section
                translations
            }
        }
    }
`

export const HerodotosCheck = gql`
    query check($input: CheckTextRequestInput!) {
        check(input: $input) {
            averageLevenshteinPercentage
            sections {
                section
                answerSentence
                quizSentence
                levenshteinPercentage
            }
            possibleTypos {
                source
                provided
            }
        }
    }
`

export const SokratesOptions = gql`
    query options($quizType: String!) {
      options(quizType: $quizType)  {
        themes{
            name
            segments{
                name
                maxSet
            }
        }
    }
}`
export const SokratesCreateQuestion = gql`
    query quiz($set: String!, $segment: String!, $quizType: String!, $theme: String!, $excludeWords: [String!]!) {
      quiz(set: $set, segment: $segment, quizType: $quizType, theme: $theme, excludeWords: $excludeWords)  {
        ... on QuizResponse {
            numberOfItems
            quizItem
            options{
                option
                imageUrl
            }
        }
          ... on AuthorBasedQuizType {
              reference
              translation
              fullSentence
              quiz{
                  numberOfItems
                  quizItem
                  options{
                      option
                  }
              }
              grammarQuiz{
                  correctAnswer
                  extraInformation
                  wordInText
                  options{
                      option
                  }
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
    query answer($set: String!, $segment: String!, $quizType: String!, $theme: String!, $quizWord: String!, $answer: String!, $comprehensive: Boolean!) {
      answer(set: $set, segment: $segment, quizType: $quizType, theme: $theme, quizWord: $quizWord, answer: $answer, comprehensive: $comprehensive)  {
        ... on ComprehensiveResponse {
            correct
            quizWord
            similarWords {
                greek
                english
            }
            foundInText{
                rootword
                conjugations{
                    word
                    rule
                }
                results{
                    reference
                    referenceLink
                    author
                    book
                    text{
                        translations
                        greek
                    }
                }
            }
            progress {
                averageAccuracy
                timesCorrect
                timesIncorrect
            }
        }
        ... on AuthorBasedAnswer {
            quizWord
            correct
            wordsInText
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
                    rootword
                    conjugations{
                        word
                        rule
                    }
                    results{
                        reference
                        referenceLink
                        author
                        book
                        text{
                            translations
                            greek
                        }
                    }
                }
        }
        }
}`
