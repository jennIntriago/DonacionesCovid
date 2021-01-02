// @flow
/**
 * @file Página de búsqueda.
 * @author Jennifer Intriago <jennifergabriela52@gmail.com>
 */

import { html, render, directive, Part, TemplateResult } from 'lit-html';
import { app } from '..';
import '../../css/search.css';
import { DonationAPI } from '../services/donationAPI';
import { DonationResponse } from '../interfaces/DonationResponse';

const Search = {
  /**
   * @description Datos de la página de búsqueda.
   */
  data: {
    donations: [],
  },

  /**
   * @description Métodos disponibles para la página de búsqueda,
   * y que cambiarán datos dentro del template.
   */
  methods: {
    // TODO: Documentar todos estos métodos y refactorizar, en caso
    // de ser necesario
    renderDonations: directive(
      (func: () => Promise<DonationResponse[]>) => async (part: Part) => {
        part.setValue(html`<span>Cargando...</span>`);

        const data = await Promise.resolve(func());

        part.setValue(
          html`${data.map(
            (item) => html`<div class="item-search">
              <label class="item-search-data">
                <p><strong>Cédula:</strong></p>
                <p>${item.idcard}</p>
              </label>
              <label class="item-search-data">
                <p><strong>Donador:</strong></p>
                <p>${item.donor}</p>
              </label>
              <label class="item-search-data">
                <p><strong>Beneficiario:</strong></p>
                <p>${item.recipient}</p>
              </label>
              ${item.type === 'material'
                ? html`<label class="item-search-data">
                    <p><strong>Descripción:</strong></p>
                    <p>${item.description}</p>
                  </label>`
                : html`<label class="item-search-data">
                    <p><strong>Monto:</strong></p>
                    <p>$${item.ammount}</p>
                  </label>`}

              <label class="item-search-data">
                <p><strong>Fecha:</strong></p>
                <p>
                  ${new Date(item.createdAt).toLocaleString('es-ES', {
                    dateStyle: 'medium',
                  })}
                </p>
              </label>
            </div>`
          )}`
        );

        part.commit();
      }
    ),
  },

  /**
   * @description Función que retorna el template HTML para la página de búsqueda.
   * @returns {TemplateResult} Template de la página de búsqueda.
   */
  template: (): TemplateResult => {
    const { methods } = Search;

    const view = html`
      <h1>¡Busca donaciones!</h1>
      <section class="container-form-donate">
        <form class="form-donate-search">
          <label for="donador" title="Tu nombre">
            <span class="title-input">Donador</span>
            <div class="main-donate">
              <i class="fas fa-user"></i>
              <input type="text" id="usuario" placeholder="Ej. Jennifer" />
            </div>
          </label>
          <label for="cedula" title="tu cédula">
            <span class="title-input">Cédula del donador</span>
            <div class="main-donate">
              <i class="fas fa-id-card"></i>
              <input
                type="number"
                id="usuario"
                placeholder="Escriba aquí"
                step="1"
                min="0"
              />
            </div>
          </label>
          <label for="beneficiario" title="Nombre del beneficiario">
            <span class="title-input">Beneficiario</span>
            <div class="main-donate">
              <i class="fas fa-user"></i>
              <input type="text" placeholder="Ej. Jesús" />
            </div>
          </label>

          <label for="fechaDesde" title="Fecha desde">
            <span class="title-input">Desde</span>
            <div class="main-donate">
              <i class="fas fa-calendar"></i>
              <input type="date" class="input-calendar" />
            </div>
          </label>

          <label for="fechaHasta" title="Fecha hasta">
            <span class="title-input">Hasta</span>
            <div class="main-donate">
              <i class="fas fa-calendar"></i>
              <input type="date" class="input-calendar" />
            </div>
          </label>

          <input
            type="submit"
            value="Consultar"
            class="button-send-donate"
            title="Boton para consultar"
          />

          <div class="container-card-search">
            ${methods.renderDonations(DonationAPI.get)}
          </div>
        </form>
      </section>
    `;
    return view;
  },

  /**
   * @description Función que actualiza el template, se utiliza cuando cambian los datos.
   */
  update: () => {
    render(Search.template(), app);
  },
};

export default Search;
