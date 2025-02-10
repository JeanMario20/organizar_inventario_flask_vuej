const { createApp } = Vue

const TaskApp = {
    data() {
        return {
            dataName: null,
            dataNumExis: null,
            dataPrecio: null,
            sqlData: [],
            newData: []
        }
    },
    async created() {
        await this.getResponse()
        console.log(this.sqlData)
    },
    methods: {
        async getResponse() {
            const res = await fetch('/api/data');
            const finalRes = await res.json();
            this.sqlData = finalRes;
        },

        async addNewData(){
            var data = {
                name: this.dataName,
                numExist: this.dataNumExis,
                precio: this.dataPrecio,
            }

            this.dataName = null;
            this.dataNumExis = null;
            this.dataPrecio = null;

            const body = JSON.stringify({
                    'nombre': data.name,
                    'numExist': data.numExist,
                    'precio': data.precio,
                    'ubicacion': 'Principal'
            })
            await this.sendDataBackend('/api/add_new_data',body);
        },

        async deleteData(data){
            const body = JSON.stringify({
                'nombre': data
            })
            await this.sendDataBackend('/api/delete_Data',body);
        },

        async increaseData(data){
            const body = JSON.stringify({
                "nombre": data,
                'action': "increased"
            })
            await this.sendDataBackend('/api/increase_or_decreased_data',body);
        },

        async decreasedData(data){
            const body = JSON.stringify({
                "nombre": data,
                "action": "decreased"
            })
            await this.sendDataBackend('/api/increase_or_decreased_data', body);
        },

        async sendDataBackend(url,body){
            const response = await fetch(url,{
                method: 'POST',
                body: body,
                headers: {
                    'Content-type': 'application/json',
                }
            });
            await this.getResponse();
        }


    },
    delimiters: ['{', '}']
}

/*tengo que enviar de un formulario un post a mi vue 
de mi vue mandar los nuevos datos al flask 
del flask mandar a actualizar un nuevo dato a la base de datos con los datos del fomulario*/ 


createApp(TaskApp).mount('#app')
