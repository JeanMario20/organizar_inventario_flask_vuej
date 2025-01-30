const { createApp } = Vue
const TaskApp = {
    data(){
        return {
            sqlData: []
        }
    },
    async created() {
        await this.getResponse()
    },
    methods: {
        

        async getResponse(){
            console.log('feroufhreyui');
            //const res = await fetch(window.location);
            const res = await fetch('/api/data');
            const finalRes = await res.json();
            this.sqlData = finalRes
            console.log(this.sqlData);
            
        },

        buttonCreate(){
            console.log('dewferawfd')
        }

    },
    delimiters: ['{', '}']
}

createApp(TaskApp).mount('#app')