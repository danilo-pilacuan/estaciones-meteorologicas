<template>
  <div class="usersComponent">
    <div class="container">
      <div class="q-pa-md bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Usuarios</q-toolbar-title>
          <q-btn color="secondary" @click="addRow">Agregar</q-btn>
        </q-toolbar>

      </div>
      <q-table :rows="usuariosData" :columns="columns" row-key="id" class="q-mt-md"  :rows-per-page-options="[20, 30, 40]"
      rows-per-page-label="Registros por página">
    <template v-slot:body-cell-rol="props">
      <td>{{ props.row.rol?props.row.rol.descripcion:""}}</td>
    </template>
    <template v-slot:body-cell-activo="props">
      <td>{{ props.row.activo?"Activo":"Inactivo"}}</td>
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
      <q-card class="q-pa-lg" style="max-width: 80vw; max-height: 80vh;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Usuario' : 'Agregar Usuario' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRow">
            <q-input v-model="form.nombre" label="Nombre" required class="q-ma-sm" />
            <q-input v-model="form.correo" label="Correo" type="email" required class="q-ma-sm" />
            <q-input v-model="form.emailConfirmation" label="Confirmar correo" type="email" required class="q-ma-sm" />
            <!-- <q-input v-model="form.rol_usuario" label="Rol" required class="q-ma-sm" /> -->
            <q-select
              v-model="form.rol_usuario"
              :options="rolesData.map(role => ({ label: role.descripcion, value: role.id }))"
              label="Rol"
              required
              class="q-ma-sm"
              @update:model-value="($event)=>{form.rol_usuario = $event
                console.log('$event')
                console.log($event)
                form.rolId = $event.value
              }"
            />

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
          <span class="q-ml-sm">Desea eliminar el usuario?. ({{deleteRowVar.correo}})</span>
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
import { TRol, TUser } from './models';
import { api } from 'src/boot/axios';

export interface TUserInput {
  activo:boolean;
  correo:string;
  created_at:Date;
  emailConfirmation?: string;
  id?:number;
  nombre:string;
  clave:string;
  rol_usuario:string;
  rolId:number;
  updated_at:Date;
}

const usuariosData = ref<TUser[]>([]);
const rolesData = ref<TRol[]>([]);

const columns = ref([
  { name: 'nombre', label: 'Nombre', field: 'nombre' },
  { name: 'correo', label: 'Correo', field: 'correo' },
  { name: 'rol', label: 'Rol Descripción', field: 'rol' },
  { name: 'created_at', label: 'Creado', field: 'created_at' },
  { name: 'activo', label: 'Estado', field: 'activo' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]);

const showDialog = ref(false);
const isEditing = ref(false);
const form = ref<TUserInput>({
  activo:true,
  correo:'',
  clave:'D@N1l01995P1',
  emailConfirmation: '',
  created_at:new Date(),
  nombre:'',
  rol_usuario:"",
  rolId:1,
  updated_at:new Date()
});

const addRow = () => {
  isEditing.value = false;
  form.value = {
    activo:true,
    correo:'',
    clave:'D@N1l01995P1',
    emailConfirmation: '',
    created_at:new Date(),
    nombre:'',
    rol_usuario:"",
    rolId:1,
    updated_at:new Date()
   };
   //form.value = { _id: '', name: '', lastname: '', email: '', emailConfirmation: '', userType: 1, passwordReset: true, createdAt: new Date(), password: 'Default123' };
  showDialog.value = true;
};

const editRow = (row: TUser) => {
  isEditing.value = true;
  //form.value = { ...row, _id: row._id, emailConfirmation: row.email, createdAt: new Date() };
  form.value = { ...row, created_at: new Date(),id:row.id,emailConfirmation:row.correo,clave:'D@N1l01995P1',rol_usuario:row.rol.descripcion,rolId:1};
  showDialog.value = true;
};
const confirmDelete = ref(false) ;
const deleteRowVar = ref({} as TUserInput);
const confirmDeleteDialog = (form: TUserInput)=>
{
  deleteRowVar.value = form;
  confirmDelete.value = true;
}

const deleteRow = () => {



  api.delete(`/usuario/${deleteRowVar.value.id}`).then(() => {
    confirmDelete.value = false;
    loadUsuarios();
    deleteRowVar.value = {} as TUserInput;
  }).catch((error) => {
    console.error('Error deleting user:', error);
  });
};

const saveRow = () => {
  if (isEditing.value) {
    // Update existing user
    api.patch('/usuario/'+form.value.id, form.value).then(() => {
      loadUsuarios();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error updating user:', error);
    });
  } else {
    // Add new user

    console.log("form.value")
    console.log(form.value)

    api.post('/usuario', (({ ...rest }) => rest)(form.value)).then((response) => {
      loadUsuarios();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error adding user:', error);
    });
  }
};

const loadUsuarios = () => {
  api.get('/usuario').then((response) => {
    console.log('Users loaded:', response.data);

    usuariosData.value = response.data as TUser[];
    console.log("usuariosData.value")
    console.log(usuariosData.value)
  }).catch(() => {
    console.log('Error loading users');
  });
};

const loadRoles = () => {
  api.get('/rol').then((response) => {
    console.log('loadRoles loaded:', response.data);
    rolesData.value = response.data as TRol[];
    console.log("rolesData.value")
    console.log(rolesData.value)
  }).catch(() => {
    console.log('Error loading roles');
  });
};

onMounted(() => {
  loadUsuarios();
  loadRoles();
});


</script>


<script lang='ts'>
export default {
  name: 'UsersComponent',
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
