const { createApp } = Vue
const TaskApp = {
    data(){
        return {
            task: {
                'title':''
            },
            tasks: []
        }
    },
    async created() {
        await this.getResponse()
    },
    methods: {
        async sendRequest(url,method,data){
            const myHeaders = new Headers({
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            })

            const response = await fetch(url,{
                method: method,
                headers:myHeaders,
                body:data
            })
            return response
        },

        async getResponse(){
            const response = await this.sendRequest(window.location,'get')
            this.tasks = await response.json()
        },
        
        

        

    },
    delimiters: ['{', '}']
}

createApp(TaskApp).mount('#app')