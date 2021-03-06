import React, { useState, useEffect } from "react";
import Alerts from "styles/js/alerts";
import { useRef } from "react";
import { postProducts } from "utils/api";

const FormProducts = ({ setWiewTable }) => {
  const [estado, setEstado] = useState("");
  const [inventario, setInventario] = useState(0);
  console.log("inventario", inventario)
  console.log("estado", estado)

  useEffect(() => {
    if(inventario > 0){
      setEstado("Disponible")
    }else{
      setEstado("No disponible")
    }
  }, [inventario])

  const form = useRef(null);
  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);
    const newProduct = {};
    fd.forEach((value, key) => {
      newProduct[key] = value;
    });
    await postProducts(
      {
        cod: newProduct.cod,
        name: newProduct.name,
        description: newProduct.description,
        value_: newProduct.value_,
        inventory: newProduct.inventory,
        status: newProduct.status,
      },
      (response) => {
        console.log("data enviada", response.data);
        const bodyAlert = "¡Guardado!";
        const mensaje = "Operación exitosa";
        Alerts.alertSucees(mensaje, bodyAlert);
      },
      (error) => {
        console.error("Este es el error", error);
        Alerts.alertError();
      }
    );
    setWiewTable(true);
  };

  return (
    <>
      <form ref={form} className="needs-validation" onSubmit={submitForm}>
        <div className="card-header">
          <h4>Formulario de registro</h4>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="cod">Cod</label>
            <input
              name="cod"
              type="text"
              className="form-control "
              required
              autoComplete="off"
              placeholder="00001"
            />
            <div className="invalid-feedback">
              El campo no puede quedar vacío.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Producto</label>
            <input
              name="name"
              type="text"
              className="form-control "
              required
              autoComplete="off"
              placeholder="Camilo Camilo"
            />
            <div className="invalid-feedback">
              El campo no puede quedar vacío.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <input
              name="description"
              type="text"
              className="form-control "
              required
              autoComplete="off"
              placeholder=""
            />
            <div className="invalid-feedback">
              El campo no puede quedar vacío.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="value_">Valor</label>
            <input
              name="value_"
              type="text"
              className="form-control "
              required
              autoComplete="off"
              placeholder=""
            />
            <div className="invalid-feedback">
              El campo no puede quedar vacío.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="value_">Inventario</label>
            <input
              name="inventory"
              type="number"
              className="form-control "
              onChange={(e)=>{setInventario(e.target.value)}}
              value={inventario}
              required
              autoComplete="off"
              placeholder=""
            />
            <div className="invalid-feedback">
              El campo no puede quedar vacío.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              className="form-control select2"
              name="status"
              value={estado}
            >
              <option>{estado}</option>
            </select>
            <div className="invalid-feedback">
              El campo no puede quedar vacío.
            </div>
          </div>
        </div>
        <div className=" d-flex justify-content-end flex-wrap my-2">
          <button
            className="btn btn-primary btn-lg rounded mx-2 my-2"
            type="submit"
          >
            Guardar
          </button>
          <button
            onClick={() => Alerts.alertWarning()}
            className="btn btn-danger btn-lg  rounded mx-2 my-2"
            type="reset"
          >
            Eliminar
          </button>
        </div>
      </form>
    </>
  );
};

export default FormProducts;
