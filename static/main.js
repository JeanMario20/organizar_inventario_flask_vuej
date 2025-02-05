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
    },
    methods: {
        async getResponse() {
            const res = await fetch('/api/data');
            const finalRes = await res.json();
            this.sqlData = finalRes;
            console.log(this.sqlData)
        },
        async addNewData() {
            var data = {
                name: this.dataName,
                numExist: this.dataNumExis,
                precio: this.dataPrecio,
            }
            console.log(data)
            console.log(JSON.stringify(data))

            this.dataName = null;
            this.dataNumExis = null;
            this.dataPrecio = null;

            const response = await fetch("/api/add_new_data",{
                method: 'POST',
                body: JSON.stringify({
                    'nombre': data.name,
                    'numExist': data.numExist,
                    'precio': data.precio,
                    'ubicacion': 'Principal'
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            await this.getResponse();
        }

    },
    delimiters: ['{', '}']
}

/*tengo que enviar de un formulario un post a mi vue 
de mi vue mandar los nuevos datos al flask 
del flask mandar a actualizar un nuevo dato a la base de datos con los datos del fomulario*/ 


createApp(TaskApp).mount('#app')
