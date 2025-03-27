// export interface Todo {
//   id: number;
//   content: string;
// }

// export interface Meta {
//   totalCount: number;
// }


export interface TEstacion {
  id:number;
  numero_serie:string;
  modelo:string;
  descripcion:string;
  latitud:string;
  longitud:string;
  variables:string;
  estado:number;
  informacion_adicional:string;
  created_at:Date;
  updated_at:Date;
}

export interface TRol {
  id:number;
  descripcion:string;
  created_at:Date;
  updated_at:Date;
}

export interface TUser {
  activo:boolean,
  correo:string,
  created_at:Date,
  id:number,
  nombre:string,
  rol:TRol,
  updated_at:Date
}


// export class User implements TUser {
//   activo: boolean;
//   correo: string;
//   created_at: Date;
//   id: string;
//   nombre: string;
//   rol: TRol;
//   updated_at: Date;
//   rolDescripcion: string;

//   constructor(userData: Omit<TUser, 'rolDescripcion'>) {
//     this.activo = userData.activo;
//     this.correo = userData.correo;
//     this.created_at = userData.created_at;
//     this.id = userData.id;
//     this.nombre = userData.nombre;
//     this.rol = userData.rol;
//     this.updated_at = userData.updated_at;
//     this.rolDescripcion = userData.rol.descripcion; // Asignación de rolDescripcion
//   }
// }
