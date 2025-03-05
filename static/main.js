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
            oldIndexDrag: null,
            newIndexDrag: null,
            typeLocation: null,
            sqlData: [],
            newData: [],
            bodegaData: [],
            typeData: true,
            foundItems: true,
            stillSearchItem: false,
        }
    },
    async created() {
        await this.getResponse()
        await this.getBodegaData()
    },
    methods: {
        async getResponse() {
            //muestra todos los datos de la base de datos en la tabla
            if(this.dataSearch == null){
                const res = await fetch('/api/data');
                const finalRes = await res.json();
                if(finalRes.length == 0){
                    finalRes.push(
                        {
                            'id':1,
                            'nombre':'el inventario esta vacio',
                            'num_existente': 'N/A',
                            'precio':'N/A',
                            'ubicacion':'Bodega',
                            'Borrar':'borrar'
                        }
                    );
                }
                this.sqlData = finalRes;

                this.showAllData();
                this.resetInputs();
            }
            //mostrar nada mas el resultado de la barra de busqueda
            if(this.dataSearch != null){
                this.showAllData();
                this.searchBar(this.dataSearch)
            }
        },

        async getBodegaData(){
            const res = await fetch('/api/dataBodega');
            const finalRes = await res.json();
            if(finalRes.length == 0){
                finalRes.push(
                    {
                        'id':1,
                        'nombre':'la bodega esta vacia',
                        'num_existente': 'N/A',
                        'precio':'N/A',
                        'ubicacion':'Bodega',
                        'Borrar':'borrar'
                    }
                );
            }
            this.bodegaData = finalRes;
            
        },

        resetInputs(){
            this.dataNewName = "";
            this.dataNewPrecio = "";
            this.dataNewNumExist = "";
        },

        showAllData(){
            //activar las etiquetas de mostrar la tabla y los btn de aumentar,disminuir,borrar
            this.typeData = true;
        },

        hideAllData(){
            this.typeData = false;
        },


        async getIndex(getIndex){
            if(getIndex == 'el inventario esta vacio'){
                return true
            }
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

        async addNewDataBodega(){
            const body = JSON.stringify({
                'nombre': this.dataName,
                'precio': this.dataPrecio,
                'numExist': this.dataNumExis,
                'ubicacion':'Bodega'
            })

            this.clearModels();

            await this.sendDataBackend('/api/add_new_data', body)
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
            if(data == 'el inventario esta vacio'){
                return true
            }
            const body = JSON.stringify({
                "nombre": data,
                'action': "increased"
            })
            await this.sendDataBackend('/api/increase_or_decreased_data',body);
            await this.getResponse();
        },

        async decreasedData(data){
            if(data == 'el inventario esta vacio'){
                return true
            }
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

        async handleDragStart(oldIndex, type){
            if(oldIndex == "la bodega esta vacia"){
                return true;
            }
            this.oldIndexDrag = oldIndex;
            this.typeLocation = type;
        },

        async handleDragOver(newIndex){
            if(newIndex !== this.oldIndexDrag){
                this.newIndexDrag = newIndex;
            }
        },

        async handleDrop(){
            //se mandan a mover de ubicacion los items
            const body = JSON.stringify({
                "nombre":this.oldIndexDrag,
                "ubicacion":this.typeLocation
            });

            this.oldIndexDrag = null;
            this.newIndexDrag = null;

            const res = await this.sendDataBackend('/api/moveLocationItems',body);
            await this.getResponse();
            await this.getBodegaData()

        },


        handleDragEnd(){
            this.oldIndexDrag = null;
            this.newIndexDrag = null;
        },

        clearModels(){
            this.dataName = null;
            this.dataNumExis = null;
            this.dataPrecio = null;
        },


    },
    delimiters: ['{', '}']
}



createApp(TaskApp).mount('#app')
