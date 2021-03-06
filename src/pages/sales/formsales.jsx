import React from "react";
import Alerts from "styles/js/alerts";
import { useRef, useState, useEffect } from "react";
import { postSales, editProducts } from "utils/api";
import { nanoid } from "nanoid";

const FormSales = ({
  setWiewTable,
  seller,
  setSalesDb, 
  salesDb,
  products,
  setProducts,
  setproductsRow,
  productsRow,
}) => {
  const form = useRef(null);
  const [controlInventory, setControlInventory] = useState({});
  console.log("controlInventory: ", controlInventory);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const newSale = {};
    fd.forEach((value, key) => {
      newSale[key] = value;
      //console.log("newSale: ", newSale)
    });

    const listProducts = Object.keys(newSale)

      .map((k) => {
        if (k.includes("products")) {
          const listP = productsRow.filter((v) => v._id === newSale[k])[0];
          return listP;
        }
        return null;
      })
      .filter((v) => v);

    //Funcion para obtener la longitud de un objeto
    const getLengthOfObject = (obj) => {
      let lengthOfObject = Object.keys(obj).length;
      //console.log(lengthOfObject);
      return lengthOfObject;
    };
    //console.log("listProducts: ", listProducts)
    //console.log("newSale: ", newSale)

    for (var i = 0; i < getLengthOfObject(listProducts); i++) {
      listProducts[i]["quantity"] = parseInt(newSale["cantidad_" + i]);
      listProducts[i]["subtotal"] = parseInt(
        listProducts[i]["quantity"] * listProducts[i]["value_"]
      );
      newSale["totalVenta"] =
        parseInt(newSale["totalVenta"]) + listProducts[i]["subtotal"];
    
      const data = listProducts[i].inventory - listProducts[i].quantity
      const updateProduct = async () => {
        await editProducts(
          listProducts[i]._id,
          {inventory:data} ,
          (response) => {
            console.log(response.data);
          },
          (error) => {
            Alerts.alertError();
            console.error("_____error", error);
          }
        );
      };
      updateProduct();
    }
    //console.log("listProducts: ", listProducts)
    //console.log("newSale: ", newSale)

    const saleInputs = {
      cod: newSale.cod,
      date: newSale.date,
      id_customer: newSale.id_customer,
      customer: newSale.customer,
      seller: seller.filter((s) => s._id === newSale.seller)[0],
      products: listProducts,
      total_value: newSale.totalVenta,
    };

    console.log("listProducts: ", listProducts);

    await postSales(
      saleInputs,
      (response) => {
        //console.log("Data enviada: ", response.data);
        const bodyAlert = "??Guardado!";
        const mensaje = "Operaci??n exitosa";
        Alerts.alertSucees(mensaje, bodyAlert);
      },
      (error) => {
        console.error("Este es el error: ", error);
        Alerts.alertError();
      },
      setWiewTable(true)
    );
  };

  return (
    <>
      <form ref={form} className="needs-validation" onSubmit={submitForm}>
        <div className="card-header">
          <h4>Formulario de registro</h4>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="cod">COD</label>
            <input
              name="cod"
              type="number"
              className="form-control "
              required
              autoComplete="off"
              placeholder="0001"
            />
            <div className="invalid-feedback">
              El campo no puede quedar vac??o.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date">FECHA</label>
            <input
              name="date"
              type="date"
              className="form-control "
              required
              autoComplete="off"
              placeholder="dd/mm/aaaa"
            />
            <div className="invalid-feedback">
              El campo no puede quedar vac??o.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="id_customer">ID CLIENTE</label>
            <input
              name="id_customer"
              type="number"
              className="form-control "
              required
              autoComplete="off"
              placeholder=""
            />
            <div className="invalid-feedback">
              El campo no puede quedar vac??o.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="customer">CLIENTE</label>
            <input
              name="customer"
              type="text"
              className="form-control "
              required
              autoComplete="off"
              placeholder=""
            />
            <div className="invalid-feedback">
              El campo no puede quedar vac??o.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="seller">Vendedor</label>
            <select
              className="form-control select2"
              name="seller"
              defaultValue=""
              
            >
              <option disabled value="">
                Seleccione un opci??n
              </option>
              {seller.map((el) => {
                if (el.role === "Vendedor") {
                  return (
                    <option
                      key={nanoid()}
                      value={el._id}
                    >{`${el.name} ${el.lastname}`}</option>
                  );
                }
              })}
            </select>
            <div className="invalid-feedback">
              El campo no puede quedar vac??o.
            </div>
          </div>
          <div class="card card-primary">
            <div class="card-header">
              <h4>A??adir productos</h4>
              <div class="card-header-action"></div>
            </div>
            <div class="card-body">
              <div className="form-group">
                <Productstable
                  products={products}
                  setProducts={setProducts}
                  setproductsRow={setproductsRow}
                  setControlInventory={setControlInventory}
                />
                <div className="invalid-feedback">
                  El campo no puede quedar vac??o.
                </div>
              </div>
            </div>
          </div>

          <div className="form-group hidden" style={{ display: "none" }}>
            <label htmlFor="totalVenta">TOTAL DE LA VENTA</label>
            <input
              name="totalVenta"
              value={0}
              type="number"
              className="form-control "
              autoComplete="off"
              placeholder=""
            />
            <div className="invalid-feedback">
              El campo no puede quedar vac??o.
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

const Productstable = ({
  products,
  setProducts,
  setproductsRow,
  setControlInventory,
}) => {
  const [productsForAdd, setProductsForAdd] = useState({});
  const [rowTable, setRowTable] = useState([]);

  useEffect(() => {
    setproductsRow(rowTable);
  }, [rowTable, setproductsRow]);

  const addNewProductTable = () => {
    setRowTable([...rowTable, productsForAdd]);
    setProducts(products.filter((v) => v._id !== productsForAdd._id));
    setProductsForAdd({});
  };

  const deleteRowTable = (productRowDelete) => {
    setRowTable(rowTable.filter((x) => x._id !== productRowDelete._id));
    setProducts([...products, productRowDelete]);
  };

  const editProducts_ = (products, quantity) => {
    setRowTable(
      rowTable.map((ft) => {
        if (ft._id === products.id) {
          ft.quantity = quantity;
          ft.total = products.value_ * quantity;
        }
        return ft;
      })
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-11">
          <select
            className="form-control select2"
            value={productsForAdd._id ?? ""}
            onChange={(e) =>
              setProductsForAdd(
                products.filter((x) => x._id === e.target.value)[0]
              )
            }
            // name={name_select}
          >
            <option disabled value="">
              Seleccione un opci??n
            </option>
            {products.map((em) => {
              if (em.status === "Disponible") {
                return (
                  <option
                    key={nanoid()}
                    value={em._id}
                  >{`${em.name} ${em.value_}`}</option>
                );
              }
            })}
          </select>
        </div>
        <div classname="col-1">
          <button
            type="button"
            onClick={() => addNewProductTable()}
            className="btn btn-primary mt-1"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PRODUCTO</th>
              <th scope="col">ESTADO</th>
              <th scope="col">VALOR</th>
              <th scope="col">CANTIDAD</th>
              <th scope="col">SUBTOTAL</th>
              <th scope="col">ELIMINAR</th>
              <th className="hidden" style={{ display: "none" }}>
                input
              </th>
            </tr>
          </thead>
          <tbody>
            {rowTable.map((el, index) => {
              return (
                <RowProduct
                  key={el._id}
                  prod={el}
                  index={index}
                  deleteRowTable={deleteRowTable}
                  editProducts_={editProducts_}
                  rowTable={rowTable}
                  setproductsRow={setproductsRow}
                  setControlInventory={setControlInventory}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RowProduct = ({
  prod,
  index,
  deleteRowTable,
  editProducts_,
  rowTable,
  setControlInventory,
}) => {
  const [product, setProduct] = useState(prod);

  useEffect(() => {
    if (product.quantity <= product.inventory) {
      console.log("Si hay existencias");
    } else {
      if (product.quantity != undefined) {
        const bodyAlert = "??Inventario Inficiente!";
        const mensaje =
          "Por favor elija un numero igual o menor a: " + product.inventory;
        Alerts.alertErrorMessage(mensaje, bodyAlert);
      }
    }
    setControlInventory(product);
  }, [product.quantity]);

  return (
    <tr>
      <td scope="row">{index + 1}</td>
      <td>{product.name}</td>
      <td>{product.status}</td>
      <td>{product.value_}</td>
      <td>
        <label htmlFor={`valor_${index}`}>
          <input
            type="number"
            name={`cantidad_${index}`}
            value={product.quantity}
            onChange={(e) => {
              editProducts_(
                product,
                e.target.value === "" ? "0" : e.target.value
              );
              setProduct({
                ...product,
                quantity: e.target.value === "" ? "0" : e.target.value,
                total:
                  parseFloat(product.value_) *
                  parseFloat(e.target.value === "" ? "0" : e.target.value),
              });
            }}
          />
        </label>
      </td>
      <td>{parseFloat(product.total ?? 0)}</td>
      <td>
        <div class="d-flex justify-content-center">
          <button
            onClick={() => deleteRowTable(product)}
            className="btn btn-warning mt-1 "
          >
            <i class="fas fa-minus-circle"></i>
          </button>
        </div>
      </td>
      <td className="hidden" style={{ display: "none" }}>
        <input hidden defaultValue={product._id} name={`products_${index}`} />
      </td>
    </tr>
  );
};

export default FormSales;
