import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button, Grid } from "@mui/material";
import AdminMenu from "../components/adminMenu";
import AddIcon from "@mui/icons-material/Add";
import ModalComponent from "../components/Modal";
import useGlobalState from "../store";
import TableComponent from "../components/table";
import { COMMON_SERVICE } from "../services/common.services";
import { setPositionsData } from "../store/actions";
import AddPositionForm from "../components/addPositionForm";

const positionsHeader = ["S.no", "Name", "Actions"];

const Positions = () => {

  const {
    state: {
      positions
    },
    dispatch
  } = useGlobalState();

  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => setOpenModal(!openModal);

  const getAllPositions = async () => {
    try {
      const responseData = await COMMON_SERVICE.getPositions();

      if (responseData.success) {
        dispatch(setPositionsData({
          positions: [...responseData.data]
        }));
      }
    } catch (error) {
      console.log("error in getAllPositions ", error);
    }
  }

  useEffect(() => {
    getAllPositions();
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
                Positions
              </p>

              <Button startIcon={<AddIcon />} variant="outlined" color="primary" className="addUserButton" onClick={handleModal} >
                Add Position
              </Button>
            </div>

            <div className="lowerContentDiv" >
              <TableComponent
                headerArray={positionsHeader}
                dataArray={positions}
                modalTitle="Edit Position"
                fetchData={getAllPositions}
                canEdit={true}
                canDelete={true}
              />
            </div>
          </div>
        </Grid>
      </Grid>
      {
        openModal &&
        <ModalComponent
          open={openModal}
          onClose={handleModal}
          title="Add Position"
          actionType="add"
          fetchData={getAllPositions}
        >
          <AddPositionForm />
        </ModalComponent>
      }
    </Layout>
  )
}

export default Positions;