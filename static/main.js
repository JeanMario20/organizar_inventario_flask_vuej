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
            dataSearch: null,
            sqlData: [],
            newData: [],
            typeData: true,
            foundItems: true,
            stillSearchItem: false,
        }
    },
    async created() {
        await this.getResponse()
    },
    methods: {
        async getResponse() {
            //muestra todos los datos de la base de datos en la tabla
            if(this.dataSearch == null){
                const res = await fetch('/api/data');
                const finalRes = await res.json();
                this.sqlData = finalRes;

                //typeData = true hace que vuelvan a mostrar todos datos de la tabla cuando se quiso editar pero se cancelo
                this.typeData = true;
                this.resetInputs();
            }
            //mostrar nada mas el resultado de la barra de busqueda
            if(this.dataSearch != null){
                this.showAllData();
                this.searchBar(this.dataSearch)
            }
        },

        resetInputs(){
            this.dataNewName = "";
            this.dataNewPrecio = "";
            this.dataNewNumExist = "";
        },

        showAllData(){
            this.typeData = true;
        },

        hideAllData(){
            this.typeData = false;
        },


        async getIndex(getIndex){
            this.hideAllData();
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

        async editData(oldName){

            const body = JSON.stringify({
                "oldName": oldName,
                "newName": this.dataNewName,
                "newPrecio": this.dataNewPrecio,
                "newNumExist": this.dataNewNumExist
            })

            this.dataName = null;
            this.dataNewName = null;
            this.dataPrecio = null;
            this.dataNewPrecio = null;
            this.dataNewNumExist = null;

            await this.sendDataBackend('/api/edit_data',body)
            this.showAllData();
            this.getResponse();
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

        async searchBar(){
            const body = JSON.stringify({
                "nombre": this.dataSearch
            });


            const res = await this.sendDataBackend('/api/searchItem', body);
            const finalRes = await res.json()
            if(finalRes == null){
                this.sqlData = [{
                    "id":1,
                    "nombre": "no hay resultados",
                    "num_existente": "",
                    "precio": "",
                    "ubicacion": "Principal"
                }]
                this.foundItems = false
            }
            else{
                this.sqlData = [finalRes];
            }
            

        },

        async resetSearchBarAndTable(){
            this.foundItems = true;
            this.typeData = true;
            this.dataSearch = null
            this.getResponse();
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
        },


    },
    delimiters: ['{', '}']
}



createApp(TaskApp).mount('#app')
