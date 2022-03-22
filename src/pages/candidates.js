import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button, Grid } from "@mui/material";
import AdminMenu from "../components/adminMenu";
import AddIcon from "@mui/icons-material/Add";
import CandidateForm from "../components/candidateForm";
import ModalComponent from "../components/Modal";
import useGlobalState from "../store";
import TableComponent from "../components/table";
import { COMMON_SERVICE } from "../services/common.services";
import { setCandidatesData } from "../store/actions";
import Loader from "../components/loader";

const candidateHeader = ["S.no", "Name", "Email", "Position", "Party", "Bio", "Actions"];

const Candidates = () => {

  const {
    state: {
      candidates
    },
    dispatch
  } = useGlobalState();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleModal = () => setOpenModal(!openModal);

  const getAllCandidates = async () => {
    try {
      const responseData = await COMMON_SERVICE.getCandidates();

      if (responseData.success) {
        dispatch(setCandidatesData({
          candidates: [...responseData.data]
        }));
      }
    } catch (error) {
      console.log("error in getAllCandidates ", error);
    }
  }

  useEffect(() => {
    getAllCandidates();
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
                Candidates
              </p>

              <Button startIcon={<AddIcon />} variant="outlined" color="primary" className="addUserButton" onClick={handleModal} >
                Add Candidate
              </Button>
            </div>

            <div className="lowerContentDiv" >
              {
                loading ?
                <Loader />
                :
                <TableComponent
                  headerArray={candidateHeader}
                  dataArray={candidates}
                  modalTitle="Edit Candidate"
                  fetchData={getAllCandidates}
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
          title="Add Candidate"
          actionType="add"
          fetchData={getAllCandidates}
        >
          <CandidateForm />
        </ModalComponent>
      }
    </Layout>
  )
}

export default Candidates;