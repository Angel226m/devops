 

import { axiosClient } from '../api/axiosClient';
import { UsuarioRepository } from '../../application/ports/out/UsuarioRepository';
import { Usuario, NuevoUsuarioRequest, ActualizarUsuarioRequest, UsuarioIdioma, AsignarIdiomaRequest } from '../../domain/entities/Usuario';
import { endpoints } from '../api/endpoints';

export class UsuarioRepoHttp implements UsuarioRepository {
  async getAll(): Promise<Usuario[]> {
    const response = await axiosClient.get(endpoints.usuario.base);
    return response.data.data;
  }

  async getById(id: number): Promise<Usuario> {
    const response = await axiosClient.get(endpoints.usuario.byId(id));
    return response.data.data;
  }

  async getByRol(rol: string): Promise<Usuario[]> {
    const response = await axiosClient.get(endpoints.usuario.byRol(rol));
    return response.data.data;
  }

  async create(usuario: NuevoUsuarioRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.usuario.base, usuario);
    return response.data.data.id;
  }

  async update(id: number, usuario: ActualizarUsuarioRequest): Promise<void> {
    await axiosClient.put(endpoints.usuario.byId(id), usuario);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.usuario.byId(id));
  }

  // NUEVOS MÉTODOS PARA IDIOMAS
  async getUsuarioIdiomas(userId: number): Promise<UsuarioIdioma[]> {
    const response = await axiosClient.get(`/admin/usuarios/${userId}/idiomas`);
    return response.data.data;
  }

  async asignarIdioma(userId: number, idioma: AsignarIdiomaRequest): Promise<void> {
    await axiosClient.post(`/admin/usuarios/${userId}/idiomas`, idioma);
  }

  async desasignarIdioma(userId: number, idiomaId: number): Promise<void> {
    await axiosClient.delete(`/admin/usuarios/${userId}/idiomas/${idiomaId}`);
  }

  async actualizarTodosIdiomas(userId: number, idiomasIds: number[]): Promise<void> {
    await axiosClient.put(`/admin/usuarios/${userId}/idiomas`, { idiomas_ids: idiomasIds });
  }
}