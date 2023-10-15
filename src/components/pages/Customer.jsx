import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import NotFound from "../NotFound";
import { baseUrl } from "../shared";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Customer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState();
  const [tempCustomer, setTempCustomer] = useState();
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //custom modal

  const [sho, setSho] = useState(false);

  const handleClos = () => setSho(false);
  const handleSho = () => setSho(true);

  useEffect(() => {
    if (!customer) return;
    if (!customer) return;

    let equal = true;
    if (customer.name !== tempCustomer.name) equal = false;
    if (customer.industries !== tempCustomer.industries) equal = false;

    if (equal) setChanged(false);
  });

  useEffect(() => {
    const url = baseUrl + "api/customers/" + id;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 404) {
          navigate("/notfound");
        }

        if (!response.ok) {
          throw new Error("Something went wrong, try again later");
        }

        return response.json();
      })

      .then((data) => {
        setCustomer(data.customer);
        setTempCustomer(data.customer);
        setError(undefined);
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  function updateCustomer(e) {
    e.preventDefault();
    const url = baseUrl + "api/customers/" + id;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempCustomer),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Something went wrong");
        }
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        navigate("/customers");
      })
      .then((data) => {
        setCustomer(data.customer);
        setChanged(false);
        setError(undefined);
      })
      .catch((e) => {
        setError(e.message);
      });
  }

  return (
    <div class="p-3">
      {customer ? (
        <div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/4">
              <label for="name">Name</label>
            </div>

            <div className="md:w-3/4">
              <p>{tempCustomer.name}</p>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/4">
              <label for="industries">Industry</label>
            </div>

            <div className="md:w-3/4">
              <p>{tempCustomer.industries}</p>
            </div>
          </div>{" "}
          <br />
          <br />
          {/* edit modal starts here */}
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
            onClick={handleSho}
          >
            Edit
          </Button>
          <Modal
            show={sho}
            onHide={handleClos}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{tempCustomer.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form
                className="w-full max-w-sm"
                id="customer"
                onSubmit={updateCustomer}
              >
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/4">
                    <label for="name">Name</label>
                  </div>

                  <div className="md:w-3/4">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="name"
                      type="text"
                      value={tempCustomer.name}
                      onChange={(e) => {
                        setChanged(true);
                        setTempCustomer({
                          ...tempCustomer,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/4">
                    <label for="industries">Industry</label>
                  </div>

                  <div className="md:w-3/4">
                    <input
                      id="industries"
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      value={tempCustomer.industries}
                      onChange={(e) => {
                        setChanged(true);
                        setTempCustomer({
                          ...tempCustomer,
                          industries: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div className="mb-2">
                <button
                  className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 mr-2 rounded"
                  onClick={() => {
                    handleClos();
                    setTempCustomer({ ...customer });
                    setChanged(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  form="customer"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          {/* end of edit modal */}
          <span> </span>
          {/* delete modal sarts here */}
          <Button
            className="bg-red-600 hover:bg-red-600 text-white font-bold py-2 px-4"
            onClick={handleShow}
          >
            Delete
          </Button>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{tempCustomer.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this entry?</Modal.Body>
            <Modal.Footer>
              <Button
                className="bg-slate-800 hover:bg-slate-500"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
              <button
                className="bg-red-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  const url = baseUrl + "api/customers/" + id;
                  fetch(url, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((response) => {
                      if (response.status === 401) {
                        throw new Error("Something went wrong");
                      }
                      if (!response.ok) {
                        throw new Error("Something went wrong");
                      }
                      navigate("/customers");
                    })
                    .catch((e) => {
                      setError(e.message);
                    });
                }}
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : null}

      {error ? <p>{error}</p> : null}
      <br />
      <Link to="/customers">
        <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          ← Go back
        </button>
      </Link>
    </div>
  );
}
