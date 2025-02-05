<template>
  <div class="usersComponent">
    <div class="container">
      <div class="q-pa-md bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Estaciones</q-toolbar-title>
          <q-btn color="secondary" @click="addRow">Agregar</q-btn>
        </q-toolbar>

      </div>
      <q-table :rows="usersData" :columns="columns" row-key="id" class="q-mt-md">
        <template v-slot:body-cell-estado="props">
          <td>{{ props.row.estado==1?"Activa":props.row.estado==2?"Inactiva":"En mantenimiento"}}</td>
        </template>
        <template v-slot:body-cell-actions="props">
          <td class="text-right">
            <q-btn flat icon="lock_open" @click="editRow(props.row)" />
            <q-btn flat icon="edit" @click="editRow(props.row)" />
            <q-btn flat icon="delete" color="negative" @click="confirmDeleteDialog(props.row)" />
          </td>
        </template>
      </q-table>
      <!-- <div class="q-pa-md bg-grey-2">
        <q-btn color="primary" @click="performAction">Footer Action</q-btn>
      </div> -->
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg" style="max-width: 90vw; max-height: 80vh;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Estacion' : 'Agregar Estacion' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRow">
            <q-input v-model="form.numero_serie" label="devEui" :rules="[val => !!val || 'Este campo es obligatorio']" />
            <q-input v-model="form.modelo" label="Modelo" :rules="[val => !!val || 'Este campo es obligatorio']" />
            <q-input v-model="form.descripcion" label="Descripción" />
            <q-input v-model="form.latitud" label="Latitud" :rules="[val => !!val || 'Este campo es obligatorio']" />
            <q-input v-model="form.longitud" label="Longitud" :rules="[val => !!val || 'Este campo es obligatorio']" />
            <q-input v-model="form.variables" label="Variables" />
            <!-- <q-input
              v-model="form.estado"
              label="Estado"
              type="number"
              :rules="[val => !!val || 'Este campo es obligatorio']"
            /> -->
            <q-select
              v-model="form.estadoObj"
              label="Estado"
              :options="estadoOptions"
              :rules="[val => !!val || 'Este campo es obligatorio']"
              @update:model-value="($event)=>{form.estadoObj = $event
                console.log('$event')
                console.log($event)

                form.estado = $event.value
              }"
            />
            <q-input v-model="form.informacion_adicional" label="Información Adicional" />


            <q-card-actions align="right">
              <q-btn flat label="Cancelar" @click="showDialog = false" />
              <q-btn color="primary" label="Guardar" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Desea eliminar la estacion?.{{ deleteRowVar.numero_serie }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="danger" @click="deleteRow"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TUser } from './models';
import { api } from 'src/boot/axios';
import { parse } from 'path';


export interface TEstacionInput {
  id:number;
  numero_serie:string;
  modelo:string;
  descripcion:string;
  latitud:string;
  longitud:string;
  variables:string;
  estado:number;
  estadoObj:string;
  informacion_adicional:string;
  created_at:Date;
  updated_at:Date;
}

const usersData = ref<TUser[]>([]);

const estadoOptions = ref([
  { label: 'Activa', value: 1 },
  { label: 'Inactiva', value: 2 },
  { label: 'En mantenimiento', value: 3 },
]);


const columns = ref([
  { name: 'numero_serie', label: 'DevEui', field: 'numero_serie' },
  { name: 'modelo', label: 'Modelo', field: 'modelo' },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion' },
  { name: 'latitud', label: 'Latitud', field: 'latitud' },
  { name: 'longitud', label: 'Longitud', field: 'longitud' },
  { name: 'estado', label: 'Estado', field: 'estado' },
  { name: 'informacion_adicional', label: 'Información Adicional', field: 'informacion_adicional' },

  // { name: 'createdAt', label: 'Fecha de Creación', field: 'createdAt' },
  { name: 'created_at', label: 'Creado', field: 'created_at' },
  { name: 'actions', label: 'Acciones', field: 'actions' }


//   activo
// correo
// created
// emailConfirmation
// id
// nombre
// clave
// rol
// updated
]);

const showDialog = ref(false);
const isEditing = ref(false);
const form = ref<TEstacionInput>({
  // id:0,
  // clave:'',
  // emailConfirmation: '',
  // created_at:new Date(),
  // nombre:'',
  // rol_estacion:1,
  // updated_at:new Date()
  id:0,
  numero_serie:'',
  modelo:'',
  descripcion:'',
  latitud:'',
  longitud:'',
  variables:'',
  estado:0,
  estadoObj:'',
  informacion_adicional:'',
  created_at:new Date(),
  updated_at:new Date()
});

const addRow = () => {
  isEditing.value = false;
  form.value = {
    id:0,
    numero_serie:'',
    modelo:'',
    descripcion:'',
    latitud:'',
    estadoObj:'',
    longitud:'',
    variables:'',
    estado:0,
    informacion_adicional:'',
    created_at:new Date(),
    updated_at:new Date()
   };
   //form.value = { _id: '', name: '', lastname: '', email: '', emailConfirmation: '', userType: 1, passwordReset: true, createdAt: new Date(), password: 'Default123' };
  showDialog.value = true;
};

const editRow = (row: TUser) => {
  isEditing.value = true;
  //form.value = { ...row, created_at: new Date(),id:row.id,emailConfirmation:row.correo,clave:''};
  showDialog.value = true;
};
const confirmDelete = ref(false) ;
const deleteRowVar = ref({} as TEstacionInput);
const confirmDeleteDialog = (form: TEstacionInput)=>
{
  deleteRowVar.value = form;
  confirmDelete.value = true;
}

const deleteRow = () => {



  api.delete(`/estacion/${deleteRowVar.value.id}`).then(() => {
    confirmDelete.value = false;
    loadEstaciones();
    deleteRowVar.value = {} as TEstacionInput;
  }).catch((error) => {
    console.error('Error deleting user:', error);
  });
};

const saveRow = () => {
  if (isEditing.value) {
    // Update existing user
    form.value.estado = parseInt(form.value.estado.toString());
    api.patch('/estacion/'+form.value.id, form.value).then(() => {
      loadEstaciones();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error updating user:', error);
    });
  } else {
    // Add new user
    form.value.estado = parseInt(form.value.estado.toString());
    api.post('/estacion', (({ ...rest }) => rest)(form.value)).then((response) => {
      loadEstaciones();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error adding user:', error);
    });
  }
};

const loadEstaciones = () => {
  console.log('Loading estaciones...');
  api.get('/estacion').then((response) => {
    console.log('Users loaded:', response.data);

    usersData.value = response.data as TUser[];
    console.log("usersData.value")
    console.log(usersData.value)
  }).catch(() => {
    console.log('Error loading users');
  });
};

onMounted(() => {
  loadEstaciones();
});


</script>


<script lang='ts'>
export default {
  name: 'StationsComponent',
  inheritAttrs: false,
  customOptions: {}
}
</script>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-table {
  flex: 1;
}

.q-toolbar-title {
  flex: 1;
}
</style>
