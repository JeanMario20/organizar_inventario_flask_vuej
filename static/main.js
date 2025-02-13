const { createApp } = Vue

const TaskApp = {
    data() {
        return {
            dataName: null,
            dataNumExis: null,
            dataPrecio: null,
            dataOldName: null,
            dataNewName: null,
            dataNewPrecio: null,
            dataNewNumExist: null,
            sqlData: [],
            newData: [],
            typeData: true,
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

            //typeData = true hace que vuelvan a mostrar todos datos de la tabla cuando se quiso editar pero se cancelo
            this.typeData = true;
            this.resetInputs();
        },

        resetInputs(){
            this.dataNewName = "";
            this.dataNewPrecio = "";
            this.dataNewNumExist = "";
        },

        async getIndex(getIndex){
            this.typeData = false;
            const body = JSON.stringify({
                "nombre": getIndex
            });
            const res = await this.sendDataBackend('/api/get_index_table_principal',body);
            const finalRes = await res.json()
            this.sqlData = [finalRes]
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
            await this.getResponse();
        },

        async editData(){
            var data = {
                dataOldName: this.dataOldName,
                dataNewName: this.dataNewName,
                numExist: this.dataNumExis,
                precio: this.precio
            }

            this.dataName = null;
            this.dataNumExis = null;
            this.dataPrecio = null;
            this.dataOldName = null;
            this.dataNewName = null;

            const body = JSON.stringify({
                "nombre":data.name,
                'numExist': data.numExist,
                'precio': data.precio
            })

            //await this.sendDataBackend('/api/edit_data',body)
        },

        async deleteData(data){
            const body = JSON.stringify({
                'nombre': data
            })
            await this.sendDataBackend('/api/delete_Data',body);
            await this.getResponse();
        },

        async increaseData(data){
            const body = JSON.stringify({
                "nombre": data,
                'action': "increased"
            })
            await this.sendDataBackend('/api/increase_or_decreased_data',body);
            await this.getResponse();
        },

        async decreasedData(data){
            const body = JSON.stringify({
                "nombre": data,
                "action": "decreased"
            })
            await this.sendDataBackend('/api/increase_or_decreased_data', body);
            await this.getResponse();
        },

        async sendDataBackend(url,body){
            const response = await fetch(url,{
                method: 'POST',
                body: body,
                headers: {
                    'Content-type': 'application/json',
                }
            });
            //await this.getResponse();
            return response
        }


    },
    delimiters: ['{', '}']
}

/*tengo que enviar de un formulario un post a mi vue 
de mi vue mandar los nuevos datos al flask 
del flask mandar a actualizar un nuevo dato a la base de datos con los datos del fomulario*/ 


createApp(TaskApp).mount('#app')
