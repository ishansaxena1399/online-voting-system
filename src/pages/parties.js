import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button, Grid } from "@mui/material";
import AdminMenu from "../components/adminMenu";
import AddIcon from "@mui/icons-material/Add";
import AddPartyForm from "../components/addPartyForm";
import ModalComponent from "../components/Modal";
import useGlobalState from "../store";
import TableComponent from "../components/table";
import { COMMON_SERVICE } from "../services/common.services";
import { setPartiesData } from "../store/actions";
import Loader from "../components/loader";

const partiesHeader = ["S.no", "Name", "Actions"];

const Parties = () => {

  const {
    state: {
      parties
    },
    dispatch
  } = useGlobalState();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleModal = () => setOpenModal(!openModal);

  const getAllParties = async () => {
    try {
      setLoading(true);
      const responseData = await COMMON_SERVICE.getParties();

      if (responseData.success) {
        dispatch(setPartiesData({
          parties: [...responseData.data]
        }));
      }
    } catch (error) {
      console.log("error in getAllParties ", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAllParties();
  }, []);

  return (
    <Layout>
      <Grid container className="containerGrid">
        <Grid item md={2} className="adminMenuGrid" >
          <AdminMenu />
        </Grid>

        <Grid item md={10} xs={12} sm={12} >
          <div className="mainContentDiv" >
            <div className="upperContentDiv" >
              <p>
                Parties
              </p>

              <Button startIcon={<AddIcon />} variant="outlined" color="primary" className="addUserButton" onClick={handleModal} >
                Add Party
              </Button>
            </div>

            <div className="lowerContentDiv" >
              {
                loading ?
                <Loader />
                :
                <TableComponent
                  headerArray={partiesHeader}
                  dataArray={parties}
                  modalTitle="Edit Party"
                  fetchData={getAllParties}
                  canEdit={true}
                  canDelete={true}
                />
              }
            </div>
          </div>
        </Grid>
      </Grid>
      {
        openModal &&
        <ModalComponent
          open={openModal}
          onClose={handleModal}
          title="Add Party"
          actionType="add"
          fetchData={getAllParties}
        >
          <AddPartyForm />
        </ModalComponent>
      }
    </Layout>
  )
}

export default Parties;