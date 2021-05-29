
let Answer ={

    props:['answer'],

    template:`<div>

        <input type="radio" 
        :id="'answer-'+answer.id" 
        @click="store(answer)" 
        name="answer">
        {{ answer.title }}
        </input>
    </div>   
    `,
    methods:{

            store(answer){
                this.$emit('get:answer',answer)
            }
    }


}

let Question ={

    components:{
        'answer':Answer,
    },
    props:['question'],
    data(){
        return {
            nextButton:false,
            answerChosed:null,
        }
    },

    template:`
        <div>
            <div class="alert alert-primary" role="alert">
                <strong>{{ question.title }}</strong>
            </div>
            <answer v-for= "answer in question.answers"
              :answer="answer" :key="answer.id"
              v-on:get:answer="showNext"> </answer>
            <br>
            <button v-if="nextButton&&question.id!=4" class="btn btn-primary" @click.pervent="sendAnswer"> Next </button>
            <button v-if="nextButton&&question.id==4" class="btn btn-primary" 
            @click.pervent="showResult"> show result </button>

            </div>
    `,  

    methods:{
        showNext(answer){
            this.nextButton=true
            this.answerChosed=answer
        },
        sendAnswer(){
            this.$emit('answer:send',this.answerChosed,this.question)
        },

        showResult(){
            this.$emit('answer:send',this.answerChosed,this.question)

            this.$emit('result:show')
        }
    }



}

let Result ={

    props:['results'],
    template:`
    
        <div>

            <h3> Result of Quiz</h3>
            <br>
            <div v-for="result in results" >
                <div  class="alert alert-primary" role="alert">
                    <strong> {{result.question.title }} </strong>
                </div>

                <div  v-if="result.answer.correct==true" class="alert alert-success" role="alert">
                    <strong> Your answer is correct </strong>
                </div>

                <div  v-else class="alert alert-danger" role="alert">
                    <strong> Your answer is incorrect </strong>

                    <template v-for="answer in result.question.answers ">
                     <span v-if="answer.correct==true" class="badge badge-info"> answer is  {{ answer.title }}</span>

                    </template>
                    
                </div>
            </div>

            </div>
            
           
        </div>
    `,


}
let Quiz = {

    // template: `  

    //     <div>
    //         <div v-for="question in questions">
    //         <div class="text-center">
    //             <span class="badge badge-primary" style="font-size:20px">
    //              question  {{ question.id }} of {{  questions.length}}
    //             </span>

    //         </div>

    //             <div class="alert alert-info" role="alert">
    //                 {{ question.title }}
    //             </div>

    //             <div v-for="answer in question.answers">

    //                 <div v-if="answer.correct==true" class="alert alert-success" role="alert">
    //                     {{ answer.title }}
    //                 </div>

    //                 <div v-else class="alert alert-danger" role="alert">
    //                     {{ answer.title }}

    //                 </div>
    //             </div>
                
    //         </div>
    //     </div>    
    // `,
  
    components:{
        'question':Question,
        'result':Result,
    },

    template:`
    
        <div>            <h3> Question {{ questionIndex+1  }} of {{ questions.length }}</h3>

            <question 
            v-if="currentQuestion&&showQuizResult==false>questionIndex" 
            :question="currentQuestion" 
            :key="currentQuestion.id"
            v-on:answer:send="showNext"
            v-on:result:show="showResult"

            >  </question>
        <result v-else  :results="result"> </result>

        </div>
    `,

    data() {
        return {
            questions: [],
            result:[],
            currentQuestion:null,
            questionIndex:0,
            showQuizResult:false
            
        }   
    },

    mounted() {
        axios.get('questions.json').then((response) => {
            this.questions = response.data
            this.currentQuestion=this.questions[this.questionIndex]
        })
    },

    methods:{

        showNext(answer,question){
            this.questionIndex++;
            this.currentQuestion=this.questions[this.questionIndex]
            this.result.push({
                question:question,
                answer:answer
            })

        },

        showResult(answer,question){
            this.showQuizResult=true
        }
    }


}


let app = new Vue({

    el: '#app',
    components: {
        'quiz': Quiz,
    }

})